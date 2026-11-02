import { getIconSvgProps } from './Icon'
import type { IconProps } from './Icon'

export type BellIconProps = IconProps & {
  badge?: boolean
}

const badgeColor = '#E0796E'

export function BellIcon({ badge = false, ...props }: BellIconProps) {
  return (
    <svg {...getIconSvgProps(props, '0 0 24 24')}>
      <g transform="translate(2.699 2.25)">
        <path
          d="M0.778158 12.243C0.586458 13.4976 1.44236 14.3679 2.48996 14.8017C6.50666 16.4667 12.0957 16.4667 16.1124 14.8017C17.16 14.3679 18.0159 13.4967 17.8242 12.243C17.7072 11.4717 17.1249 10.83 16.6938 10.2027C16.1295 9.3711 16.0737 8.4648 16.0728 7.5C16.0737 3.7722 13.0425 0.75 9.30116 0.75C5.55986 0.75 2.52866 3.7722 2.52866 7.5C2.52866 8.4648 2.47286 9.372 1.90766 10.2027C1.47746 10.83 0.896058 11.4717 0.778158 12.243Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M5.70115 16.05C6.11335 17.6025 7.56955 18.75 9.30115 18.75C11.0337 18.75 12.4881 17.6025 12.9012 16.05"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
      {badge ? <circle cx="18" cy="6" r="6" fill={badgeColor} /> : null}
    </svg>
  )
}
