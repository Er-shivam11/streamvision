# views.py

import os
import subprocess
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from .models import MediaFile
from .serializers import LoginSerializer, MediaFileSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer

    def perform_create(self, serializer):
        media_file = serializer.save()
        if media_file.media_type == 'video':
            self.process_video(media_file)

    def process_video(self, media_file):
        video_path = media_file.file.path

        # Create thumbnail
        thumbnail_filename = f"{media_file.id}.jpg"
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', thumbnail_filename)
        os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)

        if not os.path.exists(thumbnail_path):
            subprocess.run([
                'ffmpeg',
                '-i', video_path,
                '-ss', '00:00:03',  # Capture frame at 3 seconds
                '-vframes', '1',    # Output 1 frame
                thumbnail_path
            ], check=True)

            media_file.thumbnail.name = f'thumbnails/{thumbnail_filename}'
            media_file.save()

        # Create HLS directory
        hls_directory = os.path.join(settings.MEDIA_ROOT, 'hls', str(media_file.id))
        os.makedirs(hls_directory, exist_ok=True)
        hls_master_playlist = os.path.join(hls_directory, 'master.m3u8')

        # Transcode video to different resolutions and bitrates
        subprocess.run([
            'ffmpeg', '-i', video_path,
            '-vf', 'scale=640:360', '-c:v', 'libx264', '-b:v', '800k', '-c:a', 'aac', '-strict', '-2',
            '-f', 'hls', '-hls_time', '10', '-hls_playlist_type', 'vod',
            os.path.join(hls_directory, '360p.m3u8'),
            '-vf', 'scale=1280:720', '-c:v', 'libx264', '-b:v', '1400k', '-c:a', 'aac', '-strict', '-2',
            '-f', 'hls', '-hls_time', '10', '-hls_playlist_type', 'vod',
            os.path.join(hls_directory, '720p.m3u8'),
            '-vf', 'scale=1920:1080', '-c:v', 'libx264', '-b:v', '2800k', '-c:a', 'aac', '-strict', '-2',
            '-f', 'hls', '-hls_time', '10', '-hls_playlist_type', 'vod',
            os.path.join(hls_directory, '1080p.m3u8'),
        ], check=True)

        # Create master playlist for adaptive bitrate streaming
        with open(hls_master_playlist, 'w') as f:
            f.write("#EXTM3U\n")
            f.write("#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n")
            f.write("360p.m3u8\n")
            f.write("#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720\n")
            f.write("720p.m3u8\n")
            f.write("#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1920x1080\n")
            f.write("1080p.m3u8\n")

        media_file.hls = f'hls/{media_file.id}/master.m3u8'
        media_file.save()

    @action(detail=False, methods=['get'])
    def list_videos(self, request):
        media_files = MediaFile.objects.all()
        serializer = self.get_serializer(media_files, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def delete_video(self, request, pk=None):
        media_file = self.get_object()
        media_file.delete()
        return Response({"message": "Media deleted successfully"})



