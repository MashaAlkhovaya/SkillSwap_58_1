import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useGetSkillByIdQuery } from '@/entities/skill/model/api/skillApi'
import { useGetUserByIdQuery } from '@/entities/user/model/api/userApi'
import { selectAuthUser } from '@/features/auth/model/authSlice'
import { addNotification, selectOfferedSkillIds } from '@/features/notifications'
import { ROUTES } from '@/shared/lib/constants'
import { Avatar, Button, Card } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { SkillInfoCard } from '@/widgets/SkillInfoCard'
import { ExchangeModal, proposeExchange } from '@/features/exchange'
import styles from './SkillPage.module.css'

export const SkillPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useAppSelector(selectAuthUser)
  const offeredSkillIds = useAppSelector(selectOfferedSkillIds)
  const { currentData: skill, isFetching, isError } = useGetSkillByIdQuery(id ?? skipToken)
  const { currentData: owner, isError: ownerError } = useGetUserByIdQuery(
    skill?.authorId ?? skipToken,
  )

  if (isFetching && !skill) return <div>Загрузка...</div>
  if (isError || !skill) return <div>Ошибка загрузки навыка</div>

  const exchangeOffered = offeredSkillIds.includes(skill.id)

  function offerExchange() {
    if (!skill || exchangeOffered) return

    if (!user) {
      navigate(ROUTES.LOGIN, { state: { returnToSkillId: skill.id } })
      return
    }

    if (!owner || owner.id === user.id) return

    dispatch(
      addNotification({
        type: 'success',
        title: `Вы предложили обмен пользователю ${owner.name}`,
        message: skill.title,
        duration: 5000,
        exchangeSkillId: skill.id,
      }),
    )
    dispatch(proposeExchange(skill.id))
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
          skill.authorId !== user?.id && (
            <>
              <Button disabled={exchangeOffered || (!!user && !owner)} onClick={offerExchange}>
                {exchangeOffered ? 'Обмен предложен' : 'Предложить обмен'}
              </Button>
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
