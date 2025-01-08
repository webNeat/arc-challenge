import { get, matrix, set } from './utils'

export type Operation = {
  source: Zone
  destination: Zone
  transformations: Transformation[]
  steps: Array<number[][]>
}

export type Zone = {
  start_row: number
  start_col: number
  end_row: number
  end_col: number
  color: number
}

export type Transformation = Translation | Rotation | Flip | Scale | Crop | Invert

export type Translation = {
  type: 'translation'
  dx: number
  dy: number
}

export type Rotation = {
  type: 'rotation'
  angle: 90 | 180 | 270
}

export type Flip = {
  type: 'flip'
  axis: 'horizontal' | 'vertical'
}

export type Scale = {
  type: 'scale'
  width: number
  height: number
}

export type Crop = {
  type: 'crop'
  start_row: number
  start_col: number
  end_row: number
  end_col: number
}

export type Invert = {
  type: 'invert'
}

export function apply(operation: Operation, input: number[][], output: number[][]) {
  operation.steps = []
  let part = takeZone(input, operation.source)
  operation.steps.push(part)
  for (const transformation of operation.transformations) {
    part = transform(part, transformation)
    operation.steps.push(part)
  }
  placeZone(output, operation.destination, part)
}

function takeZone(input: number[][], zone: Zone) {
  const part = matrix(zone.end_row - zone.start_row + 1, zone.end_col - zone.start_col + 1)
  for (let row = zone.start_row; row <= zone.end_row; row++) {
    for (let col = zone.start_col; col <= zone.end_col; col++) {
      const color = get(input, row, col)
      if (color === zone.color) set(part, row - zone.start_row, col - zone.start_col, color ? 10 : 0)
    }
  }
  return part
}

function placeZone(output: number[][], zone: Zone, part: number[][]) {
  for (let row = zone.start_row; row <= zone.end_row; row++) {
    for (let col = zone.start_col; col <= zone.end_col; col++) {
      const color = get(part, row - zone.start_row, col - zone.start_col)
      if (color === 0) continue
      set(output, row, col, zone.color)
    }
  }
}

function transform(part: number[][], action: Transformation) {
  if (action.type === 'translation') return translate(part, action)
  if (action.type === 'rotation') return rotate(part, action)
  if (action.type === 'flip') return flip(part, action)
  if (action.type === 'scale') return scale(part, action)
  if (action.type === 'crop') return crop(part, action)
  if (action.type === 'invert') return invert(part, action)
  return part
}

/**
 * cells translated outside the matrix are ignored
 */
function translate(m: number[][], { dx, dy }: Translation) {
  const rows = m.length
  const cols = m[0]?.length || 0
  const result = matrix(rows, cols)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      set(result, i + dy, j + dx, get(m, i, j))
    }
  }
  return result
}

function rotate(m: number[][], { angle }: Rotation) {
  const rows = m.length
  const cols = m[0]?.length || 0
  let result = matrix(rows, cols)

  if (angle === 90) {
    result = matrix(cols, rows)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        set(result, j, rows - 1 - i, get(m, i, j))
      }
    }
  } else if (angle === 180) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        set(result, rows - 1 - i, cols - 1 - j, get(m, i, j))
      }
    }
  } else if (angle === 270) {
    result = matrix(cols, rows)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        set(result, cols - 1 - j, i, get(m, i, j))
      }
    }
  }
  return result
}

function flip(m: number[][], { axis }: Flip) {
  const rows = m.length
  const cols = m[0]?.length || 0
  const result = matrix(rows, cols)

  if (axis === 'horizontal') {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        set(result, i, cols - 1 - j, get(m, i, j))
      }
    }
  } else {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        set(result, rows - 1 - i, j, get(m, i, j))
      }
    }
  }
  return result
}

function scale(m: number[][], { width, height }: Scale) {
  const rows = m.length
  const cols = m[0]?.length || 0
  const result = matrix(rows * height, cols * width)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const value = get(m, i, j)
      for (let di = 0; di < height; di++) {
        for (let dj = 0; dj < width; dj++) {
          set(result, i * height + di, j * width + dj, value)
        }
      }
    }
  }
  return result
}

function crop(m: number[][], { start_row, start_col, end_row, end_col }: Crop) {
  const newRows = end_row - start_row
  const newCols = end_col - start_col
  const result = matrix(newRows, newCols)

  for (let i = 0; i < newRows; i++) {
    for (let j = 0; j < newCols; j++) {
      set(result, i, j, get(m, start_row + i, start_col + j))
    }
  }
  return result
}

function invert(m: number[][], {}: Invert) {
  const rows = m.length
  const cols = m[0]?.length || 0
  const result = matrix(rows, cols)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      set(result, i, j, get(m, i, j) === 0 ? 10 : 0)
    }
  }
  return result
}
