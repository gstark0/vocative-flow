from django.db import models
from api.models.users import User
from api.models.projects import Project

class ProjectClient(models.Model):
    """
    Represents a client user associated with a project.
    """
    client = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'client'})
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class ClientJob(models.Model):
    """
    Represents a job created by a client user for a project.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'client'})
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    output_markdown = models.TextField(blank=True, null=True)

class Transcript(models.Model):
    """
    Represents a transcript created by a client user for a project.
    """
    job = models.ForeignKey(ClientJob, on_delete=models.CASCADE, related_name='transcripts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.TextField()