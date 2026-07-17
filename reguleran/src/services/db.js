import { supabase } from './supabase'

export function subscribe(collection, callback) {
  let channel = null
  let unsubscribed = false

  async function fetchAndNotify() {
    if (unsubscribed) return
    const { data, error } = await supabase.from(collection).select('*')
    if (!error && data) callback(data)
  }

  fetchAndNotify()

  channel = supabase.channel(`${collection}-changes`)
  channel.on('postgres_changes', { event: '*', schema: 'public', table: collection }, () => {
    fetchAndNotify()
  })
  channel.subscribe()

  return () => {
    unsubscribed = true
    if (channel) supabase.removeChannel(channel)
  }
}

export async function addItem(collection, data) {
  const { data: inserted, error } = await supabase.from(collection).insert(data).select().single()
  if (error) throw error
  return inserted.id
}

export async function setItem(collection, id, data) {
  const { error } = await supabase.from(collection).upsert({ id, ...data })
  if (error) throw error
}

export async function updateItem(collection, id, data) {
  const { error } = await supabase.from(collection).update(data).eq('id', id)
  if (error) throw error
}

export async function deleteItem(collection, id) {
  const { error } = await supabase.from(collection).delete().eq('id', id)
  if (error) throw error
}

export async function getItem(collection, id) {
  const { data, error } = await supabase.from(collection).select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function queryItems(collection, predicate) {
  const { data, error } = await supabase.from(collection).select('*')
  if (error) return []
  return data.filter(predicate)
}
