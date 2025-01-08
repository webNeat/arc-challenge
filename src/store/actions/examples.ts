import { State } from '../state'

export function create(state: State) {
  state.examples.push({
    input: Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0)),
    output: Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0)),
  })
}

export function remove(state: State, index: number) {
  state.examples.splice(index, 1)
}

export function colorInputCell(state: State, index: number, row: number, column: number, color: number) {
  state.examples[index].input[row][column] = color
}

export function colorOutputCell(state: State, index: number, row: number, column: number, color: number) {
  state.examples[index].output[row][column] = color
}

export function resizeInput(state: State, index: number, rows: number, columns: number) {
  state.examples[index].input = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
}

export function resizeOutput(state: State, index: number, rows: number, columns: number) {
  state.examples[index].output = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
}
