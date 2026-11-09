import { useParams } from 'react-router-dom'
import { useGetSkillByIdQuery } from '@/entities/skill/model/api/skillApi'

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>()

  const {
    data: skill,
    isLoading,
    isError,
  } = useGetSkillByIdQuery(id!, {
    skip: !id,
  })

  if (isLoading) return <div>Загрузка...</div>
  if (isError || !skill) return <div>Ошибка загрузки навыка</div>

  return (
    <div>
      <h1>{skill.title}</h1>
      {/* ... */}
    </div>
  )
}
export default SkillPage
