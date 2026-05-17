'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex-shrink-0 w-full group block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    >
      <div className="flex items-center">
        <div>
          <LogOut className="inline-block h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
        </div>
        <div className="ml-1">
          <p className="text-sm font-medium">Cerrar Sesión</p>
        </div>
      </div>
    </button>
  )
}
