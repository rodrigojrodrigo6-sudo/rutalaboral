'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteJob(jobId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('job_offers')
    .delete()
    .eq('id', jobId)

  if (error) {
    throw new Error('Error al eliminar la oferta')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
}

export async function deleteAllJobs() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('job_offers')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Error al eliminar todas las ofertas')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
}

export async function deleteSelectedJobs(jobIds: string[]) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('job_offers')
    .delete()
    .in('id', jobIds)

  if (error) {
    throw new Error('Error al eliminar las ofertas seleccionadas')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
}

export async function updateJobStatus(jobId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('job_offers')
    .update({ estado: status })
    .eq('id', jobId)

  if (error) {
    throw new Error('Error al actualizar el estado')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/jobs')
}
