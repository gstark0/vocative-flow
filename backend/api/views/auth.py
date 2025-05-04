from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Project, ProjectClient

class CreatorTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # First validate credentials using parent class
        data = super().validate(attrs)
        
        # Check if user is a creator
        if not self.user.is_creator:
            raise PermissionDenied(
                detail="Only creators can access this application",
                code=status.HTTP_403_FORBIDDEN
            )
            
        # Add additional user info to response
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['id'] = self.user.id
        
        return data

class ClientTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # First validate credentials using parent class
        data = super().validate(attrs)
        
        # Check if user is a client
        if not self.user.is_client:
            raise PermissionDenied(
                detail="Only clients can access this application",
                code=status.HTTP_403_FORBIDDEN
            )
        
        # Get project from context or request
        request = self.context.get('request')
        url_name = request.data.get('system_url_name') if request else None

        if not url_name:
            raise PermissionDenied(
                detail="URL name is required",
                code=status.HTTP_400_BAD_REQUEST
            )

        requested_project = get_object_or_404(Project, url_name=url_name)
        
        # Check if this client has access to this specific project
        if not ProjectClient.objects.filter(client=self.user, project=requested_project).exists():
            raise PermissionDenied(
                detail="You don't have access to this project",
                code=status.HTTP_403_FORBIDDEN
            )
            
        # Add additional user info to response
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['id'] = self.user.id
        
        return data

class CreatorTokenObtainPairView(TokenObtainPairView):
    serializer_class = CreatorTokenObtainPairSerializer

class ClientTokenObtainPairView(TokenObtainPairView):
    serializer_class = ClientTokenObtainPairSerializer

class SystemClientTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Get system URL name from context
        system_url_name = self.context['system_url_name']
        
        # Check if system exists
        try:
            project = Project.objects.get(url_name=system_url_name)
        except Project.DoesNotExist:
            raise NotFound("System not found")
            
        # Validate credentials
        data = super().validate(attrs)
        
        # Check if user is a client
        if not self.user.is_client:
            raise PermissionDenied("Only clients can access this system")
            
        # Check if this client has access to this specific project
        if not ProjectClient.objects.filter(client=self.user, project=project).exists():
            raise PermissionDenied("You don't have access to this project")
            
        # Add additional data
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['id'] = self.user.id
        data['system'] = {
            'id': project.id,
            'name': project.name,
            'url_name': project.url_name
        }
        
        return data

class SystemClientTokenView(TokenObtainPairView):
    serializer_class = SystemClientTokenSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['system_url_name'] = self.kwargs['system_url_name']
        return context