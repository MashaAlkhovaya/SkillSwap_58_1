import { SVGProps } from 'react'

interface CheckboxIconProps extends SVGProps<SVGSVGElement> {
  state: 'unchecked' | 'checked' | 'indeterminate'
}

export const CheckboxIcon = ({ state, ...props }: CheckboxIconProps) => {
  if (state === 'unchecked') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M12.7907 20H7.2093C2.15814 20 0 17.8419 0 12.7907V7.2093C0 2.15814 2.15814 0 7.2093 0H12.7907C17.8419 0 20 2.15814 20 7.2093V12.7907C20 17.8419 17.8419 20 12.7907 20ZM7.2093 1.39535C2.92093 1.39535 1.39535 2.92093 1.39535 7.2093V12.7907C1.39535 17.0791 2.92093 18.6047 7.2093 18.6047H12.7907C17.0791 18.6047 18.6047 17.0791 18.6047 12.7907V7.2093C18.6047 2.92093 17.0791 1.39535 12.7907 1.39535H7.2093Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.791 0C17.8418 9.04544e-05 19.9999 2.15815 20 7.20898V12.791C19.9999 17.8418 17.8418 19.9999 12.791 20H7.20898C2.15815 19.9999 9.04559e-05 17.8418 0 12.791V7.20898C9.05902e-05 2.15816 2.15816 9.05917e-05 7.20898 0H12.791Z"
        fill="currentColor"
      />

      {state === 'checked' && (
        <path
          d="M14.7803 6.62988C14.4903 6.33988 14.0097 6.33988 13.7197 6.62988L8.58008 11.7695L6.28027 9.46973C5.99028 9.17973 5.50973 9.17974 5.21973 9.46973C4.92973 9.75973 4.92973 10.2403 5.21973 10.5303L8.0498 13.3604C8.18979 13.5003 8.38013 13.5801 8.58008 13.5801C8.78003 13.58 8.97038 13.5003 9.11035 13.3604L14.7803 7.69043C15.0702 7.40047 15.0702 6.9199 14.7803 6.62988Z"
          fill="var(--checkbox-checkmark-color, #fff)"
        />
      )}

      {state === 'indeterminate' && (
        <path
          d="M6 9.25C5.59 9.25 5.25 9.59 5.25 10C5.25 10.41 5.59 10.75 6 10.75H14C14.41 10.75 14.75 10.41 14.75 10C14.75 9.59 14.41 9.25 14 9.25H6Z"
          fill="var(--checkbox-checkmark-color, #fff)"
        />
      )}
    </svg>
  )
}
