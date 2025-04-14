# api/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model

# Import your models here, like User and any other models
from .models import User, Project, Node, Edge, AINode, Example, CodeNode

class CustomAdminSite(admin.AdminSite):
    """
    Custom admin site that restricts access based on the user's role.
    Only users with the 'admin' role and is_staff=True can log in.
    """
    def has_permission(self, request):
        # Only allow users with the 'admin' role and is_staff=True to access admin
        user = request.user
        return user.is_active and user.is_staff and user.role == 'admin'

# Instantiate the custom admin site
custom_admin_site = CustomAdminSite(name='custom_admin')

# Register your models with the custom admin site
custom_admin_site.register(User)
custom_admin_site.register(Project)
custom_admin_site.register(Node)
custom_admin_site.register(Edge)
custom_admin_site.register(AINode)
custom_admin_site.register(CodeNode)
custom_admin_site.register(Example)