import reducer, { proposeExchange } from './exchangeSlice'

describe('exchangeSlice', () => {
  it('proposeExchange добавляет id навыка в список', () => {
    const state = reducer(undefined, proposeExchange('skill-01'))

    expect(state.proposedSkillIds).toEqual(['skill-01'])
  })

  it('повторный proposeExchange с тем же id не создаёт дубль', () => {
    const afterFirst = reducer(undefined, proposeExchange('skill-01'))
    const afterSecond = reducer(afterFirst, proposeExchange('skill-01'))

    expect(afterSecond.proposedSkillIds).toEqual(['skill-01'])
  })

  it('разные id навыков сохраняются оба', () => {
    const afterFirst = reducer(undefined, proposeExchange('skill-01'))
    const afterSecond = reducer(afterFirst, proposeExchange('skill-02'))

    expect(afterSecond.proposedSkillIds).toEqual(['skill-01', 'skill-02'])
  })
})
