export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function matrix(rows: number, columns: number) {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
}

export function get(matrix: number[][], rowIndex: number, colIndex: number, defaultValue = 0) {
  const row = matrix[rowIndex] || []
  return row[colIndex] ?? defaultValue
}

export function set(matrix: number[][], rowIndex: number, colIndex: number, value: number) {
  const row = matrix[rowIndex]
  if (!row || row.length <= colIndex) return
  row[colIndex] = value
}
