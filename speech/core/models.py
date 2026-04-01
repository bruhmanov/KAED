from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
from enum import Enum


class AudioFormat(Enum):
    MP3 = "audio/mpeg"
    WAV = "audio/wav"
    OGG = "audio/ogg"
    OPUS = "audio/opus"
    FLAC = "audio/flac"
    PCM = "audio/pcm"
    
    @classmethod
    def from_extension(cls, extension: str) -> 'AudioFormat':
        mapping = {
            'mp3': cls.MP3,
            'wav': cls.WAV,
            'ogg': cls.OGG,
            'opus': cls.OPUS,
            'flac': cls.FLAC,
            'pcm': cls.PCM
        }
        return mapping.get(extension.lower(), cls.MP3)


@dataclass
class RecognitionResult:
    success: bool
    text: str = ""
    confidence: float = 0.0
    alternatives: List[Dict] = field(default_factory=list)
    raw_response: Any = None
    error: Optional[str] = None
    status_code: Optional[int] = None
    processing_time: Optional[float] = None
    
    def __str__(self):
        if self.success:
            return f"{self.text} (confidence: {self.confidence})"
        return f"error: {self.error}"