import type { CSSProperties, SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'color'> & {
  size?: number | string
  color?: string
}

export function getIconSvgProps(
  { size = 24, color, style, ...props }: IconProps,
  viewBox = '0 0 24 24',
): SVGProps<SVGSVGElement> {
  const mergedStyle: CSSProperties | undefined = color || style ? { color, ...style } : style

  return {
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    ...props,
    width: size,
    height: size,
    viewBox,
    focusable: 'false',
    'aria-hidden': props['aria-hidden'] ?? (props['aria-label'] ? undefined : true),
    style: mergedStyle,
  }
}
