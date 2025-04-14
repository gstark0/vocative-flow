from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project, Node
import uuid

@receiver(post_save, sender=Project)
def create_default_nodes(sender, instance, created, **kwargs):
    """
    Creates default input and output nodes when a new project is created.
    """
    if created:
        user_id = str(instance.creator.id)
        project_id = str(instance.id)
        
        # Create input node with a unique ID
        input_node = Node.objects.create(
            node_internal_id=f"{user_id}_{project_id}_input",
            project=instance,
            type='input_node',
            label='Transcripts',
            position_x=100,
            position_y=100,
        )
        
        # Create output node with a unique ID
        output_node = Node.objects.create(
            node_internal_id=f"{user_id}_{project_id}_output",
            project=instance,
            type='output_node',
            label='Output',
            position_x=800,
            position_y=100,
        )