from speech import (
    LocalFileSource,
    SberSpeechRecognizer,
 
)


def example():
    
    sber_auth = {
        'authorization': 'Basic MDE5ZDQ5ODUtNDFiNS03OWE1LTljNzktNWQ3OTUyMjM3YzBiOjNhYzBlZDNhLWNjNjMtNDg2ZS05MmMzLTMwYjFhNTAxNDNmNg=='
    }
    
    sber = SberSpeechRecognizer(sber_auth)
    
    audio = LocalFileSource("2.mp3")
    
    result = sber.recognize(audio)
    print(result)

    
if __name__ == "__main__":
    example()