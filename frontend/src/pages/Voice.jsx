import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Check, Send } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import VoiceOrb from '../components/VoiceOrb.jsx'
import { useAppStore } from '../store/useAppStore.js'

const Top = styled.header`
  margin: 0 0 0 var(--title-indent);

  h1 {
    margin: 0 0 4px;
    font-size: var(--page-title-size);
    line-height: 1.05;
    letter-spacing: 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: var(--body-size);
    line-height: 1.35;
  }
`

const StatusText = styled.div`
  text-align: center;
  margin: 0 0 18px;

  strong {
    display: block;
    color: ${({ active }) => (active ? 'var(--green)' : 'var(--text)')};
    font-size: var(--section-title-size);
    letter-spacing: 0;
    font-weight: 500;
    text-transform: uppercase;
  }

  span {
    color: var(--muted);
    font-size: var(--meta-size);
  }
`

const Report = styled(GlassCard)`
  padding: 4px 16px 16px;
`

const ReportHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-size: var(--section-title-size);
    font-weight: 500;
    letter-spacing: 0;
  }
`

const ReportRows = styled.div`
  display: grid;
  gap: 0;
  border-radius: 13px;
  overflow: hidden;
`

const ReportRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 11px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
  color: #b9bdbb;

  &:last-of-type {
    border-bottom: 0;
  }

  strong {
    color: var(--text);
    font-size: var(--body-size);
    font-weight: 500;
  }

  p {
    grid-column: 2;
    margin: -2px 0 0;
    color: var(--muted);
    font-size: var(--meta-size);
    line-height: 1.35;
  }
`

const Dot = styled.span`
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: ${({ tone }) => tone};
  
`

const SendButton = styled.button`
  width: 100%;
  min-height: 51px;
  margin-top: 11px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #050505;
  background: var(--yellow);
  font-weight: 500;
  letter-spacing: 0;
`

const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 18px;
  color: #050505;
  background: #ff6259;
  border: 0;
  font-size: var(--meta-size);
`

export default function Voice() {
  const { sendVoice, voiceState, voiceResult, favoriteTaskIds, apiError } = useAppStore()
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getPreferredAudioMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setRecordedBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      alert('Не удалось получить доступ к микрофону. Проверь разрешения браузера или Telegram.')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  function toggleRecording() {
    if (isRecording) stopRecording()
    else startRecording()
  }

  async function sendReport() {
    if (!recordedBlob) return
    await sendVoice(recordedBlob)
    setRecordedBlob(null)
  }

  const emptyText = 'Пока ничего не добавлено'
  const resultText = voiceResult?.text || emptyText
  const voiceTask = voiceResult?.task || null
  const isFavoriteTask = voiceTask ? favoriteTaskIds.includes(String(voiceTask.id)) : false
  const doneText = voiceTask && !isFavoriteTask && voiceTask.completed ? resultText : emptyText
  const activeText = voiceTask && !isFavoriteTask && !voiceTask.completed ? resultText : emptyText
  const favoriteText = voiceTask && isFavoriteTask ? resultText : emptyText
  const isUploading = voiceState === 'uploading'
  const sendLabel = isUploading
    ? 'Отправка...'
    : voiceState === 'done'
      ? 'Отчёт отправлен'
      : recordedBlob
        ? 'Отправить отчёт'
        : 'Сначала запиши отчёт'

  return (
    <>
      <Top>
        <h1>Голосовой отчёт</h1>
        <p>Расскажи, что сделал сегодня</p>
      </Top>

      <VoiceOrb active={isRecording} onClick={toggleRecording} />

      <StatusText active={isRecording}>
        <strong>{isRecording ? 'идёт запись' : recordedBlob ? 'запись готова' : 'готов к записи'}</strong>
        <span>{isRecording ? 'Нажми ещё раз, чтобы остановить' : recordedBlob ? 'Можно отправить отчёт' : 'Нажми, скажи текст и останови запись'}</span>
      </StatusText>

      <Report as="section" aria-labelledby="report-title">
        <ReportHeader>
        </ReportHeader>
        <ReportRows>
          <ReportRow><Dot tone="var(--green)" /><strong>Сделано</strong><p>{doneText}</p></ReportRow>
          <ReportRow><Dot tone="var(--blue)" /><strong>В работе</strong><p>{activeText}</p></ReportRow>
          <ReportRow><Dot tone="var(--pink)" /><strong>Избранное</strong><p>{favoriteText}</p></ReportRow>
        </ReportRows>
        <SendButton type="button" onClick={sendReport} disabled={!recordedBlob || isUploading}>
          {sendLabel} {voiceState === 'done' ? <Check size={18} /> : <Send size={18} />}
        </SendButton>
      </Report>

      {apiError && <ErrorBox role="alert">{apiError}</ErrorBox>}
    </>
  )
}

function getPreferredAudioMimeType() {
  const types = [
    'audio/ogg;codecs=opus',
    'audio/webm;codecs=opus',
    'audio/webm',
  ]

  return types.find((type) => MediaRecorder.isTypeSupported(type)) || ''
}
