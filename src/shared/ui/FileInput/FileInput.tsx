import { forwardRef, useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './FileInput.module.css'
import { FileInputIcon } from './FileInputIcon'
import { AvatarPlaceholderIcon } from './AvatarPlaceholderIcon'

export interface FileInputProps {
  onChange: (file: File) => void
  variant?: 'skill' | 'avatar'
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { onChange, variant = 'skill' },
  ref,
) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref],
  )

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    onChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  return (
    <div className={clsx(styles.wrapper, variant === 'avatar' && styles.wrapperAvatar)}>
      <div
        className={clsx(
          styles.dropzone,
          isDragOver && styles.active,
          variant === 'avatar' ? styles.dropzoneAvatar : styles.dropzoneSkill,
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={setInputRef}
          onChange={handleInputChange}
          accept="image/jpeg, image/png, image/webp"
          hidden
        />

        {preview ? (
          <img
            src={preview}
            alt="Превью"
            className={variant === 'avatar' ? styles.previewAvatar : styles.previewSkill}
          />
        ) : variant === 'avatar' ? (
          <AvatarPlaceholderIcon className={styles.avatarIcon} />
        ) : (
          <>
            <p className={styles.text}>Перетащите или выберите изображения навыка</p>
            <div className={styles.iconLink}>
              <FileInputIcon />
              <p className={styles.linkText}>Выберите изображение</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
})
