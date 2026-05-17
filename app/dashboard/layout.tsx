import Sidebar from '@/components/sidebar'
import UserHeader from '@/components/user-header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-300 relative overflow-hidden">
      
      {/* Animated Background Effects */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing orbs/auroras */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob [animation-delay:2000ms]"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob [animation-delay:4000ms]"></div>
      </div>

      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-y-auto p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <UserHeader />
          {children}
        </div>
      </main>
    </div>
  )
}
