'use server'

import { notFound } from 'next/navigation'
import { getSupabaseClient } from '@/lib/auth'

// For testing
// await new Promise((res) => setTimeout(res, 1000));

/* expenses */

export async function getAllExpenses() {
  const supabase = await getSupabaseClient()
  let { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })

  return data
}

export async function getDayData(day) {
  const supabase = await getSupabaseClient()
  let { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('date', day)

  if (error) {
    // not found triggers the not-found.js page
    // otherwise there will be en error page shown
    notFound()
  }

  return data
}

export async function addExpense(formData) {
  const supabase = await getSupabaseClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user?.id) {
    throw new Error('Not authenticated')
  }

  const userId = userData.user.id

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      { ...formData, user_id: userId },
    ])    
}

export async function deleteExpense(expenseId) {
  const supabase = await getSupabaseClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user?.id) {
    throw new Error('Not authenticated')
  }

  const userId = userData.user.id

  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .match({ id: expenseId, user_id: userId })
}

/* settings */

export async function getUserSettings() {
  const supabase = await getSupabaseClient()
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  return settings
}

export async function updateUserSettings(newData) {
  const supabase = await getSupabaseClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user?.id) {
    throw new Error('Not authenticated')
  }

  const userId = userData.user.id

  const { data, error } = await supabase
    .from('settings')
    .update(newData)
    .eq('user_id', userId)

  return { data, error }
}
