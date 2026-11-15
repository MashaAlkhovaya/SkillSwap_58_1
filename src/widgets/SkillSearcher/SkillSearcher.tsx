import { TextInput, SearchIcon } from '@/shared/ui'
import styles from './SkillSearcher.module.css'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { loadUsers } from '@/entities/user/model/usersSlice'
import { useAppDispatch } from '@/store/hooks'
import { useEffect, useState } from 'react'
import { FiltersState } from '@/shared/types'
import { INITIAL_FILTERS_STATE } from '@/shared/lib/constants'

export function SkillSearcher() {
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS_STATE)
  const debouncedName = useDebounce(filters.name ?? '', 1000)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (debouncedName.trim()) {
      dispatch(loadUsers({ page: 1, sort: 'popular', type: 'all', name: debouncedName.trim() })) //пока нет отдельного типа поиска для подходящих предложений, использую "popular"
      return
    }
  }, [debouncedName, dispatch])

  return (
    <TextInput
      className={styles.searchInput}
      placeholder="Искать навык"
      leftContent={<SearchIcon size={20} color="var(--color-text-secondary)" />}
      value={filters.name ?? ''}
      onChange={(event) => {
        const name = event.currentTarget.value
        setFilters((prev) => ({ ...prev, name }))
      }}
    />
  )
}
