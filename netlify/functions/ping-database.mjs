import { createClient } from '@supabase/supabase-js'

export default async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_DATABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
  const { error } = await supabase.from('pokemons').select('*')

  if (error) {
    console.log(`Failed to ping Supabase: ${error.message}.`)
  } else {
    console.log('Successfully pinged Supabase.')
  }
}

export const config = {
  schedule: '@daily',
}
