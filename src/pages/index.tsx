import cn from 'classnames'
import dye from 'react-dye'
import { FaTrashCan } from 'react-icons/fa6'
import { actions, selectors, Operation, Zone } from '../store'

const colors = [
  'bg-black', // 0
  'bg-blue-500', // 1
  'bg-red-500', // 2
  'bg-green-500', // 3
  'bg-yellow-400', // 4
  'bg-gray-400', // 5
  'bg-pink-500', // 6
  'bg-orange-500', // 7
  'bg-sky-300', // 8
  'bg-rose-900', // 9
  'bg-gray-200', // 10 (for transformations)
]

const Title = dye('text-2xl p-4 font-bold text-gray-100', 'h1')

export default function Home() {
  const examplesIndexes = Array.from({ length: selectors.examplesCount() }, (_, index) => index)
  return (
    <>
      <div className="flex p-4 border-b border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-100">Arc solver</h1>
      </div>
      <main className="m-4 mx-auto p-4 max-w-6xl">
        <Palette />
        {examplesIndexes.map((index) => (
          <Example key={index} index={index} />
        ))}
        <AddExample />
        <Problem />
        <Operations />
      </main>
    </>
  )
}

function Example({ index }: { index: number }) {
  const example = selectors.example(index)
  const { color: pickedColor } = selectors.palette()
  return (
    <div className="p-4 mt-6 border border-gray-600 rounded-2xl">
      <span className="block text-xl font-semibold text-gray-400">Example {index + 1}</span>
      <div className="flex justify-center">
        <div>
          <Title className="text-center">Input</Title>
          <Grid
            values={example.input}
            onResize={(rows, cols) => actions.examples.resizeInput(index, rows, cols)}
            onCellClick={(x, y) => actions.examples.colorInputCell(index, x, y, pickedColor)}
          />
        </div>
        <div>
          <Title className="text-center">Output</Title>
          <Grid
            values={example.output}
            onResize={(rows, cols) => actions.examples.resizeOutput(index, rows, cols)}
            onCellClick={(x, y) => actions.examples.colorOutputCell(index, x, y, pickedColor)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="text-neutral-400 text-xl hover:text-red-600" onClick={() => actions.examples.remove(index)}>
          <FaTrashCan />
        </button>
      </div>
    </div>
  )
}

function AddExample() {
  return (
    <div className="flex justify-center">
      <button
        className="m-4 px-8 py-3 text-lg text-gray-400 border border-gray-400 rounded-lg hover:text-gray-200 hover:border-gray-200"
        onClick={() => actions.examples.create()}
      >
        Add example
      </button>
    </div>
  )
}

function Problem() {
  const examples = selectors.examples()
  const input = selectors.input()
  const output = selectors.output()
  const solving = selectors.solving()
  const { color: pickedColor } = selectors.palette()
  const solve = async () => {
    if (solving) return
    actions.output.startSolving()
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ examples, input }),
    })
    const { output, operations } = await res.json()
    actions.output.solve(output, operations)
  }
  return (
    <>
      <div className="p-4 mt-6 border border-gray-600 rounded-2xl">
        <span className="block text-xl font-semibold text-gray-400">Problem</span>
        <div className="flex justify-center">
          <div>
            <Title className="text-center">Input</Title>
            <Grid
              values={input}
              onResize={(rows, cols) => actions.input.resize(rows, cols)}
              onCellClick={(x, y) => actions.input.colorCell(x, y, pickedColor)}
            />
          </div>
          {!solving && (
            <div>
              <Title className="text-center">Output</Title>
              <Grid values={output} onResize={() => {}} onCellClick={() => {}} />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="m-4 px-8 py-3 text-lg text-gray-400 border border-gray-400 rounded-lg hover:text-gray-200 hover:border-gray-200"
          onClick={solve}
        >
          {solving ? 'Solving...' : 'Solve'}
        </button>
      </div>
    </>
  )
}

function Operations() {
  const solving = selectors.solving()
  const operations = selectors.operations()
  if (solving) return null
  return (
    <div className="p-4 mt-6 border border-gray-600 rounded-2xl">
      <span className="block text-xl font-semibold text-gray-400">Operations</span>
      <div className="mt-4 space-y-4">
        {operations.map((operation, index) => (
          <OperationBlock key={index} operation={operation} />
        ))}
      </div>
    </div>
  )
}

type OperationProps = {
  operation: Operation
}

function OperationBlock({ operation }: OperationProps) {
  const input = selectors.input()
  const output = selectors.output()
  return (
    <div className="p-3 border border-gray-700 rounded-xl">
      <div className="flex items-center gap-2 justify-between">
        <OperationGrid values={input} highlight={operation.source} />
        {operation.steps.map((step, index) => (
          <OperationGrid key={index} values={step} />
        ))}
        <OperationGrid values={output} highlight={operation.destination} />
      </div>
    </div>
  )
}

type OperationGridProps = {
  values: number[][]
  highlight?: Zone
}
function OperationGrid({ values, highlight }: OperationGridProps) {
  return (
    <div className="flex">
      <div className="relative mx-2 border border-gray-500">
        {values.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((value, columnIndex) => (
              <div
                className={cn('p-2 w-8 h-8 border border-gray-500 hover:border-gray-100', colors[value], {
                  'bg-opacity-10':
                    highlight &&
                    !(
                      value === highlight.color &&
                      highlight.start_row <= rowIndex &&
                      rowIndex <= highlight.end_row &&
                      highlight.start_col <= columnIndex &&
                      columnIndex <= highlight.end_col
                    ),
                })}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

type GridProps = {
  values: number[][]
  onCellClick: (row: number, col: number) => void
  onResize: (rows: number, cols: number) => void
}
function Grid({ values, onCellClick, onResize }: GridProps) {
  const rows = values.length
  const cols = values[0].length
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div className="relative mx-2 border border-gray-500">
          {values.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((value, columnIndex) => (
                <Cell key={columnIndex} value={value} onClick={() => onCellClick(rowIndex, columnIndex)} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <input
        type="text"
        className="m-2 px-4 py-2 bg-transparent text-gray-100 text-center rounded-lg"
        defaultValue={rows + ' x ' + cols}
        onChange={(e) => {
          const [rows, cols] = e.target.value.split('x').map(Number)
          if (!rows || !cols) return
          onResize(rows, cols)
        }}
      />
    </div>
  )
}

type CellProps = {
  value: number
  active?: boolean
  onClick?: () => void
}
function Cell({ value, active, onClick }: CellProps) {
  return (
    <div
      className={cn('p-2 w-16 h-16 border hover:border-gray-100', colors[value], {
        'border-gray-100 border-4': active,
        'border-gray-500': !active,
      })}
      onClick={onClick}
    ></div>
  )
}

function Palette() {
  const { color: pickedColor } = selectors.palette()
  return (
    <div className="fixed right-5">
      <div className="flex flex-col justify-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((color) => (
          <Cell
            key={color}
            value={color}
            active={pickedColor === color}
            onClick={() => actions.palette.pickColor(color)}
          />
        ))}
      </div>
    </div>
  )
}
