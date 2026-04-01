from pathlib import Path
from typing import Union, Dict, Any
from ..core.interfaces import AudioSourceInterface
from ..core.models import AudioFormat


class LocalFileSource(AudioSourceInterface):    
    def __init__(self, file_path: Union[str, Path], audio_format: AudioFormat = None):
        self.file_path = Path(file_path)
        
        if not self.file_path.exists():
            raise FileNotFoundError(f"file not found: {file_path}")
        
        if audio_format is None:
            self._format = AudioFormat.from_extension(self.file_path.suffix[1:])
        
        self._metadata = {
            'filename': self.file_path.name,
            'path': str(self.file_path),
            'size': self.file_path.stat().st_size,
            'extension': self.file_path.suffix
        }
        
        self._audio_data = None
    
    def get_audio_data(self) -> bytes:
        if self._audio_data is None:
            with open(self.file_path, 'rb') as f:
                self._audio_data = f.read()
        return self._audio_data
    
    def get_format(self) -> AudioFormat:
        return self._format
    
    def get_metadata(self) -> Dict[str, Any]:
        return self._metadata