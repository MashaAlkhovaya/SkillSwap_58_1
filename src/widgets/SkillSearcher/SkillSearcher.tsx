import { TextInput, SearchIcon } from '@/shared/ui'
import styles from './SkillSearcher.module.css'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function SkillSearcher() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routeName = searchParams.get('name') ?? ''
  const [name, setName] = useState(routeName)
  const debouncedName = useDebounce(name, 1000)

  useEffect(() => {
    const trimmedName = debouncedName.trim()
    if (trimmedName === routeName) return

    const nextParams = new URLSearchParams(searchParams)
    if (trimmedName) nextParams.set('name', trimmedName)
    else nextParams.delete('name')
    setSearchParams(nextParams)
  }, [debouncedName, routeName, searchParams, setSearchParams])

  useEffect(() => {
    setName(routeName)
  }, [routeName])

  return (
    <TextInput
      className={styles.searchInput}
      placeholder="Искать навык"
      leftContent={<SearchIcon size={20} color="var(--color-text-secondary)" />}
      value={name}
      onChange={(event) => {
        setName(event.currentTarget.value)
      }}
    />
  )
}
