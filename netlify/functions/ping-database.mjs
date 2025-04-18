import { createClient } from '@supabase/supabase-js'

export default async (req) => {
  const { next_run } = await req.json()
  const supabase = createClient(
    process.env.VITE_SUPABASE_DATABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
  )
  const { error } = await supabase.from('pokemons').select('*').limit(1)

  if (error) {
    console.log(`Failed to ping Supabase: ${error.message}.`)
  } else {
    console.log('Successfully pinged Supabase.')
  }

  console.log(`Next invocation at: ${formatDate(new Date(next_run))}.`)
}

export const config = {
  schedule: '@weekly',
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

function formatDate(date) {
  const hours = date.getHours() % 12 || 12
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = date.getHours() >= 12 ? 'pm' : 'am'
  const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  const year = date.getFullYear()
  const ordinal = getOrdinalSuffix(day)

  return `${hours}.${minutes}${ampm} on ${dayOfWeek} ${day}${ordinal} ${month} ${year}`
}
