// TODO: реализовать страницу CatalogPage

import { loadUsers } from '@/entities/user/model/usersSlice'
import { User } from '@/shared/types'
import { Card, Skeleton } from '@/shared/ui'
import { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { CatalogSection } from '@/widgets'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function CatalogPage() {
  const { users, isLoading, error } = useSelector((store: RootState) => store.users)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadUsers())
  }, [])
  if (error) return <h2>Ошибка: {error}</h2>

  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      <section>
        {isLoading ? (
          <CatalogPreloader />
        ) : (
          <CatalogSection
            title={'Популярное'}
            users={users}
            favoriteIds={[]}
            onDetails={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
            onFavoriteToggle={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
          />
        )}
      </section>
      <section>
        {isLoading ? (
          <CatalogPreloader />
        ) : (
          <CatalogSection
            title={'Новое'}
            users={users}
            favoriteIds={[]}
            onDetails={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
            onFavoriteToggle={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
          />
        )}
      </section>
      <section>
        {isLoading ? (
          <CatalogPreloader />
        ) : (
          <CatalogSection
            title={'Рекомендуем'}
            users={users}
            favoriteIds={[]}
            onDetails={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
            onFavoriteToggle={function (user: User): void {
              throw new Error('Function not implemented.')
            }}
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
