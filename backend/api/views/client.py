import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.permissions import IsClient
from api.models import Project, ClientJob, Transcript, User, ProjectClient
from django.shortcuts import get_object_or_404
from api.serializers import ClientJobSerializer, ClientJobDetailedSerializer, TranscriptSerializer

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
    permission_classes = [AllowAny]
    
    def get(self, request, system_url_name):
        # Find the project by URL name
        project = get_object_or_404(Project, url_name=system_url_name)

        out = {
            'id': project.id,
            'name': project.name,
            'url_name': project.url_name,
            'description': project.description,
            'logo': project.logo.url if project.logo else None,
            'color': project.main_color,
            'available_languages': [
                {'id': lang.id, 'name': lang.name, 'code': lang.code} for lang in project.get_supported_languages()
            ],
        }

        # Check if authorized user is a client of the project
        try:
            if request.user.is_authenticated and request.user.is_client:
                project_client = ProjectClient.objects.filter(client=request.user, project=project).first()

                if request.user.is_authenticated and request.user.is_client and project_client:
                    # Get jobs for this user
                    jobs = ClientJob.objects.filter(user=request.user)
                    jobs_serializer = ClientJobSerializer(jobs, many=True)
                    out['jobs'] = jobs_serializer.data

        except ProjectClient.DoesNotExist:
            project_client = None

        data = {
            'system': out
        }
        
        return Response(data)
    
class JobViewSet(APIView):
    permission_classes = [IsAuthenticated, IsClient]

    def get(self, request, job_id):
        # Find the job by ID
        job = get_object_or_404(ClientJob, id=job_id)

        # Check if the user is authorized to view this job
        if job.user != request.user:
            return Response({'error': 'You do not have permission to view this job.'}, status=403)

        # Serialize the job data
        serializer = ClientJobDetailedSerializer(job)
        
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ClientJobDetailedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        print('ERR', serializer.errors, request.data, flush=True)
        return Response(serializer.errors, status=400)
    
    def put(self, request, job_id):
        # Find the job by ID
        job = get_object_or_404(ClientJob, id=job_id)

        # Check if the user is authorized to update this job
        if job.user != request.user:
            return Response({'error': 'You do not have permission to update this job.'}, status=403)

        # Update the job data
        print('PUT', request.data, flush=True)
        serializer = ClientJobDetailedSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, job_id):
        # Find the job by ID
        job = get_object_or_404(ClientJob, id=job_id)

        # Check if the user is authorized to delete this job
        if job.user != request.user:
            return Response({'error': 'You do not have permission to delete this job.'}, status=403)

        # Delete the job
        job.delete()
        return Response({'message': 'Job deleted successfully.'}, status=204)
    
class TranscriptView(APIView):
    permission_classes = [IsAuthenticated, IsClient]

    def get(self, request, transcript_id):
        # Find the transcript by ID
        transcript = get_object_or_404(Transcript, id=transcript_id)

        # Check if the user is authorized to view this transcript
        if transcript.user != request.user:
            return Response({'error': 'You do not have permission to view this transcript.'}, status=403)

        # Serialize the transcript data
        serializer = TranscriptSerializer(transcript)
        return Response(serializer.data)
    
    def delete(self, request, transcript_id):
        # Find the transcript by ID
        transcript = get_object_or_404(Transcript, id=transcript_id)
        # Check if the user is authorized to delete this transcript
        if transcript.user != request.user:
            return Response({'error': 'You do not have permission to delete this transcript.'}, status=403)
        # Delete the transcript
        transcript.delete()
        return Response({'message': 'Transcript deleted successfully.'}, status=204)