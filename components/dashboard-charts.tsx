'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

export function WeeklyChart({ data }: { data: { day: string; ofertas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 12 }}
          cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone" dataKey="ofertas" stroke="#a855f7" strokeWidth={2.5}
          dot={{ fill: '#a855f7', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#d946ef', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MonthlyChart({ data }: { data: { sem: string; ofertas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="sem" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 12 }}
          cursor={{ fill: '#1e293b' }}
        />
        <Bar dataKey="ofertas" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Donut chart ────────────────────────────────────────────────────
const DONUT_COLORS = ['#22c55e', '#818cf8', '#f59e0b', '#ef4444']

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  total: number
}

export function DonutChart({ data, total }: DonutChartProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32 flex-shrink-0">
        <PieChart width={128} height={128}>
          <Pie
            data={data}
            cx={60}
            cy={60}
            innerRadius={42}
            outerRadius={60}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-200">{total}</span>
          <span className="text-[10px] text-slate-500">Total</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-slate-400">{item.name}</span>
            </div>
            <span className="text-slate-300 font-semibold">
              {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
