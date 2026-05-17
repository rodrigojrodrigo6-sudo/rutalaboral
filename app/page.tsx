import Link from 'next/link'
import { MapPinned, Search, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob [animation-delay:2000ms]"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob [animation-delay:4000ms]"></div>
      </div>

      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-slate-800/50 relative z-10 backdrop-blur-md bg-slate-950/50">
        <Link className="flex items-center justify-center group" href="#">
          <div className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 p-2 rounded-lg group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all">
            <MapPinned className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Ruta Laboral</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-semibold text-slate-300 hover:text-fuchsia-400 transition-colors" href="/login">
            Iniciar Sesión
          </Link>
          <Link className="text-sm font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-fuchsia-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-fuchsia-500/25 transform hover:-translate-y-0.5" href="/login">
            Comenzar Gratis
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-20 md:py-32 lg:py-40 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                  Tu próximo empleo, <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">encontrado automáticamente.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl leading-relaxed mt-6">
                  Busca trabajos en los distintos portales con solo un botón. Recibe notificaciones y gestiona tus postulaciones en un solo lugar, con un estilo inigualable.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/login" className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-10 py-3 text-lg font-bold text-white shadow-xl hover:shadow-fuchsia-500/30 transition-all hover:scale-105">
                  Empezar ahora
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-8 backdrop-blur-xl bg-slate-900/40 rounded-3xl shadow-2xl border border-slate-800/50 hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                  <Search className="h-10 w-10 text-fuchsia-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200">Búsqueda Inteligente</h3>
                <p className="text-slate-400">Escaneamos portales como ChileTrabajos usando tus palabras clave favoritas, sin esfuerzo.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 backdrop-blur-xl bg-slate-900/40 rounded-3xl shadow-2xl border border-slate-800/50 hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <Zap className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200">Automatización</h3>
                <p className="text-slate-400">No pierdas tiempo buscando manualmente. Deja que el sistema lo haga por ti cada día.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 backdrop-blur-xl bg-slate-900/40 rounded-3xl shadow-2xl border border-slate-800/50 hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <Shield className="h-10 w-10 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200">Seguimiento Total</h3>
                <p className="text-slate-400">Organiza tus postulaciones por estado y mantén un registro claro de tus avances laborales.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800/50 relative z-10 bg-slate-950/80 backdrop-blur-md">
        <p className="text-sm text-slate-500">© 2026 Ruta Laboral. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors" href="#">Términos</Link>
          <Link className="text-sm text-slate-400 hover:text-fuchsia-400 transition-colors" href="#">Privacidad</Link>
        </nav>
      </footer>
    </div>
  )
}
