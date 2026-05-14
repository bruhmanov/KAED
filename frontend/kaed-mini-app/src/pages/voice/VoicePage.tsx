import {
  Mic,
  Square,
  Upload,
} from 'lucide-react'

import {
  useRef,
  useState,
} from 'react'

import Page from '../../shared/ui/Page'

import Card from '../../shared/ui/Card'

import {
  createVoiceTask,
} from '../../shared/api/tasks'

import {
  hapticImpact,
} from '../../app/telegram/telegram'

interface Transcript {
  id: string

  text: string
}

export default function VoicePage() {
  const [
    recording,
    setRecording,
  ] = useState(false)

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    transcripts,
    setTranscripts,
  ] = useState<
    Transcript[]
  >([])

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(
      null
    )

  const chunksRef = useRef<
    Blob[]
  >([])

  async function startRecording() {
    try {
      hapticImpact('medium')

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        )

      const mediaRecorder =
        new MediaRecorder(
          stream
        )

      mediaRecorderRef.current =
        mediaRecorder

      chunksRef.current = []

      mediaRecorder.ondataavailable =
        (event) => {
          chunksRef.current.push(
            event.data
          )
        }

      mediaRecorder.onstop =
        async () => {
          try {
            setLoading(true)

            const audioBlob =
              new Blob(
                chunksRef.current,
                {
                  type: 'audio/webm',
                }
              )

            const result =
              await createVoiceTask(
                audioBlob
              )

            setTranscripts(
              (prev) => [
                {
                  id:
                    crypto.randomUUID(),
                  text:
                    result.text,
                },
                ...prev,
              ]
            )
          } catch (error) {
            console.error(error)
          } finally {
            setLoading(false)
          }
        }

      mediaRecorder.start()

      setRecording(true)
    } catch (error) {
      console.error(error)
    }
  }

  function stopRecording() {
    hapticImpact('heavy')

    mediaRecorderRef.current?.stop()

    setRecording(false)
  }

  async function handleUpload(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      const file =
        event.target.files?.[0]

      if (!file) {
        return
      }

      setLoading(true)

      hapticImpact('light')

      const result =
        await createVoiceTask(
          file
        )

      setTranscripts(
        (prev) => [
          {
            id:
              crypto.randomUUID(),
            text: result.text,
          },
          ...prev,
        ]
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Page title="Голос">
      <div className="space-y-6">
        <Card className="flex flex-col items-center py-14">
          <button
            onClick={
              recording
                ? stopRecording
                : startRecording
            }
            disabled={loading}
            className={`
              w-32
              h-32
              rounded-full
              flex
              items-center
              justify-center
              shadow-2xl
              transition
              ${
                recording
                  ? 'bg-red-500'
                  : 'bg-primary'
              }
            `}
          >
            {recording ? (
              <Square
                size={48}
              />
            ) : (
              <Mic size={48} />
            )}
          </button>

          <div className="mt-8 text-2xl font-bold">
            {recording
              ? 'Идет запись...'
              : loading
              ? 'Обработка...'
              : 'Начать запись'}
          </div>

          <div className="text-muted mt-2 text-center">
            {recording
              ? 'Нажмите для остановки'
              : 'Голосовые задачи через Sber Speech'}
          </div>
        </Card>

        <Card>
          <label className="w-full h-14 bg-background border border-border rounded-2xl flex items-center justify-center gap-3 cursor-pointer">
            <Upload size={20} />

            Загрузить аудиофайл

            <input
              type="file"
              accept="audio/*"
              onChange={
                handleUpload
              }
              className="hidden"
            />
          </label>
        </Card>

        <Card>
          <div className="text-xl font-bold">
            Последние расшифровки
          </div>

          <div className="mt-4 space-y-4">
            {transcripts.length ===
              0 && (
              <div className="text-muted">
                Нет расшифровок
              </div>
            )}

            {transcripts.map(
              (
                transcript
              ) => (
                <div
                  key={
                    transcript.id
                  }
                  className="bg-background rounded-2xl p-4"
                >
                  {
                    transcript.text
                  }
                </div>
              )
            )}
          </div>
        </Card>
      </div>
    </Page>
  )
}