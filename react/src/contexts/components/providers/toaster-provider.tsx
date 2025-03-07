import { Toaster } from 'sonner'

export const ToasterProvider = () => (
  <Toaster
    className="print:hidden"
    closeButton={true}
    duration={10000}
    position="top-right"
    richColors={true}
    visibleToasts={3}
  />
)
