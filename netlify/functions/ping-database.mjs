import { createClient } from '@supabase/supabase-js'

export default async () => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_DATABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  try {
    const timestamp = new Date().toISOString()

    // Insert a heartbeat record
    const { error: insertError } = await supabase
      .from('heartbeat')
      .insert({ pinged_at: timestamp })

    if (insertError) {
      console.log(`Insert failed: ${insertError.message}`)
      return
    }

    // Clean up old records (keep only the last 10)
    const { data: oldRecords, error: selectError } = await supabase
      .from('heartbeat')
      .select('id')
      .order('pinged_at', { ascending: false })
      .range(10, 1000) // Skip first 10, get the rest

    if (!selectError && oldRecords && oldRecords.length > 0) {
      const idsToDelete = oldRecords.map(record => record.id)
      const { error: deleteError } = await supabase
        .from('heartbeat')
        .delete()
        .in('id', idsToDelete)

      if (deleteError) {
        console.log(`Cleanup failed: ${deleteError.message}`)
      }
    }

    console.log('Successfully pinged Supabase with write operations.')
  } catch (error) {
    console.log(`Failed to ping Supabase: ${error.message}`)
  }
}

export const config = {
  schedule: '@weekly',
}
