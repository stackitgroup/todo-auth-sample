import {
  ModalState,
  toggleModal
} from '@/contexts/ui/infrastructure/modal.store'
import { motion } from 'framer-motion'
import ReactDOM from 'react-dom'
import { Backdrop } from './components/backdrop'
import './modal.css'

type Props = {
  readonly children: React.ReactNode
  readonly modalKey: keyof ModalState
  readonly title: string
  readonly size?: 'sm' | 'md' | 'lg' | 'xl'
  readonly isForFetching?: boolean
}

const dropIn = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 30,
      stiffness: 500
    }
  },
  exit: { opacity: 0, y: -100 }
}

const sizes = {
  sm: { width: 'clamp(40%, 400px, 90%)', height: 'min(70%, 280px)' },
  md: { width: 'clamp(50%, 800px, 90%)', height: 'min(70%, 800px)' },
  lg: { width: 'clamp(50%, 1000px, 90%)', height: 'min(70%, 900px)' },
  xl: { width: 'clamp(50%, 1200px, 90%)', height: 'min(80%, 580px)' }
}

export const Modal: React.FC<Props> = ({
  children,
  modalKey,
  title,
  size,
  isForFetching = false
}: Props) => {
  const modalRoot = document.getElementById('modal-root')

  if (!modalRoot) return null

  return ReactDOM.createPortal(
    <Backdrop onClick={() => (isForFetching ? {} : toggleModal(modalKey))}>
      <motion.div
        animate="visible"
        exit="exit"
        initial="hidden"
        style={{
          width: sizes[size ? (size as keyof typeof sizes) : 'md'].width,
          height: sizes[size ? (size as keyof typeof sizes) : 'md'].height
        }}
        variants={dropIn}
      >
        <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
          {isForFetching ? null : (
            <header className="modal-header">
              <h4 className="modal-title">{title}</h4>

              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                onClick={() => toggleModal(modalKey)}
                type="button"
              >
                <span aria-hidden="true">close</span>
              </button>
            </header>
          )}
          {isForFetching ? <div className="-pt-10" /> : null}
          <div className="modal-children-container">{children}</div>
        </div>
      </motion.div>
    </Backdrop>,
    modalRoot
  )
}
