import { LoadingSpinner } from '../loading-spinner/loading-spinner'
import styles from './action-button.module.css'

type Props = {
  readonly variant?: 'alt'
  readonly children?: React.ReactNode | string
  readonly isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const ActionButton = ({
  children,
  isLoading,
  variant,
  ...rest
}: Props) => (
  <button
    className={variant === 'alt' ? styles.altActionBtn : styles.actionBtn}
    disabled={isLoading}
    type="button"
    {...rest}
  >
    {isLoading ? <LoadingSpinner size="xs" /> : <span>{children}</span>}
  </button>
)
