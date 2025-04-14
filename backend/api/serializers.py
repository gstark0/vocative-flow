from rest_framework import serializers
from api.models import Project, Node, Edge, AINode, CodeNode, Example

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

class NodeSerializer(serializers.ModelSerializer):
    ai_data = AINodeDataSerializer(read_only=True)
    code_data = CodeNodeDataSerializer(read_only=True)
    id = serializers.CharField(source='node_internal_id')
    
    class Meta:
        model = Node
        fields = ['id', 'type', 'position_x', 'position_y', 'ai_data', 'code_data']

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
    class Meta:
        model = Project
        fields = ['id', 'name', 'url_name', 'description', 'created_at', 'logo', 'main_color']
        read_only_fields = ['created_at']
    
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