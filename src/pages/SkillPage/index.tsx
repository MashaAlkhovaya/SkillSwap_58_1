import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetSkillByIdQuery } from '@/entities/skill/model/api/skillApi'
import { useGetUserByIdQuery } from '@/entities/user/model/api/userApi'
import { selectAuthUser } from '@/features/auth/model/authSlice'
import { useNotify } from '@/features/notifications'
import { ROUTES } from '@/shared/lib/constants'
import { Avatar, Card } from '@/shared/ui'
import { useAppSelector } from '@/store/hooks'
import { SkillInfoCard } from '@/widgets/SkillInfoCard'
import { ExchangeModal, ExchangeButton, useSkillExchange } from '@/features/exchange'
import styles from './SkillPage.module.css'

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const notify = useNotify()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useAppSelector(selectAuthUser)
  const { currentData: skill, isFetching, isError } = useGetSkillByIdQuery(id ?? skipToken)
  const { currentData: owner, isError: ownerError } = useGetUserByIdQuery(
    skill?.authorId ?? skipToken,
  )

  const { isProposed, isLoading, propose } = useSkillExchange(skill?.id)

  if (isFetching && !skill) return <div>Загрузка...</div>
  if (isError || !skill) return <div>Ошибка загрузки навыка</div>

  const isGuest = !user
  const isOwnSkill = skill.authorId === user?.id

  async function offerExchange() {
    if (!skill) return

    if (isGuest) {
      navigate(ROUTES.LOGIN, { state: { returnToSkillId: skill.id } })
      return
    }

    if (isProposed || isLoading) return
    if (!owner || owner.id === user?.id) return

    const isCreated = await propose()
    if (!isCreated) return

    notify.success(skill.title, `Вы предложили обмен пользователю ${owner.name}`, {
      exchangeSkillId: skill.id,
    })
    setIsModalOpen(true)
  }

  return (
    <div className={styles.layout}>
      {owner && (
        <Card className={styles.owner}>
          <Avatar key={owner.id} src={owner.avatarUrl} alt="" size="md" />
          <div>
            <strong>{owner.name}</strong>
            <p>{owner.city}</p>
          </div>
        </Card>
      )}
      <SkillInfoCard
        skill={skill}
        controls={
          !isOwnSkill && (
            <>
              <ExchangeButton
                isProposed={isProposed}
                isLoading={isLoading}
                onClick={offerExchange}
              />
              {user && ownerError && <p role="alert">Не удалось загрузить владельца навыка</p>}
            </>
          )
        }
      />
      <ExchangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default SkillPage
