from django.db import models
from api.models.projects import Project

class Node(models.Model):
    """
    Base model for all nodes in a flow.
    """
    NODE_TYPES = [
        ('input_node', 'Input'),
        ('output_node', 'Output'),
        ('ai_node', 'AI'),
        ('code_node', 'Code'),
        ('template_node', 'Template'),
    ]
    
    node_internal_id = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='nodes')
    type = models.CharField(max_length=20, choices=NODE_TYPES)
    label = models.CharField(max_length=255)
    position_x = models.FloatField()
    position_y = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.type}: {self.label}"

class Edge(models.Model):
    """
    Represents connections between nodes.
    """
    edge_internal_id = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='edges')
    source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='outputs')
    target = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='inputs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['project', 'source', 'target']]

    def __str__(self):
        return f"{self.source.label} → {self.target.label}"

class AINode(models.Model):
    """
    Additional data for AI nodes.
    """
    node = models.OneToOneField(Node, on_delete=models.CASCADE, related_name='ai_data')
    prompt = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Node: {self.node.label}"
    
class TemplateNode(models.Model):
    """
    Additional data for Template nodes.
    """
    node = models.OneToOneField(Node, on_delete=models.CASCADE, related_name='template_data')
    template = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Template Node: {self.node.label}"

class Example(models.Model):
    """
    Examples for AI nodes.
    """
    ai_node = models.ForeignKey(AINode, on_delete=models.CASCADE, related_name='examples')
    name = models.CharField(max_length=255)
    input_text = models.TextField()
    output_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Example: {self.name} ({self.ai_node.node.label})"

class CodeNode(models.Model):
    """
    Additional data for Code nodes.
    """
    node = models.OneToOneField(Node, on_delete=models.CASCADE, related_name='code_data')
    code = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Code Node: {self.node.label}"