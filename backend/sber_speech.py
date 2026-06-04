import subprocess
from dataclasses import dataclass

from speech.core.interfaces import AudioSourceInterface
from speech.core.models import AudioFormat, RecognitionResult
from speech.providers.sber import SberSpeechRecognizer as ArtemSberSpeechRecognizer


@dataclass
class AudioContentType:
    value: str


class UploadedAudioSource(AudioSourceInterface):
    def __init__(self, audio_bytes: bytes, content_type: str):
        self._audio_data = audio_bytes
        self._content_type = content_type or "audio/ogg;codecs=opus"
        self._format = self._resolve_format(self._content_type)

    def get_audio_data(self) -> bytes:
        return self._audio_data

    def get_format(self):
        return self._format

    def get_metadata(self):
        return {
            "size": len(self._audio_data),
            "content_type": self._content_type,
        }

    @staticmethod
    def _resolve_format(content_type: str):
        normalized = content_type.lower()
        if normalized.startswith("audio/ogg"):
            return AudioContentType("audio/ogg;codecs=opus")
        if normalized.startswith("audio/mpeg") or normalized.startswith("audio/mp3"):
            return AudioFormat.MP3
        if normalized.startswith("audio/wav"):
            return AudioFormat.WAV
        if normalized.startswith("audio/flac"):
            return AudioFormat.FLAC
        if normalized.startswith("audio/opus"):
            return AudioFormat.OPUS
        if normalized.startswith("audio/x-pcm"):
            return AudioContentType("audio/x-pcm;bit=16;rate=16000")
        return AudioFormat.OGG


class SberSpeechRecognizer:
    def __init__(self, authorization: str):
        self.authorization = authorization

    def recognize(self, audio_bytes: bytes, content_type: str) -> RecognitionResult:
        if not self.authorization:
            return RecognitionResult(success=False, error="SBER_AUTHORIZATION is not set in .env")

        prepared_bytes = audio_bytes
        prepared_content_type = content_type or "audio/ogg;codecs=opus"

        if prepared_content_type.startswith("audio/webm"):
            prepared_bytes = self._convert_webm_to_pcm(audio_bytes)
            prepared_content_type = "audio/x-pcm;bit=16;rate=16000"

        recognizer = ArtemSberSpeechRecognizer(
            {
                "authorization": self.authorization,
            }
        )
        audio_source = UploadedAudioSource(prepared_bytes, prepared_content_type)
        return recognizer.recognize(audio_source)

    @staticmethod
    def _convert_webm_to_pcm(audio_bytes: bytes) -> bytes:
        try:
            import imageio_ffmpeg
        except ImportError as error:
            raise RuntimeError("imageio-ffmpeg is required to recognize WebM audio") from error

        completed = subprocess.run(
            [
                imageio_ffmpeg.get_ffmpeg_exe(),
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                "pipe:0",
                "-ac",
                "1",
                "-ar",
                "16000",
                "-f",
                "s16le",
                "pipe:1",
            ],
            input=audio_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
            timeout=60,
        )
        return completed.stdout
