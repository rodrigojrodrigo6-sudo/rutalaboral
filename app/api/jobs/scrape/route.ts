import { createClient } from '@/lib/supabase/server'
import { scrapeChileTrabajos } from '@/lib/scrapers/chiletrabajos'
import { scrapeLaborum } from '@/lib/scrapers/laborum'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  // 1. Get logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Fetch search preferences for the logged-in user
  const { data: pref, error: prefError } = await supabase
    .from('search_preferences')
    .select('user_id, keywords, regions, sources')
    .eq('user_id', user.id)
    .single()

  if (prefError || !pref) {
    return NextResponse.json({ error: 'Preferences not found' }, { status: 404 })
  }

  const details = {
    ChileTrabajos: { success: true, added: 0, error: null as string | null },
    Laborum: { success: true, added: 0, error: null as string | null }
  }
  
  // Check active sources
  const runChileTrabajos = !pref.sources || pref.sources.includes('ChileTrabajos')
  const runLaborum = !pref.sources || pref.sources.includes('Laborum')
  
  if (!runChileTrabajos) {
    details.ChileTrabajos.success = true
    details.ChileTrabajos.error = "Desactivada"
  }
  if (!runLaborum) {
    details.Laborum.success = true
    details.Laborum.error = "Desactivada"
  }

  let totalAdded = 0

  for (const keyword of pref.keywords) {
    for (const region of (pref.regions.length > 0 ? pref.regions : [undefined])) {
      let ctJobs: any[] = []
      let laJobs: any[] = []

      // Run ChileTrabajos
      if (runChileTrabajos) {
        try {
          const fetched = await scrapeChileTrabajos(keyword, region)
          ctJobs = fetched
        } catch (e: any) {
          details.ChileTrabajos.success = false
          details.ChileTrabajos.error = e.message || 'Error de conexión'
        }
      }

      // Run Laborum
      if (runLaborum) {
        try {
          const fetched = await scrapeLaborum(keyword, region)
          laJobs = fetched
        } catch (e: any) {
          details.Laborum.success = false
          details.Laborum.error = e.message || 'Error de conexión'
        }
      }

      // Insert ChileTrabajos jobs
      for (const job of ctJobs) {
        const { error: insertError } = await supabase
          .from('job_offers')
          .insert({
            ...job,
            user_id: pref.user_id,
          })
          .select()
        
        if (!insertError) {
          details.ChileTrabajos.added++
          totalAdded++
        }
      }

      // Insert Laborum jobs
      for (const job of laJobs) {
        const { error: insertError } = await supabase
          .from('job_offers')
          .insert({
            ...job,
            user_id: pref.user_id,
          })
          .select()
        
        if (!insertError) {
          details.Laborum.added++
          totalAdded++
        }
      }
    }
  }
  
  // Update last_scrape_at
  await supabase
    .from('search_preferences')
    .update({ last_scrape_at: new Date().toISOString() })
    .eq('user_id', pref.user_id)

  return NextResponse.json({ success: true, added: totalAdded, details })
}
