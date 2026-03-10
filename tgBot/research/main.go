package main

import (
    "fmt"
    "log"
    "os"
    "os/signal"
    "syscall"
    Z "github.com/rezerfordiy/audio"

)

func main() {
    sigChan := make(chan os.Signal, 1)
    signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

    token := os.Getenv("TOKEN")
    if token == "" {
        log.Fatal("токен не найден в переменных окружения")
    }

    telegramSource, err := Z.NewTelegramSource(token)
    if err != nil {
        log.Fatalf("ошибка создания телеграм источника: %v", err)
    }

    if err := telegramSource.Start(); err != nil {
        log.Fatalf("ошибка запуска источника: %v", err)
    }

    toFileProcessor := Z.NewToFileProcessor("output/")
    
    // Канал для отслеживания завершения горутины
    done := make(chan struct{})
    
    go func() {
        defer close(done)
        for audioData := range telegramSource.GetAudioChannel() {
            if err := toFileProcessor.ProcessAudio(audioData); err != nil {
                log.Printf("ошибка обработки аудио: %v", err)
            }
        }
    }()

    // Ожидание сигнала завершения
    <-sigChan
    fmt.Println("получен сигнал завершения, останавливаемся...")
    
    // Остановка источника
    telegramSource.Stop()
    
    // Ожидание завершения горутины
    <-done
    fmt.Println("программа завершена")
}