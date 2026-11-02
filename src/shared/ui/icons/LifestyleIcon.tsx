import { getIconSvgProps } from './Icon'
import type { IconProps } from './Icon'

export function LifestyleIcon(props: IconProps) {
  return (
    <svg {...getIconSvgProps(props, '0 0 24 24')}>
      <g transform="translate(2.25 2.971)">
        <path
          d="M12.5725 5.38704C8.73541 2.90838 4.76403 4.68773 1.09482 0.802693C0.240108 -0.103816 0.736531 10.9685 5.32952 15.1644C8.6875 18.2292 13.8723 17.8874 15.6206 14.9088C17.3689 11.9303 16.4097 7.86526 12.5725 5.38704Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.14518 8.90865C9.85756 12.4052 13.6994 14.4772 18.75 15.2542"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
