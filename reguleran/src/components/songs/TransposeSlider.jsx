import { Card } from '../ui/Card'

export default function TransposeSlider({ value, onChange }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-stone-700 dark:text-stone-300">Transpose</h3>
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {value > 0 ? '+' : ''}{value}
        </span>
      </div>
      <input
        type="range"
        min="-5"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-primary-600 dark:accent-primary-400"
      />
      <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mt-1">
        <span>-5</span>
        <span>0</span>
        <span>+5</span>
      </div>
    </Card>
  )
}
