import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSkillById } from '@/api/skills'
import type { Skill } from '@/shared/types'
import { SkillInfoCard } from '@/widgets/SkillInfoCard'
import { SimilarSkills } from '@/widgets/SimilarSkills'
import styles from './SkillPage.module.css'

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [skill, setSkill] = useState<Skill | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadSkill = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const data = await fetchSkillById(id)
        if (data) {
          setSkill(data)
        } else {
          setIsError(true)
        }
      } catch (error: unknown) {
        console.error(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadSkill()
  }, [id])

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}>Загрузка...</div>
      </div>
    )
  }

  if (isError || !skill) {
    return (
      <div className={styles.errorContainer}>
        <h2>404</h2>
        <p>Навык не найден или был удален</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <SkillInfoCard skill={skill} />

      {/* Временная заглушка для похожих навыков */}
      <SimilarSkills similarSkills={[] as Skill[]} />
    </main>
  )
}
