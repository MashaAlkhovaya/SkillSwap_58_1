import { getIconSvgProps } from './Icon'
import type { IconProps } from './Icon'

export function AddIcon(props: IconProps) {
  return (
    <svg {...getIconSvgProps(props, '0 0 16 16')}>
      <g transform="translate(1.25 1.25)">
        <path
          d="M12.75 7.5H0.75C0.34 7.5 0 7.16 0 6.75C0 6.34 0.34 6 0.75 6H12.75C13.16 6 13.5 6.34 13.5 6.75C13.5 7.16 13.16 7.5 12.75 7.5Z"
          fill="currentColor"
        />
        <path
          d="M6.75 13.5C6.34 13.5 6 13.16 6 12.75V0.75C6 0.34 6.34 0 6.75 0C7.16 0 7.5 0.34 7.5 0.75V12.75C7.5 13.16 7.16 13.5 6.75 13.5Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
