import uuid
import requests
import time
from typing import Dict, Any, List, Optional
from ..core.interfaces import SpeechRecognizerInterface
from ..core.models import RecognitionResult, AudioFormat
from ..core.interfaces import AudioSourceInterface


class SberTokenManager:

    def __init__(self, auth_config: Dict[str, str], verify_ssl: bool = False):
        """
        Args:
            auth_config:
                {
                    'url': 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth', # optional
                    'scope': 'SALUTE_SPEECH_PERS', # optional
                    'rquid': '...', # optional
                    'authorization': 'Basic ...'
                }
        """
        self.url = auth_config.get('url', 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth')
        self.scope = auth_config.get('scope', 'SALUTE_SPEECH_PERS')
        self.rquid = auth_config.get('rquid', str(uuid.uuid4()))
        self.authorization = auth_config.get('authorization')
        self.verify_ssl = verify_ssl
        self._token = None
        self._expires_at = None
    
    def get_token(self) -> str:
        current_time = time.time()
        
        if self._token is None or self._expires_at is None or current_time >= self._expires_at - 60:
            self._refresh_token()
        
        return self._token
    
    def _refresh_token(self):
        payload = {'scope': self.scope}
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': self.rquid,
            'Authorization': self.authorization
        }
        
        try:
            response = requests.post(
                self.url,
                headers=headers,
                data=payload,
                verify=self.verify_ssl
            )
            response.raise_for_status()
            
            data = response.json()
            self._token = data.get('access_token')
            
            expires_at = data.get('expires_at')
            if expires_at:
                self._expires_at = int(expires_at) // 1000
            else:
                self._expires_at = time.time() + 1800 
                
        except requests.RequestException as e:
            raise Exception(f"token sber fail: {e}")


class SberSpeechRecognizer(SpeechRecognizerInterface):
    
    def __init__(self, auth_config: Dict[str, str], config: Dict = None):
        self.token_manager = SberTokenManager(auth_config)
        self.url = "https://smartspeech.sber.ru/rest/v1/speech:recognize"
        
        self.default_config = {
            'language': 'ru-RU',
            'enable_profanity_filter': 'false',
            'model': 'general',
            'sample_rate': '16000'
        }
        self.default_config.update(config or {})
    
    def recognize(self, audio_source: AudioSourceInterface, **kwargs) -> RecognitionResult:
        import time
        start_time = time.time()
        
        try:
            token = self.token_manager.get_token()
            
            params = self.default_config.copy()
            params.update(kwargs)
            
            audio_data = audio_source.get_audio_data()
            audio_format = audio_source.get_format()
            
            headers = {
                'Content-Type': audio_format.value,
                'Authorization': f'Bearer {token}'
            }
            
            response = requests.post(
                self.url,
                headers=headers,
                params=params,
                data=audio_data,
                verify=False
            )
            
            processing_time = time.time() - start_time
            
            if response.status_code == 200:
                result_data = response.json()
                text, confidence = self._parse_response(result_data)
                
                return RecognitionResult(
                    success=True,
                    text=text,
                    confidence=confidence,
                    raw_response=result_data,
                    status_code=response.status_code,
                    processing_time=processing_time
                )
            else:
                return RecognitionResult(
                    success=False,
                    error=f"HTTP {response.status_code}: {response.text}",
                    status_code=response.status_code,
                    raw_response=response.text,
                    processing_time=processing_time
                )
                
        except Exception as e:
            return RecognitionResult(
                success=False,
                error=str(e),
                processing_time=time.time() - start_time
            )
    
    def _parse_response(self, response: Dict) -> tuple:
        """
        {
            "result": ["Предложение №1", "Предложение №2", ...],
            "emotions": [...],
            "person_identity": {},
            "status": 200
        }
        """
        if 'result' in response and response['result']:
            result_list = response['result']
            full_text = ' '.join(result_list)
            confidence = 0.0
            return full_text, confidence
        
        return '', 0.0
    
    def get_name(self) -> str:
        return "Sber SmartSpeech"
    
    def get_supported_formats(self) -> List[AudioFormat]:
        return [AudioFormat.MP3, AudioFormat.WAV, AudioFormat.OGG, 
                AudioFormat.OPUS, AudioFormat.FLAC]
    
    def is_available(self) -> bool:
        try:
            self.token_manager.get_token()
            return True
        except:
            return False