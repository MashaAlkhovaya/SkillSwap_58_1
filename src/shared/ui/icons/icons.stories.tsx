import type { ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IconProps } from './Icon'
import {
  AddIcon,
  BellIcon,
  BookIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobalIcon,
  HeartIcon,
  HomeIcon,
  IdeaIcon,
  LifestyleIcon,
  MessageTextIcon,
  MoonIcon,
  MoreIcon,
  PaletteIcon,
  RequestIcon,
  SearchIcon,
  ShareIcon,
  UserCircleIcon,
  UserIcon,
} from './index'

const icons: Array<[string, ComponentType<IconProps>]> = [
  ['Search', SearchIcon],
  ['ChevronDown', ChevronDownIcon],
  ['ChevronRight', ChevronRightIcon],
  ['Moon', MoonIcon],
  ['Bell', BellIcon],
  ['Heart', HeartIcon],
  ['Request', RequestIcon],
  ['MessageText', MessageTextIcon],
  ['Idea', IdeaIcon],
  ['User', UserIcon],
  ['Briefcase', BriefcaseIcon],
  ['Global', GlobalIcon],
  ['Home', HomeIcon],
  ['Palette', PaletteIcon],
  ['Book', BookIcon],
  ['Lifestyle', LifestyleIcon],
  ['Share', ShareIcon],
  ['More', MoreIcon],
  ['UserCircle', UserCircleIcon],
  ['Add', AddIcon],
]

function Gallery() {
  return (
    <div style={{ display: 'grid', gap: 24, color: '#253017', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {icons.map(([name, Icon]) => (
          <div key={name} style={{ width: 96, textAlign: 'center', fontSize: 12 }}>
            <Icon size={24} />
            <div style={{ marginTop: 8 }}>{name}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <BellIcon badge />
        <HeartIcon />
        <HeartIcon filled />
        <HeartIcon filled color="#ABD27A" />
        <SearchIcon size={16} color="#69735D" />
        <SearchIcon size={32} />
        <AddIcon size={16} />
        <MoonIcon color="#253017" size={24} />
      </div>
    </div>
  )
}

const meta = {
  component: Gallery,
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {}
