import { State } from '../state'

export function pickColor(state: State, color: number) {
  state.palette.color = color
}
