package audio

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)
// телеграмный источник
type TelegramSource struct {
	bot          *tgbotapi.BotAPI
	audioChan    chan AudioData // канал to
	updates      tgbotapi.UpdatesChannel // канал from
	ctx          context.Context // для отслеживания завершения
	cancel       context.CancelFunc // функция для заверешния
}
// получаем ноаый источник
func NewTelegramSource(token string) (*TelegramSource, error) {
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		return nil, fmt.Errorf("ошибка создания бота: %w", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	
	return &TelegramSource{
		bot:       bot,
		audioChan: make(chan AudioData, 100), 
		ctx:       ctx,
		cancel:    cancel,
	}, nil
}
// очев
func (ts *TelegramSource) Start() error {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	
	ts.updates = ts.bot.GetUpdatesChan(u)
	// слушаем канал в другой горутине
	go ts.listenForUpdates()
	
	return nil
}
// остановка плюс проверка не остановились ли уже
func (ts *TelegramSource) Stop() error {
    select {
    case <-ts.ctx.Done():
        return nil
    default:
        ts.cancel()
        close(ts.audioChan)
        return nil
    }
}
// очев
func (ts *TelegramSource) GetAudioChannel() <-chan AudioData {
	return ts.audioChan
}
// слушаем пока не получили сигнал о завершении 
func (ts *TelegramSource) listenForUpdates() {
	for {
		select {
		case <-ts.ctx.Done():
			return
		case update := <-ts.updates:
			if update.Message == nil || update.Message.Voice == nil {
				continue
			}
			
			ts.handleVoiceMessage(update.Message)
		}
	}
}
//очев
func (ts *TelegramSource) handleVoiceMessage(message *tgbotapi.Message) {
	voice := message.Voice
	
	metadata := AudioMetadata{
		Source:     telegram,
		Duration:   voice.Duration,
		FileSize:   int64(voice.FileSize),
		Format:     "ogg",
		ReceivedAt: time.Now(),
	}
	
	reader, err := ts.downloadAudio(voice.FileID)
	if err != nil {
		fmt.Printf("Ошибка скачивания аудио: %v\n", err)
		return
	}
	
	// Отправляем в канал
	ts.audioChan <- AudioData{
		Metadata: metadata,
		Reader:   reader,
	}
	
}
// очев
func (ts *TelegramSource) downloadAudio(fileID string) (io.ReadCloser, error) {
	// название файла у бота
	file, err := ts.bot.GetFile(tgbotapi.FileConfig{FileID: fileID})
	if err != nil {
		return nil, fmt.Errorf("ошибка получения информации о файле: %w", err)
	}
	
	// ссылка для скачивания (увы без токена ссылка не получится)
	fileURL := file.Link(ts.bot.Token)
	
	resp, err := http.Get(fileURL)
	if err != nil {
		return nil, fmt.Errorf("ошибка скачивания: %w", err)
	}
	
	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return nil, fmt.Errorf("HTTP ошибка: %s", resp.Status)
	}
	
	return resp.Body, nil
}