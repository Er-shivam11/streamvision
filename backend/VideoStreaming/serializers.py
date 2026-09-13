# serializers.py
from django.contrib.auth import authenticate
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
    class Meta:
        model = MediaFile
        fields = ['id', 'title', 'description', 'file', 'thumbnail', 'hls', 'media_type', 'created_at']
