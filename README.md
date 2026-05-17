# JobTracker - Plataforma de Seguimiento Laboral

Una aplicación web moderna para centralizar y automatizar la búsqueda de empleo.

## 🚀 Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Base de Datos & Auth**: Supabase (PostgreSQL + RLS)
- **Estilos**: TailwindCSS + shadcn/ui
- **Scraping**: Cheerio

## 🛠️ Configuración Inicial

### 1. Variables de Entorno
Copia el archivo `.env.local.example` a `.env.local` y completa las credenciales de tu proyecto Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
CRON_SECRET=una_clave_aleatoria_para_el_scraper
```

### 2. Base de Datos
Ejecuta el script SQL ubicado en `supabase/schema.sql` dentro del **SQL Editor** de tu panel de Supabase. Esto creará:
- Tablas de perfiles, ofertas y preferencias.
- Políticas de seguridad (RLS) para proteger los datos de cada usuario.
- Triggers automáticos para creación de perfiles y timestamps.

### 3. Instalación
```bash
npm install
```

### 4. Ejecución
```bash
npm run dev
```

## 🤖 Automatización (Scraper)

El sistema está preparado para buscar ofertas automáticamente. 

- **Localmente**: Puedes probar el scraper visitando `/api/cron/scrape?secret=TU_CRON_SECRET`.
- **Producción**: Configura un Cron Job en Vercel (o similar) que apunte a esa URL diariamente.

## 📁 Estructura del Proyecto

- `/app`: Rutas y páginas de la aplicación.
- `/components`: Componentes de UI reutilizables (Sidebar, Buttons, etc.).
- `/lib`: Lógica de Supabase, scrapers y utilidades.
- `/supabase`: Scripts de base de datos.
- `/types`: Definiciones de TypeScript.

## 🔒 Seguridad
Los datos están protegidos mediante **Row Level Security (RLS)**. Cada usuario autenticado solo puede interactuar con sus propias ofertas y configuraciones.
