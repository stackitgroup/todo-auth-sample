import { Toaster } from 'sonner'

export const ToasterProvider = () => (
  <Toaster
    closeButton={false}
    duration={10000}
    position="bottom-right"
    richColors={true}
    visibleToasts={3}
  />
)
