'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings,
  UserCircle,
  MapPinned
} from 'lucide-react'
import { cn } from '@/lib/utils'

import LogoutButton from './logout-button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mis Ofertas', href: '/dashboard/jobs', icon: Briefcase },
  { name: 'Mi Perfil', href: '/dashboard/profile', icon: UserCircle },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex-1 flex flex-col min-h-0 backdrop-blur-xl bg-slate-900/40 border-r border-slate-800/50 shadow-2xl">
        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center gap-3 flex-shrink-0 px-6 mb-10">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <MapPinned className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
              Ruta Laboral
            </h1>
          </div>
          <nav className="mt-2 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 text-fuchsia-300 border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)]'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent',
                    'group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-fuchsia-400' : 'text-slate-500 group-hover:text-slate-300',
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-fuchsia-500 to-indigo-500 rounded-r-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-slate-800/50 p-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
