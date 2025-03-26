import { notFound } from 'next/navigation'
import supabase from './supabase'

export async function getDays() {
  let { data, error } = await supabase
    .from('days')
    .select('*')

  return data
}

export async function getDayData(day) {
  let { data, error } = await supabase
    .from('days')
    .select('*')
    .eq('date', day)

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    // not found triggers the not-found.js page
    // otherwise there will be en error page shown
    notFound()
  }

  return data
}

