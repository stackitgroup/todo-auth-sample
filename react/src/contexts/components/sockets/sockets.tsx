import { realTimeService } from '@/contexts/features/real-time/application/real-time.service'
// #region Zustand
import {
    RealTimeState,
    useRealTimeStore
} from '@/contexts/features/real-time/infrastructure/real-time.store'
// #endregion Zustand
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionButton } from '../common/action-button/action-button'

export const SocketsView = () => {
  const { t } = useTranslation()
  const responseRealTime = useRealTimeStore((s: RealTimeState) => s.response)

  useEffect(() => {
    realTimeService.connect()
  }, [])

  const sendMessage = (msg: string) => {
    realTimeService.sendMessageDumb(msg)
  }

  return (
    <div className="mt-28">
      <div className="flex items-center justify-center gap-5">
        <ActionButton onClick={() => sendMessage('Hello!')}>
          {t('test_web_sockets')}
        </ActionButton>
      </div>
      <h2 className="text-center">{responseRealTime}</h2>
    </div>
  )
}
