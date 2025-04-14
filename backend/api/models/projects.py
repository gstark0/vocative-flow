# models/projects.py
from django.db import models
from api.models.users import User
import re
import random
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from colorfield.fields import ColorField  # You'll need to install django-colorfield

def validate_url_name(value):
    """
    Validate that the URL name contains only lowercase letters, numbers, and hyphens
    """
    if not re.match(r'^[a-z0-9-]+$', value):
        raise ValidationError(
            'URL name can only contain lowercase letters, numbers, and hyphens.'
        )

def project_logo_path(instance, filename):
    """
    Generate a unique path for project logos
    """
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a path with project url_name
    return f'project_logos/{instance.url_name}.{ext}'

class Project(models.Model):
    """
    Represents systems or projects created by a Creator.
    """
    name = models.CharField(max_length=255)
    url_name = models.CharField(
        max_length=30, 
        unique=True,
        validators=[validate_url_name],
        help_text="URL name for client access (e.g., 'my-project' for flow.vocative.ai/client/my-project/)",
    )
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'creator'})
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Add logo field
    logo = models.ImageField(
        upload_to=project_logo_path,
        blank=True,
        null=True,
        help_text="Logo image for the project"
    )
    
    # Add color field (requires django-colorfield)
    main_color = ColorField(
        default='#007FFF',
        help_text="Main brand color for the project interface"
    )

    def __str__(self):
        return self.name