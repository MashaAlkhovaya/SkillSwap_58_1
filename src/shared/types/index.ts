// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  category: string
  subCategory: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  birthDate: string
  gender: 'female' | 'male'
  city: string
  bio: string
  createdAt: string
  login: string
  password: string
  likes: string[]
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}
