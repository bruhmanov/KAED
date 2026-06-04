"""interfaces"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from .models import RecognitionResult, AudioFormat


class AudioSourceInterface(ABC):
    
    @abstractmethod
    def get_audio_data(self) -> bytes:
        pass
    
    @abstractmethod
    def get_format(self) -> AudioFormat:
        pass
    
    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        """metadata of audio"""
        pass


class SpeechRecognizerInterface(ABC):
    
    @abstractmethod
    def recognize(self, audio_source: AudioSourceInterface, **kwargs) -> RecognitionResult:
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """name of service"""
        pass
    
    @abstractmethod
    def get_supported_formats(self) -> List[AudioFormat]:
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """check token, api, etc"""
        pass
