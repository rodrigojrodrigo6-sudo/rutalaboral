'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

export function WeeklyChart({ data }: { data: { day: string; total: number; cvEnviados: number; entrevistas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 12 }}
          cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          formatter={(value) => <span className="text-[10px] font-bold text-slate-400">{value === 'total' ? 'Total' : value === 'cvEnviados' ? 'CV Enviado' : 'Entrevistas'}</span>}
        />
        <Line
          type="monotone" dataKey="total" stroke="#cbd5e1" strokeWidth={2}
          dot={{ fill: '#cbd5e1', r: 2 }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone" dataKey="cvEnviados" stroke="#10b981" strokeWidth={2}
          dot={{ fill: '#10b981', r: 2 }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone" dataKey="entrevistas" stroke="#a855f7" strokeWidth={2}
          dot={{ fill: '#a855f7', r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MonthlyChart({ data }: { data: { sem: string; total: number; cvEnviados: number; entrevistas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="sem" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0', fontSize: 12 }}
          cursor={{ fill: '#1e293b' }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          formatter={(value) => <span className="text-[10px] font-bold text-slate-400">{value === 'total' ? 'Total' : value === 'cvEnviados' ? 'CV Enviado' : 'Entrevistas'}</span>}
        />
        <Bar dataKey="total" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
        <Bar dataKey="cvEnviados" fill="#10b981" radius={[3, 3, 0, 0]} />
        <Bar dataKey="entrevistas" fill="#a855f7" radius={[3, 3, 0, 0]} />
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
