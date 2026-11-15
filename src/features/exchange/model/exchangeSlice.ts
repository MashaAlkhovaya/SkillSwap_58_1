import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getProposedSkillIds } from './exchangeStorage'

interface ExchangeState {
  proposedSkillIds: string[]
}

const initialState: ExchangeState = {
  proposedSkillIds: getProposedSkillIds(),
}

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    proposeExchange: (state, action: PayloadAction<string>) => {
      if (!state.proposedSkillIds.includes(action.payload)) {
        state.proposedSkillIds.push(action.payload)
      }
    },
  },
  selectors: {
    selectProposedSkillIds: (state) => state.proposedSkillIds,
  },
})

export const { proposeExchange } = exchangeSlice.actions
export const { selectProposedSkillIds } = exchangeSlice.selectors
export default exchangeSlice.reducer
