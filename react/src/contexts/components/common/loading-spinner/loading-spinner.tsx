import './loading-spinner.css'

type Props = {
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
const sizes = {
  xs: { width: '12px', height: '12px' },
  sm: { width: '18px', height: '18px' },
  md: { width: '24px', height: '24px' },
  lg: { width: '32px', height: '32px' },
  xl: { width: '48px', height: '48px' }
}

export const LoadingSpinner = ({ size }: Props) => (
  <div className="loader-container">
    <span
      className="loader"
      style={{
        width: sizes[size ?? 'md'].width,
        height: sizes[size ?? 'md'].height
      }}
    />
  </div>
)
