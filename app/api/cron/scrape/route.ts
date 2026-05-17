import { createClient } from '@/lib/supabase/server'
import { scrapeChileTrabajos } from '@/lib/scrapers/chiletrabajos'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Optional: Add basic security check (e.g. CRON_SECRET)
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // 1. Fetch active search preferences
  const { data: preferences, error: prefError } = await supabase
    .from('search_preferences')
    .select('user_id, keywords, regions')
    .eq('is_active', true)

  if (prefError) return NextResponse.json({ error: prefError.message }, { status: 500 })

  const results = []

  // 2. Process each user's preferences
  for (const pref of preferences) {
    const userJobs = []
    
    for (const keyword of pref.keywords) {
      for (const region of (pref.regions.length > 0 ? pref.regions : [undefined])) {
        const scrapedJobs = await scrapeChileTrabajos(keyword, region)
        
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
    
    results.push({ user_id: pref.user_id, added: userJobs.length })
    
    // Update last_scrape_at
    await supabase
      .from('search_preferences')
      .update({ last_scrape_at: new Date().toISOString() })
      .eq('user_id', pref.user_id)
  }

  return NextResponse.json({ success: true, results })
}
