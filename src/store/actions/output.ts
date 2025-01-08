import { Operation } from '@/operations'
import { State } from '../state'

export function startSolving(state: State) {
  state.solving = true
  state.operations = []
}

export function solve(state: State, output: number[][], operations: Operation[]) {
  state.output = output
  state.operations = operations
  state.solving = false
}
