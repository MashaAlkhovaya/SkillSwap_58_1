import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillInfoCard } from './SkillInfoCard'
import type { Skill } from '@/shared/types'

type PreviewMode = 'default' | 'noImages' | 'fewImages' | 'manyImages'

const MOCK_SKILL: Skill = {
  id: 'skill-story',
  title: 'Игра на барабанах',
  description: 'Покажу базовые ритмы, работу с палочками и помогу разучить простую партию.',
  type: 'teach',
  category: 'art',
  subCategory: 'music-sound',
  tags: ['барабаны', 'ритм', 'музыка'],
  imageUrls: [],
  authorId: 'user-01',
  createdAt: '2025-01-15T10:15:00.000Z',
}

function createMockImage(label: string, background: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
      <rect width="800" height="800" fill="${background}" />
      <circle cx="620" cy="180" r="130" fill="#ffffff" fill-opacity="0.18" />
      <circle cx="160" cy="690" r="210" fill="#000000" fill-opacity="0.08" />
      <text
        x="400"
        y="410"
        text-anchor="middle"
        fill="#ffffff"
        font-family="Arial"
        font-size="42"
      >${label}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const MOCK_IMAGES = [
  createMockImage('Фото 1', '#6366f1'),
  createMockImage('Фото 2', '#0d9488'),
  createMockImage('Фото 3', '#d97706'),
  createMockImage('Фото 4', '#db2777'),
  createMockImage('Фото 5', '#7c3aed'),
  createMockImage('Фото 6', '#0891b2'),
  createMockImage('Фото 7', '#65a30d'),
]

function SkillInfoCardPreview({ mode, skill }: { mode: PreviewMode; skill: Skill }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const imageUrls =
    mode === 'noImages'
      ? []
      : mode === 'fewImages'
        ? MOCK_IMAGES.slice(0, 2)
        : mode === 'default'
          ? MOCK_IMAGES.slice(0, 4)
          : MOCK_IMAGES

  const previewSkill: Skill = {
    ...skill,
    imageUrls,
  }

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: '100vh',
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: theme === 'light' ? '#e5e7eb' : '#020617',
        color: 'var(--color-text)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
        }}
      >
        <button
          type="button"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          style={{
            padding: '10px 16px',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SkillInfoCard skill={previewSkill} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Widgets/SkillInfoCard',
  component: SkillInfoCard,
  args: {
    skill: MOCK_SKILL,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SkillInfoCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <SkillInfoCardPreview mode="default" skill={args.skill} />,
}

export const NoImages: Story = {
  render: (args) => <SkillInfoCardPreview mode="noImages" skill={args.skill} />,
}

export const FewImages: Story = {
  render: (args) => <SkillInfoCardPreview mode="fewImages" skill={args.skill} />,
}

export const ManyImages: Story = {
  render: (args) => <SkillInfoCardPreview mode="manyImages" skill={args.skill} />,
}
