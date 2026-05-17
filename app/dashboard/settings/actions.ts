'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient()
  
  const keywordsStr = formData.get('keywords') as string
  const regionsStr = formData.get('regions') as string
  
  const keywords = keywordsStr.split(',').map(s => s.trim()).filter(Boolean)
  const regions = regionsStr.split(',').map(s => s.trim()).filter(Boolean)

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const { error } = await supabase
    .from('search_preferences')
    .update({
      keywords,
      regions,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating preferences:', error)
  }

  revalidatePath('/dashboard/settings')
}

export async function updateSources(sources: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('search_preferences')
    .update({
      sources,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating sources:', error)
  }

  revalidatePath('/dashboard/settings')
}
