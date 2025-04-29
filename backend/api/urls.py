# api/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views.auth import CreatorTokenObtainPairView, ClientTokenObtainPairView, SystemClientTokenView
from .views.flow import FlowViewSet
from .views.projects import ProjectViewSet, GeneralSettingsView
from .views.client import ClientSystemView  # This will be a new view

# Create a router for project endpoints
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

urlpatterns = [
    # Creator auth endpoints
    path('token/', CreatorTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Legacy client auth endpoint (could be deprecated later)
    path('client/token/', ClientTokenObtainPairView.as_view(), name='client_token_obtain_pair'),

    # System-specific client endpoints
    path('client/<str:system_url_name>/token/', SystemClientTokenView.as_view(), name='system_client_token'),
    path('client/<str:system_url_name>/token/refresh/', TokenRefreshView.as_view(), name='system_token_refresh'),
    path('client/<str:system_url_name>/data/', ClientSystemView.as_view(), name='client_system_data'),
    path('client/<str:system_url_name>/login-data/',  ClientSystemView.as_view(), name='client_system_login_data'),

    # Include project routes from router
    path('', include(router.urls)),
    path('settings/', GeneralSettingsView.as_view(), name='general-settings'),

    # Flow endpoints
    path('projects/<int:project_id>/flow/', FlowViewSet.as_view({
        'get': 'list',
        'post': 'save'
    }), name='project-flow'),
]