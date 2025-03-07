import { motion } from 'framer-motion'
import './backdrop.css'

type Props = {
  readonly children: React.ReactNode
  readonly onClick: () => void
}

export const Backdrop = ({ children, onClick }: Props) => (
  <div onClick={onClick}>
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        height: 'calc(100vh)',
        width: '100vw',
        background: '#18181881',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '999',
        overflow: 'hidden'
      }}
    >
      {children}
    </motion.div>
  </div>
)
