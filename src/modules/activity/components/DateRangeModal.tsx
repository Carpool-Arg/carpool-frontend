'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function between(d: Date, a: Date, b: Date) {
  const t = d.getTime()
  return t > Math.min(a.getTime(), b.getTime()) && t < Math.max(a.getTime(), b.getTime())
}
function fmtLabel(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

type Props = {
  isOpen: boolean
  onClose: () => void
  range?: DateRange
  onApply: (range: DateRange) => void
}

function MiniCalendar({
  baseDate,
  startDate,
  endDate,
  onDayClick,
  onPrev,
  onNext,
}: {
  baseDate: Date
  startDate: Date | null
  endDate: Date | null
  onDayClick: (d: Date) => void
  onPrev: () => void
  onNext: () => void
}) {
  const y = baseDate.getFullYear()
  const m = baseDate.getMonth()
  const firstDay = new Date(y, m, 1)
  const lastDay = new Date(y, m + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells: (Date | null)[] = Array(startOffset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(y, m, d))
  while (cells.length < 42) cells.push(null)

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrev}
          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-9 hover:bg-white/10 text-sm transition-colors"
        >
          <ChevronLeft size={12}/>
        </button>
        <span className="text-sm font-medium text-white">{MONTHS[m]} {y}</span>
        <button
          onClick={onNext}
          className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-9 hover:bg-white/10 text-sm transition-colors"
        >
          <ChevronRight size={12}/>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-11 font-medium py-1">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className='h-7' />
          const isStart = startDate && sameDay(date, startDate)
          const isEnd = endDate && sameDay(date, endDate)
          const inRange = startDate && endDate && between(date, startDate, endDate)

          return (
            <button
              key={date.getTime()}
              onClick={() => onDayClick(date)}
              className={`text-center text-xs h-7 rounded cursor-pointer w-full transition-colors
                ${isStart || isEnd ? 'bg-white text-black font-medium' : ''}
                ${inRange ? 'bg-white/10 text-white' : ''}
                ${!isStart && !isEnd && !inRange ? 'text-gray-300 hover:bg-white/10' : ''}
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DateRangeModal({ isOpen, onClose, range, onApply }: Props) {
  const now = new Date()
  const [leftMonth, setLeftMonth] = useState(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const [rightMonth, setRightMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [startDate, setStartDate] = useState<Date | null>(range?.from ?? null)
  const [endDate, setEndDate] = useState<Date | null>(range?.to ?? null)
  const [mobileMonth, setMobileMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))

  if (!isOpen) return null

  const handleDayClick = (d: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(d)
      setEndDate(null)
    } else if (d < startDate) {
      setEndDate(startDate)
      setStartDate(d)
    } else {
      setEndDate(d)
    }
  }

  const handleApply = () => {
    if (startDate && endDate) {
      onApply({ from: startDate, to: endDate })
      onClose()
    }
  }


  const rangeLabel =
    startDate && endDate ? (
      <span className="flex items-center gap-1">
        {fmtLabel(startDate)}
        <ChevronRight size={14} />
        {fmtLabel(endDate)}
      </span>
    ) : startDate ? (
      <span className="flex items-center gap-1">
        {fmtLabel(startDate)}
        <ChevronRight size={14} />
        
      </span>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 mb-12 md:mb-0"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#1a1a1a] border border-white/10 w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 ">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-medium text-white">Seleccionar rango</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-gray-9 hover:bg-white/20 text-xs transition-colors"
          >
            <X size={16}/>
          </button>
        </div>

        {/* Desktop: dos meses */}
        <div className="hidden sm:flex gap-6">
          <MiniCalendar
            baseDate={leftMonth}
            startDate={startDate}
            endDate={endDate}
            onDayClick={handleDayClick}
            onPrev={() => setLeftMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
            onNext={() => setLeftMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
          />
          <div className="w-px bg-white/10" />
          <MiniCalendar
            baseDate={rightMonth}
            startDate={startDate}
            endDate={endDate}
            onDayClick={handleDayClick}
            onPrev={() => setRightMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
            onNext={() => setRightMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
          />
        </div>

        {/* Mobile: un solo mes */}
        <div className="sm:hidden p-2">
          <MiniCalendar
            baseDate={mobileMonth}
            startDate={startDate}
            endDate={endDate}
            onDayClick={handleDayClick}
            onPrev={() => setMobileMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
            onNext={() => setMobileMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <div>
            <p className="text-[11px] text-gray-500">Rango seleccionado</p>
            <p className="text-xs font-medium text-gray-200">{rangeLabel ?? '—'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-medium disabled:opacity-30 transition-opacity"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}