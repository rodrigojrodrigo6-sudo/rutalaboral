import { createClient } from '@/lib/supabase/server'

async function clearJobs() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('No user logged in')
    return
  }

  const { error } = await supabase
    .from('job_offers')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Error clearing jobs:', error.message)
  } else {
    console.log('Jobs cleared for user:', user.email)
  }
}

clearJobs()
