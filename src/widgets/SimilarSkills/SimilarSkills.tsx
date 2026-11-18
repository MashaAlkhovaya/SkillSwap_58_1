import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType } from 'embla-carousel'
import { Button, ChevronRightIcon, Text, Title } from '@/shared/ui'
import type { User } from '@/shared/types'
import { CatalogUserCard } from '@/widgets/CatalogUserCard'
import styles from './SimilarSkills.module.css'

export interface SimilarSkillsProps {
  users: User[]
  onDetails: (user: User) => void
  title?: string
  favoriteIds?: string[]
  onFavoriteToggle?: (user: User) => void
}

export function SimilarSkills({
  users,
  onDetails,
  title = 'Похожие предложения',
  favoriteIds,
  onFavoriteToggle,
}: SimilarSkillsProps) {
  const headingId = useId()
  const listId = useId()
  const emblaApi = useRef<EmblaCarouselType | null>(null)
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!viewport) return

    const embla = EmblaCarousel(viewport, {
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
    })
    emblaApi.current = embla

    const updateArrows = () => {
      setCanScrollPrev(embla.canScrollPrev())
      setCanScrollNext(embla.canScrollNext())
    }

    updateArrows()
    embla.on('select', updateArrows)
    embla.on('reInit', updateArrows)

    return () => {
      embla.destroy()
      emblaApi.current = null
    }
  }, [viewport, users.length])

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <Title level={2} size={2} className={styles.heading} id={headingId}>
        {title}
      </Title>

      {users.length === 0 ? (
        <Text color="secondary">Похожих предложений пока нет</Text>
      ) : (
        <div className={styles.carousel}>
          {canScrollPrev && (
            <Button
              variant="tertiary"
              className={clsx(styles.navButton, styles.navPrev)}
              icon={<ChevronRightIcon className={styles.prevIcon} size={16} />}
              aria-label="Предыдущие карточки"
              aria-controls={listId}
              onClick={() => emblaApi.current?.scrollPrev()}
            />
          )}

          <div ref={setViewport} className={styles.viewport}>
            <ul id={listId} className={styles.track}>
              {users.map((user) => (
                <li key={user.id} className={styles.slide}>
                  <CatalogUserCard
                    user={user}
                    isFavorite={favoriteIds?.includes(user.id) ?? false}
                    onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(user) : undefined}
                    onDetails={() => onDetails(user)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {canScrollNext && (
            <Button
              variant="tertiary"
              className={clsx(styles.navButton, styles.navNext)}
              icon={<ChevronRightIcon size={16} />}
              aria-label="Следующие карточки"
              aria-controls={listId}
              onClick={() => emblaApi.current?.scrollNext()}
            />
          )}
        </div>
      )}
    </section>
  )
}
