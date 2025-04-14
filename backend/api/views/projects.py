# views/projects.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsCreator
from api.models import Project
from api.serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing projects
    """
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsCreator]
    
    def get_queryset(self):
        """
        Return only projects created by the current user
        """
        return Project.objects.filter(creator=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """
        Set the creator to the current user
        """
        serializer.save(creator=self.request.user)
    
    @action(detail=False, methods=['get'])
    def check_url_name(self, request):
        """
        Check if a URL name is available
        """
        url_name = request.query_params.get('url_name')
        if not url_name:
            return Response(
                {"error": "URL name parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exists = Project.objects.filter(url_name=url_name).exists()
        return Response({"available": not exists})