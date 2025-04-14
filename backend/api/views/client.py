import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsClient
from api.models import Project
from django.shortcuts import get_object_or_404

class SpeechToTextView(APIView):
    """
    Endpoint to transcribe audio data.
    """
    permission_classes = [IsAuthenticated, IsClient]

    def post(self, request, *args, **kwargs):
        """
        Accepts audio data and returns transcription.
        """
        audio_file = request.FILES.get('audio_file')
        if not audio_file:
            return Response({'error': 'No audio file provided.'}, status=400)
        audio_buffer = BytesIO()
        audio_buffer.name = audio_file.filename
        audio_buffer.write(audio_file.read())

        transcriber = WhisperTranscriber()
        raw_transcription = transcriber(audio_buffer)

        return Response({'transcription': raw_transcription}, status=200)

class ClientSystemView(APIView):
    permission_classes = [IsAuthenticated, IsClient]
    
    def get(self, request, system_url_name):
        # Find the project by URL name
        project = get_object_or_404(Project, url_name=system_url_name)
        
        # Optional: Check if this client has access to this system
        # if not project.clients.filter(id=request.user.id).exists():
        #     return Response({"detail": "You don't have access to this system"}, status=403)
        
        # Get data for this system
        # You can customize this based on what data your client needs
        data = {
            'system': {
                'id': project.id,
                'name': project.name,
                'url_name': project.url_name,
                'description': project.description,
                'logo': project.logo.url if project.logo else None,
                'color': project.main_color,
            },
            # Add more system-specific data here
        }
        
        return Response(data)