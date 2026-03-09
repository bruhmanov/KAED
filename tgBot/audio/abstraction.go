package audio


import (
	"io"
	"time"
)

const (
	telegram = "TELEGRAM"
	web = "WEB"
	maxe = "MAX"
)


// данные об аудио
type AudioMetadata struct {
	Source      string    // откуда: telegram/web/maxe/...
	Duration    int       // длительность в секундах
	FileSize    int64     // размер в байтах
	Format      string    // формат (ogg, mp3, etc)
	ReceivedAt  time.Time // время получения
}

// интерфейс для получения аудио
type AudioSource interface {
	Start() error
	Stop() error
	// Возвращает канал с аудиоданными
	GetAudioChannel() <-chan AudioData
}

// байты/поток и AudioMetadata
type AudioData struct {
	Metadata AudioMetadata
	// Reader для чтения аудиоданных
	Reader   io.ReadCloser
	// Слайс байтов, если файл небольшой
	Data     []byte
}

// обработчик аудио
type AudioProcessor interface {
	ProcessAudio(audio AudioData) error
}