package audio

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type ToFileProcessor struct {
	OutputDir string
}

func NewToFileProcessor(outputDir string) *ToFileProcessor {				
	os.MkdirAll(outputDir,
		0755) // rwxr-xr-x
	return &ToFileProcessor{
		OutputDir: outputDir,
	}
}

func (p *ToFileProcessor) ProcessAudio(audio AudioData) error {
	// закрыть поток
	defer func() {
		if audio.Reader != nil {
			audio.Reader.Close()
		}
	}()
	
	filename := fmt.Sprintf("%s_%d.%s",
		audio.Metadata.Source,
		audio.Metadata.ReceivedAt.Unix(),
		audio.Metadata.Format,
	)
	
	fullPath := filepath.Join(p.OutputDir, filename)
	
	file, err := os.Create(fullPath)
	if err != nil {
		return fmt.Errorf("ошибка создания файла: %w", err)
	}
	defer file.Close()
	
	if audio.Reader != nil {
		size, err := io.Copy(file, audio.Reader)
		if err != nil {
			return fmt.Errorf("ошибка сохранения из потока: %w", err)
		}
		fmt.Printf("файл из потока: %s (%d байт)\n", filename, size)
		
	} else if len(audio.Data) > 0 {
		size, err := file.Write(audio.Data) 
		if err != nil {
			return fmt.Errorf("ошибка сохранения байтов: %w", err)
		}
		fmt.Printf("файл из байтов: %s (%d байт)\n", filename, size)
		
	} else {
		return fmt.Errorf("нет данных для сохранения: и Reader, и Data пусты")
	}
	
	return nil
}