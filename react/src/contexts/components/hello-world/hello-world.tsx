import { ActionButton } from '@/contexts/components/common/action-button/action-button'
import { Chart } from '@/contexts/components/common/chart/chart'
import { helloWorldService } from '@/contexts/features/hello-world/application/hello-world.service'
// #region Zustand
import {
  HelloWorldState,
  useHelloWorldStore
} from '@/contexts/features/hello-world/infrastructure/hello-world.store'
// #endregion Zustand
import { useTranslation } from 'react-i18next'

export const HelloWorldView = () => {
  const { t, i18n } = useTranslation()
  const counter = useHelloWorldStore((s: HelloWorldState) => s.counter)

  const updateNumber = (event: 'increase' | 'decrease') => {
    helloWorldService.updateCounter(event)
  }

  const handleLanguage = () => {
    const en = 'en'
    const es = 'es'
    const currentLanguage = i18n.language
    if (currentLanguage === es) {
      i18n.changeLanguage(en)
    }
    if (currentLanguage === en) {
      i18n.changeLanguage(es)
    }
    return
  }

  return (
    <div className="text-center">
      <Chart />
      <h1 className="mt-20 font-extrabold text-7xl">{t('hello_cli')}</h1>
      <h2>
        {t('current_counter')}: {counter}
      </h2>
      <div className="flex items-center justify-center gap-5">
        <ActionButton
          onClick={() => updateNumber('decrease')}
        >
          -
        </ActionButton>
        <ActionButton
          onClick={() => updateNumber('increase')}
        >
          +
        </ActionButton>
        <ActionButton onClick={() => helloWorldService.ping()}>
          Pin
        </ActionButton>
      </div>
      <div className="mt-20 flex items-center justify-center">
        <ActionButton onClick={handleLanguage}>
          {t('change_language')}
        </ActionButton>
      </div>
    </div>
  )
}
