from rest_framework import serializers
from api.models import Project, Node, Edge, AINode, CodeNode, TemplateNode, Example, SupportedTranscriptLanguage, ProjectSupportedTranscriptLanguage
from django.db import transaction
from django.db.utils import IntegrityError

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['id', 'name', 'input_text', 'output_text']

class AINodeDataSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True, read_only=True)
    
    class Meta:
        model = AINode
        fields = ['prompt', 'examples']

class CodeNodeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeNode
        fields = ['code']

class TemplateNodeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateNode
        fields = ['template']

class NodeSerializer(serializers.ModelSerializer):
    ai_data = AINodeDataSerializer(read_only=True)
    code_data = CodeNodeDataSerializer(read_only=True)
    template_data = TemplateNodeDataSerializer(read_only=True)
    id = serializers.CharField(source='node_internal_id')
    
    class Meta:
        model = Node
        fields = ['id', 'type', 'position_x', 'position_y', 'ai_data', 'code_data', 'template_data']

    def to_representation(self, instance):
        # Get the base representation
        ret = super().to_representation(instance)
        print('ret', ret)
        
        # Format data based on node type
        node_data = {
            'label': instance.label,
            'examples': [],
            'id': ret['id']
        }

        # Add AI node data
        if instance.type == 'ai_node':
            node_data['prompt'] = ret['ai_data']['prompt']
            for example in ret['ai_data']['examples']:
                node_data['examples'].append({
                    'name': example['name'],
                    'input': example['input_text'],
                    'output': example['output_text']
                })
        # Code ndoe
        elif instance.type == 'code_node' and ret['code_data']:
            node_data['code'] = ret['code_data']['code']

        # Template node
        elif instance.type == 'template_node':
            node_data['template'] = ret['template_data']['template']

        # Build the final structure
        return {
            'id': str(ret['id']),
            'type': ret['type'],
            'data': node_data,
            'position': {
                'x': ret['position_x'],
                'y': ret['position_y']
            },
            'sourcePosition': "right" if instance.type == "input_node" else None,
            'targetPosition': "left" if instance.type == "output_node" else None
        }

class EdgeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='edge_internal_id')

    class Meta:
        model = Edge
        fields = ['id', 'source', 'target']
        
    def to_representation(self, instance):
        return {
            'id': instance.id,
            'source': str(instance.source.node_internal_id),
            'target': str(instance.target.node_internal_id),
            'markerEnd': { 'type': 'arrowclosed' }
        }

class ProjectFlowSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    edges = EdgeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'nodes', 'edges']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        return {
            'nodes': ret['nodes'],
            'edges': ret['edges']
        }


class ProjectSerializer(serializers.ModelSerializer):
    supported_languages = serializers.SerializerMethodField()
    language_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'url_name', 'description', 'created_at', 'logo', 'main_color', 'supported_languages', 'language_ids']
        read_only_fields = ['created_at']

    def get_supported_languages(self, obj):
        project_languages = ProjectSupportedTranscriptLanguage.objects.filter(project=obj)
        return ProjectSupportedTranscriptLanguageSerializer(project_languages, many=True).data
    
    def validate_url_name(self, value):
        """
        Validate URL name is unique
        """
        if not value:
            return value
            
        # When updating, exclude the current instance from check
        instance = self.instance
        queryset = Project.objects.filter(url_name=value)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)
            
        if queryset.exists():
            raise serializers.ValidationError("This URL name is already in use.")
        return value
    
    def create(self, validated_data):
        # Extract language_ids before creating project
        language_ids = validated_data.pop('language_ids', [])
        
        # Create the project
        project = super().create(validated_data)
        
        # Add default language(s) to project
        en_language = SupportedTranscriptLanguage.objects.get(code='en')
        self._update_languages(project, [en_language.id])
        
        return project
    
    def update(self, instance, validated_data):
        # Extract language_ids if provided
        language_ids = validated_data.pop('language_ids', None)
        
        # Use transaction to ensure changes are committed
        with transaction.atomic():
            # Update the project
            instance = super().update(instance, validated_data)
            print(f"Updated project {instance.id} with data: {validated_data}")
            
            # Update languages if language_ids was provided
            if language_ids is not None:
                print(f"Updating languages for project {instance.id} with: {language_ids}")
                self._update_languages(instance, language_ids)
                
                # Verify the changes were made
                final_langs = ProjectSupportedTranscriptLanguage.objects.filter(project=instance)
                final_lang_ids = [rel.language.id for rel in final_langs]
                print(f"Final languages after update: {final_lang_ids}")
        
        return instance
    
    def _update_languages(self, project, language_ids):
        """
        Update the languages for a project with error handling for integrity errors
        """
        print('CALLED', flush=True)
        if language_ids is not None:
            print(language_ids, flush=True)
            # Get existing languages to avoid duplicates
            existing_languages = ProjectSupportedTranscriptLanguage.objects.filter(project=project)
            existing_language_ids = [rel.language.id for rel in existing_languages]
            print('EXISTING', existing_language_ids, flush=True)
            
            # Languages to remove (in existing but not in new list)
            languages_to_remove = [
                rel for rel in existing_languages 
                if rel.language.id not in language_ids
            ]
            
            # Languages to add (in new list but not in existing)
            languages_to_add = [
                lang_id for lang_id in language_ids 
                if lang_id not in existing_language_ids
            ]
            print('TO REMOVE', languages_to_remove, flush=True)
            print('TO ADD', languages_to_add, flush=True)
            
            # Delete languages that are no longer needed
            for rel in languages_to_remove:
                rel.delete()
            
            # Add new languages
            for lang_id in languages_to_add:
                try:
                    language = SupportedTranscriptLanguage.objects.get(pk=lang_id)
                    print('LANGUAGE', language, flush=True)
                    ProjectSupportedTranscriptLanguage.objects.create(
                        project=project,
                        language=language
                    )
                    print(f"Added language {language.name} to project {project.id}")
                except SupportedTranscriptLanguage.DoesNotExist:
                    # Language doesn't exist, skip it
                    pass
                except IntegrityError:
                    # In case of race condition, just skip this one
                    pass
    
class SupportedTranscriptLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportedTranscriptLanguage
        fields = ['id', 'name', 'code']

class ProjectSupportedTranscriptLanguageSerializer(serializers.ModelSerializer):
    language = SupportedTranscriptLanguageSerializer(read_only=True)
    language_id = serializers.PrimaryKeyRelatedField(
        queryset=SupportedTranscriptLanguage.objects.all(),
        source='language',
        write_only=True
    )
    
    class Meta:
        model = ProjectSupportedTranscriptLanguage
        fields = ['id', 'language', 'language_id']
