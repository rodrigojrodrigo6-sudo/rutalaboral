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

  const userJobs = []
  
  // Check active sources
  const runChileTrabajos = !pref.sources || pref.sources.includes('ChileTrabajos')
  const runLaborum = !pref.sources || pref.sources.includes('Laborum')
  
  for (const keyword of pref.keywords) {
    for (const region of (pref.regions.length > 0 ? pref.regions : [undefined])) {
      // Run scrapers in parallel
      const [chileTrabajosJobs, laborumJobs] = await Promise.all([
        runChileTrabajos ? scrapeChileTrabajos(keyword, region) : Promise.resolve([]),
        runLaborum ? scrapeLaborum(keyword, region) : Promise.resolve([])
      ])

      const scrapedJobs = [...chileTrabajosJobs, ...laborumJobs]
      
      for (const job of scrapedJobs) {
        // 3. Try to insert (Supabase will handle duplicates via UNIQUE constraint on user_id, url)
        const { error: insertError } = await supabase
          .from('job_offers')
          .insert({
            ...job,
            user_id: pref.user_id,
          })
          .select()
        
        if (!insertError) {
          userJobs.push(job.titulo)
        }
      }
    }
  }
  
  // Update last_scrape_at
  await supabase
    .from('search_preferences')
    .update({ last_scrape_at: new Date().toISOString() })
    .eq('user_id', pref.user_id)

  return NextResponse.json({ success: true, added: userJobs.length })
}
