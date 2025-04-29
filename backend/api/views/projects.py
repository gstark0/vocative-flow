# views/projects.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from api.permissions import IsCreator
from api.models import Project, SupportedTranscriptLanguage
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

    @action(detail=True, methods=['patch'])
    def update_languages(self, request, pk=None):
        """
        Update only the supported languages for a project
        """
        project = self.get_object()
        
        # Validate language IDs
        language_ids = request.data.get('language_ids', [])
        if not isinstance(language_ids, list):
            return Response(
                {"error": "language_ids must be a list of integers"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Use the serializer to update languages
        serializer = self.get_serializer(project, data={'language_ids': language_ids}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Return updated project data
        return Response(serializer.data)
    
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
    
class GeneralSettingsView(APIView):
    """
    API endpoint for general settings
    """
    permission_classes = [IsAuthenticated, IsCreator]
    
    def get(self, request):
        """
        Get the general settings
        """

        all_languages = SupportedTranscriptLanguage.objects.all()
        settings = {
            "transcript_languages": all_languages.values('id', 'name', 'code'),
        }
        return Response(settings)