import { loadUsers } from '@/entities/user/model/usersSlice'
import { Card, Skeleton } from '@/shared/ui'
import { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { CatalogSection } from '@/widgets'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { generatePath, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import type { User } from '@/shared/types'

export default function CatalogPage() {
  const {
    newUsers,
    popularUsers,
    recommendedUsers,
    isPopularLoading,
    isNewLoading,
    isRecommendedLoading,
    errors,
    pages,
    hasMore,
  } = useSelector((store: RootState) => store.users)
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')?.trim() ?? ''
  const nameFilter = useMemo(() => (name ? { name } : {}), [name])

  const navigate = useNavigate()
  const openSkill = (user: User) => navigate(generatePath(ROUTES.SKILL, { id: user.canTeach.id }))

  useEffect(() => {
    dispatch(loadUsers({ page: 1, sort: 'popular', ...nameFilter }))
    dispatch(loadUsers({ page: 1, sort: 'new', ...nameFilter }))
    dispatch(loadUsers({ page: 1, sort: 'random', ...nameFilter }))
  }, [dispatch, nameFilter])
  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      <section>
        {isPopularLoading && popularUsers.length === 0 ? (
          <CatalogPreloader />
        ) : errors.popular ? (
          <h2>Ошибка: {errors.popular}</h2>
        ) : (
          <CatalogSection
            title={'Популярное'}
            users={popularUsers}
            hasMore={hasMore.popular}
            isLoadingMore={isPopularLoading}
            onLoadMore={() =>
              dispatch(loadUsers({ page: pages.popular + 1, sort: 'popular', ...nameFilter }))
            }
            favoriteIds={[]}
            onDetails={openSkill}
            onFavoriteToggle={() => undefined}
          />
        )}
      </section>
      <section>
        {isNewLoading && newUsers.length === 0 ? (
          <CatalogPreloader />
        ) : errors.new ? (
          <h2>Ошибка: {errors.new}</h2>
        ) : (
          <CatalogSection
            title={'Новое'}
            users={newUsers}
            hasMore={hasMore.new}
            isLoadingMore={isNewLoading}
            onLoadMore={() =>
              dispatch(loadUsers({ page: pages.new + 1, sort: 'new', ...nameFilter }))
            }
            favoriteIds={[]}
            onDetails={openSkill}
            onFavoriteToggle={() => undefined}
          />
        )}
      </section>
      <section>
        {isRecommendedLoading && recommendedUsers.length === 0 ? (
          <CatalogPreloader />
        ) : errors.random ? (
          <h2>Ошибка: {errors.random}</h2>
        ) : (
          <CatalogSection
            title={'Рекомендуем'}
            users={recommendedUsers}
            hasMore={hasMore.random}
            isLoadingMore={isRecommendedLoading}
            onLoadMore={() =>
              dispatch(loadUsers({ page: pages.random + 1, sort: 'random', ...nameFilter }))
            }
            favoriteIds={[]}
            onDetails={openSkill}
            onFavoriteToggle={() => undefined}
          />
        )}
      </section>
    </div>
  )
}

const CatalogPreloader = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 24 }}>
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} style={{ width: 324 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skeleton variant="circle" width={48} height={48} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Skeleton variant="rect" width="100%" height={120} />
          </div>
        </Card>
      ))}
    </div>
  )
}
