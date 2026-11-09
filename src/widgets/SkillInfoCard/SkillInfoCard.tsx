import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Card, Text, Title } from '@/shared/ui'
import { SKILL_CATEGORIES } from '@/shared/lib/constants'
import type { Skill } from '@/shared/types'
import styles from './SkillInfoCard.module.css'

interface SkillInfoCardProps {
  skill: Skill
  controls?: ReactNode
}

const MAX_VISIBLE_THUMBNAILS = 3

export function SkillInfoCard({ skill, controls }: SkillInfoCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const images = skill.imageUrls ?? []

  useEffect(() => {
    setActiveIndex(0)
  }, [skill.id])

  const category = SKILL_CATEGORIES.find((item) => item.id === skill.category)

  const categoryTitle = category?.title ?? skill.category

  const subCategoryTitle =
    category?.subcategories.find((item) => item.id === skill.subCategory)?.title ??
    skill.subCategory

  const otherImages = images
    .map((src, index) => ({ src, index }))
    .filter((image) => image.index !== activeIndex)

  const visibleThumbnails = otherImages.slice(0, MAX_VISIBLE_THUMBNAILS).map((image, index) => ({
    ...image,
    moreCount:
      otherImages.length > MAX_VISIBLE_THUMBNAILS && index === MAX_VISIBLE_THUMBNAILS - 1
        ? otherImages.length - (MAX_VISIBLE_THUMBNAILS - 1)
        : 0,
  }))

  const showPreviousImage = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length)
  }

  const showNextImage = () => {
    setActiveIndex((current) => (current + 1) % images.length)
  }

  const selectImage = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <Card className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.info}>
            <Title level={1} className={styles.title}>
              {skill.title}
            </Title>

            <Text className={styles.category} color="secondary" variant="sm">
              {categoryTitle} / {subCategoryTitle}
            </Text>

            <div className={styles.description}>
              <Text>{skill.description}</Text>
            </div>

            {/* для кнопок*/}
            {controls != null && <div className={styles.controls}>{controls}</div>}
          </div>
        </div>
        <div className={`${styles.gallery} ${images.length <= 1 ? styles.gallerySingle : ''}`}>
          <div
            className={`${styles.mainImage} ${images.length === 0 ? styles.mainImageEmpty : ''}`}
          >
            {images.length > 0 ? (
              <img src={images[activeIndex]} alt={`${skill.title} — фото ${activeIndex + 1}`} />
            ) : (
              <div className={styles.placeholder}>Фотографии пока не добавлены</div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.previous}`}
                  onClick={showPreviousImage}
                  aria-label="Предыдущее фото"
                >
                  <span>‹</span>
                </button>

                <button
                  type="button"
                  className={`${styles.arrow} ${styles.next}`}
                  onClick={showNextImage}
                  aria-label="Следующее фото"
                >
                  <span>›</span>
                </button>
              </>
            )}
          </div>

          {visibleThumbnails.length > 0 && (
            <div className={styles.thumbnails}>
              {visibleThumbnails.map((image) => (
                <button
                  key={image.index}
                  type="button"
                  className={styles.thumbnail}
                  onClick={() => selectImage(image.index)}
                  aria-label={`Показать фото ${image.index + 1}`}
                >
                  <img src={image.src} alt="" />

                  {image.moreCount > 0 && (
                    <span className={styles.moreOverlay}>+{image.moreCount}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
