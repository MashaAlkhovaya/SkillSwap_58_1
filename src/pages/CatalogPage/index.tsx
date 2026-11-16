import { loadUsers } from '@/entities/user/model/usersSlice'
import { Card, Skeleton } from '@/shared/ui'
import { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { ActiveFilters, CatalogSection, FilterSidebar } from '@/widgets'
import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectProposedSkillIds } from '@/features/exchange'
import { generatePath, useNavigate } from 'react-router-dom'
import { ROUTES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import type { FiltersState, User } from '@/shared/types'
import { useCatalogFilters } from '@/features/catalog-filter'
import clsx from 'clsx'
import styles from './CatalogPage.module.css'

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

  const proposedSkillIds = useSelector(selectProposedSkillIds)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { filters, setFilters } = useCatalogFilters()

  const openSkill = (user: User) => navigate(generatePath(ROUTES.SKILL, { id: user.canTeach.id }))

  useEffect(() => {
    dispatch(loadUsers({ page: 1, sort: 'popular', filters }))
    dispatch(loadUsers({ page: 1, sort: 'new', filters }))
    dispatch(loadUsers({ page: 1, sort: 'random', filters }))
  }, [dispatch, filters])

  const handleRemoveFilter = (field: keyof FiltersState, value: string | null) => {
    switch (field) {
      case 'cities':
        setFilters((prev) => ({ ...prev, cities: prev.cities.filter((c) => c !== value) }))
        break
      case 'skillIds':
        setFilters((prev) => ({ ...prev, skillIds: prev.skillIds.filter((id) => id !== value) }))
        break
      case 'gender':
        setFilters((prev) => ({ ...prev, gender: null }))
        break
      case 'mode':
        setFilters((prev) => ({ ...prev, mode: 'all' }))
        break
      case 'search':
        setFilters((prev) => ({ ...prev, search: null }))
        break
    }
  }

  const getSkillTitleById = (id: string) => {
    for (const category of SKILL_CATEGORIES) {
      const sub = category.subcategories.find((s) => s.id === id)
      if (sub) return sub.title
    }
    return ''
  }

  const filterBySearch = useCallback(
    (users: User[]) => {
      if (!filters.search) return users
      const searchLower = filters.search.toLowerCase()

      return users.filter((user) => {
        const nameMatch = user.name.toLowerCase().includes(searchLower)

        const canTeachId = user.canTeach?.subCategory
        const canTeachTitle = getSkillTitleById(canTeachId) || ''
        const canTeachMatch = canTeachTitle.toLowerCase().includes(searchLower)

        const wantsMatch = user.wantsToLearn.some((skill) => {
          const title = typeof skill === 'string' ? getSkillTitleById(skill) : ''
          return title.toLowerCase().includes(searchLower)
        })

        return nameMatch || canTeachMatch || wantsMatch
      })
    },
    [filters.search],
  )

  const filteredPopular = useMemo(
    () => filterBySearch(popularUsers),
    [popularUsers, filterBySearch],
  )
  const filteredNew = useMemo(() => filterBySearch(newUsers), [newUsers, filterBySearch])
  const filteredRecommended = useMemo(
    () => filterBySearch(recommendedUsers),
    [recommendedUsers, filterBySearch],
  )

  const hasActiveFilters =
    filters.mode !== 'all' ||
    filters.gender !== null ||
    filters.cities.length > 0 ||
    filters.skillIds.length > 0 ||
    filters.search !== null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <FilterSidebar />

        <main className={styles.content}>
          <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />

          <div className={clsx(styles.sections, { [styles.withChips]: hasActiveFilters })}>
            <section>
              {isPopularLoading && popularUsers.length === 0 ? (
                <CatalogPreloader />
              ) : errors.popular ? (
                <h2>Ошибка: {errors.popular}</h2>
              ) : (
                <CatalogSection
                  title={'Популярное'}
                  users={filteredPopular}
                  hasMore={hasMore.popular}
                  isLoadingMore={isPopularLoading}
                  onLoadMore={() =>
                    dispatch(loadUsers({ page: pages.popular + 1, sort: 'popular', filters }))
                  }
                  favoriteIds={[]}
                  onDetails={openSkill}
                  onFavoriteToggle={() => undefined}
                  proposedSkillIds={proposedSkillIds}
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
                  users={filteredNew}
                  hasMore={hasMore.new}
                  isLoadingMore={isNewLoading}
                  onLoadMore={() =>
                    dispatch(loadUsers({ page: pages.new + 1, sort: 'new', filters }))
                  }
                  favoriteIds={[]}
                  onDetails={openSkill}
                  onFavoriteToggle={() => undefined}
                  proposedSkillIds={proposedSkillIds}
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
                  users={filteredRecommended}
                  hasMore={hasMore.random}
                  isLoadingMore={isRecommendedLoading}
                  onLoadMore={() =>
                    dispatch(loadUsers({ page: pages.random + 1, sort: 'random', filters }))
                  }
                  favoriteIds={[]}
                  onDetails={openSkill}
                  onFavoriteToggle={() => undefined}
                  proposedSkillIds={proposedSkillIds}
                />
              )}
            </section>
          </div>
        </main>
      </div>
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
