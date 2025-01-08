import { State } from '../state'

export function colorCell(state: State, row: number, column: number, color: number) {
  state.input[row][column] = color
}

export function resize(state: State, rows: number, columns: number) {
  state.input = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
}
