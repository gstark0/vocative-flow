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
    
    def get_supported_languages(self):
        """
        Get the list of supported languages for this project
        """
        return [lang.language for lang in self.projectsupportedtranscriptlanguage_set.all()]
    
class SupportedTranscriptLanguage(models.Model):
    """
    Represents supported languages for a project.
    """
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=2)
    
    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        verbose_name = "Supported transcript language"
        verbose_name_plural = "Supported transcript languages"

class ProjectSupportedTranscriptLanguage(models.Model):
    """
    Represents the many-to-many relationship between projects and supported languages.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    language = models.ForeignKey(SupportedTranscriptLanguage, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('project', 'language')
        verbose_name = "Project supported transcript language"
        verbose_name_plural = "Project supported transcript languages"
        ordering = ['project', 'language']  

    def __str__(self):
        return f"{self.project.name} - {self.language.name} ({self.language.code})"