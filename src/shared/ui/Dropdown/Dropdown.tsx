import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import styles from './Dropdown.module.css'

type DropdownProps = {
  /** Содержимое кнопки, открывающей панель */
  trigger: ReactNode

  /** Доступное название, особенно важно для кнопки с одной иконкой или аватаром */
  triggerLabel: string

  /** Содержимое панели; close() позволяет закрыть её после действия */
  children: (close: () => void) => ReactNode
}

export function Dropdown({ trigger, triggerLabel, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(0, availableWidth)}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
          })
        },
      }),
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePress: true,
    escapeKey: true,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const close = () => setIsOpen(false)

  return (
    <div
      className={styles.root}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget

        if (nextTarget && !event.currentTarget.contains(nextTarget)) {
          close()
        }
      }}
    >
      <button
        ref={refs.setReference}
        className={styles.trigger}
        type="button"
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        {...getReferenceProps()}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          id={panelId}
          className={styles.panel}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children(close)}
        </div>
      )}
    </div>
  )
}
