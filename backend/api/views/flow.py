from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsCreator, IsClient, IsCreatorOrClient
from django.shortcuts import get_object_or_404
from django.db import transaction

from api.models import Project, Node, Edge, AINode, CodeNode, Example, TemplateNode
from api.serializers import ProjectFlowSerializer, NodeSerializer, EdgeSerializer

class FlowViewSet(viewsets.ViewSet):
    """
    ViewSet for managing flow nodes and edges.
    """
    permission_classes = [IsCreatorOrClient]
    
    def get_project(self):
        project_id = self.kwargs['project_id']
        #return get_object_or_404(Project, id=project_id, creator=self.request.user)
        return get_object_or_404(Project, id=project_id)

    def list(self, request, project_id=None):
        """
        Get all nodes and edges for a project.
        Uses the serializers to ensure consistent formatting.
        """
        project = self.get_project()
        serializer = ProjectFlowSerializer(project)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def save(self, request, project_id=None):
        """
        Save the entire flow state (nodes and edges).
        """
        project = self.get_project()
        flow_data = request.data
        print(flow_data, flush=True)

        # Start a transaction
        with transaction.atomic():
            # Clear existing nodes and edges
            Node.objects.filter(project=project).delete()
            Edge.objects.filter(project=project).delete()

            nodes_map = {}  # To store node references for creating edges
            
            # Create new nodes
            for node_data in flow_data['nodes']:
                # Use the top-level id instead of looking in data
                node_id = str(node_data['id'])
                position = node_data.get('position', {})
                data = node_data.get('data', {})
                
                # Create base node
                node = Node.objects.create(
                    project=project,
                    node_internal_id=node_id,
                    type=node_data['type'],
                    label=data.get('label', ''),
                    position_x=position.get('x', 0),
                    position_y=position.get('y', 0)
                )
                
                nodes_map[node_id] = node

                # Handle node-specific data
                if node.type == 'ai_node':
                    ai_node = AINode.objects.create(
                        node=node,
                        prompt=data.get('prompt', '')
                    )
                    
                    # Create examples
                    for example in data.get('examples', []):
                        Example.objects.create(
                            ai_node=ai_node,
                            name=example.get('name', ''),
                            input_text=example.get('input', ''),
                            output_text=example.get('output', '')
                        )
                
                elif node.type == 'code_node':
                    CodeNode.objects.create(
                        node=node,
                        code=data.get('code', '')
                    )
                
                elif node.type == 'template_node':
                    TemplateNode.objects.create(
                        node=node,
                        template=data.get('template', '')
                    )

            # Create new edges using foreign keys
            for edge_data in flow_data['edges']:
                source_id = str(edge_data['source'])
                target_id = str(edge_data['target'])
                
                # Get the actual node instances
                source_node = nodes_map.get(source_id)
                target_node = nodes_map.get(target_id)
                
                if source_node and target_node:  # Only create edge if both nodes exist
                    Edge.objects.create(
                        project=project,
                        edge_internal_id=edge_data.get('id', f"xy-edge__{source_id}-{target_id}"),
                        source=source_node,  # Use the actual node instance
                        target=target_node,  # Use the actual node instance
                    )

        # Return the updated flow
        serializer = ProjectFlowSerializer(project)
        return Response(serializer.data)