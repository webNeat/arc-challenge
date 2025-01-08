import { Operation } from '@/operations'

export type State = {
  palette: {
    color: number
  }
  examples: Example[]
  input: number[][]
  output: number[][]
  solving: boolean
  operations: Operation[]
}

export type Example = {
  input: number[][]
  output: number[][]
}

export const initialState: State = {
  palette: {
    color: 1,
  },
  examples: [
    {
      input: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      output: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  ],
  input: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  output: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  solving: false,
  operations: [],
}
