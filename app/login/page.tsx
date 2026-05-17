import { login, signup } from './actions'
import { Briefcase, CheckCircle2, TrendingUp, Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing orbs/auroras */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob [animation-delay:2000ms]"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob [animation-delay:4000ms]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:flex lg:items-center lg:gap-16">
        
        {/* Left Column: Copy & Features */}
        <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Tu próximo <br className="hidden lg:block" />
            gran <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">trabajo</span> <br className="hidden lg:block" />
            te está esperando
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0">
            Conecta con oportunidades que impulsan tu carrera. Automatiza tu búsqueda, gestiona tus postulaciones y toma el control de tu futuro profesional.
          </p>

          {/* Form Box for Mobile (hidden on desktop) */}
          <div className="block lg:hidden w-full max-w-md mx-auto mb-12">
            <AuthForm />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
            <div className="flex flex-col items-center lg:items-start text-slate-400 hover:text-fuchsia-400 transition-colors">
              <CheckCircle2 className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Ofertas Reales</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-slate-400 hover:text-indigo-400 transition-colors">
              <Briefcase className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Empresas Top</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-slate-400 hover:text-fuchsia-400 transition-colors">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Crecimiento</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-slate-400 hover:text-indigo-400 transition-colors">
              <Zap className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium uppercase tracking-wider">Rápido & Fácil</span>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form (Desktop) */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="max-w-md ml-auto">
            <AuthForm />
          </div>
        </div>

      </div>
    </div>
  )
}

function AuthForm() {
  return (
    <div className="backdrop-blur-xl bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">Ingresa a tu cuenta</h2>
        <p className="text-sm text-slate-400">Comienza a rastrear tu próximo empleo</p>
      </div>
      
      <form className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="block w-full rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="block w-full rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <button
            formAction={login}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 focus:ring-offset-slate-900 transition-all transform hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">¿Nuevo aquí?</span>
            </div>
          </div>

          <button
            formAction={signup}
            className="w-full flex justify-center py-3 px-4 border border-slate-700 rounded-lg shadow-sm text-sm font-bold text-white bg-slate-800/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all"
          >
            Crear Cuenta
          </button>
        </div>
      </form>
    </div>
  )
}
