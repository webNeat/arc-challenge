import { State } from './state'

export function palette(state: State) {
  return state.palette
}

export function examplesCount(state: State) {
  return state.examples.length
}

export function examples(state: State) {
  return state.examples
}

export function example(state: State, index: number) {
  return state.examples[index]
}

export function operations(state: State) {
  return state.operations
}

export function input(state: State) {
  return state.input
}

export function output(state: State) {
  return state.output
}

export function solving(state: State) {
  return state.solving
}
