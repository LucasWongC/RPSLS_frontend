export const MOVES = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'] as const

export type MOVE = (typeof MOVES)[number]
