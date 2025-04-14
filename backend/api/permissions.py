from rest_framework import permissions

class IsCreator(permissions.BasePermission):
    """
    Custom permission to only allow creators to access the view.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_creator)

class IsClient(permissions.BasePermission):
    """
    Custom permission to only allow clients to access the view.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_client)

class IsCreatorOrClient(permissions.BasePermission):
    """
    Custom permission to only allow creators or clients to access the view.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_creator or request.user.is_client))