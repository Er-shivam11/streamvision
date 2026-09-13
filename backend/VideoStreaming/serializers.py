# serializers.py
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import serializers
from .models import MediaFile

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        user = authenticate(**data)
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return user


class MediaFileSerializer(serializers.ModelSerializer):
    hls = serializers.SerializerMethodField()

    def get_hls(self, media_file):
        if not media_file.hls:
            return None

        hls_path = str(media_file.hls).lstrip('/')
        if hls_path.startswith('media/'):
            hls_path = hls_path[len('media/'):]

        return f'{settings.MEDIA_URL.rstrip("/")}/{hls_path}'

    class Meta:
        model = MediaFile
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'hls', 'media_type', 'created_at']
