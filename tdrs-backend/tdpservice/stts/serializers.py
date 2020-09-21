"""Serialize stt data."""

from rest_framework import serializers

from tdpservice.stts.models import Region, STT


class STTSerializer(serializers.ModelSerializer):
    """STT serializer."""

    code = serializers.SerializerMethodField()

    class Meta:
        """Metadata."""

        model = STT
        fields = ["id", "type", "code", "name"]

    def get_code(self, obj):
        """Return the state code."""
        if obj.type == STT.STTType.TRIBE:
            return obj.state.code
        return obj.code


class RegionSerializer(serializers.ModelSerializer):
    """Region serializer."""

    stts = STTSerializer(many=True)

    class Meta:
        """Metadata."""

        model = Region
        fields = ["id", "stts"]
