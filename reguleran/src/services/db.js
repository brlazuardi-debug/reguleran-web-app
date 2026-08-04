const API = import.meta.env.VITE_API_URL || '/api'

async function getToken() {
  const session = window.Clerk?.session
  return (await session?.getToken()) || null
}

async function headers() {
  const token = await getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function subscribe(collection, callback) {
  let timer
  let stopped = false

  async function poll() {
    if (stopped) return
    try {
      const res = await fetch(`${API}/${collection}`, { headers: await headers() })
      if (!stopped && res.ok) callback(await res.json())
    } catch { /* ignore polling errors */ }
  }

  poll()
  timer = setInterval(poll, 10000)
  return () => { stopped = true; clearInterval(timer) }
}

export async function addItem(collection, data) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  const item = await res.json()
  return item.id
}

export async function setItem(collection, id, data) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ id, ...data }),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function updateItem(collection, id, data) {
  const res = await fetch(`${API}/${collection}/${id}`, {
    method: 'PUT',
    headers: await headers(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function deleteItem(collection, id) {
  const res = await fetch(`${API}/${collection}/${id}`, {
    method: 'DELETE',
    headers: await headers(),
  })
  if (!res.ok) throw new Error(await res.text())
}

export async function getItem(collection, id) {
  const res = await fetch(`${API}/${collection}/${id}`, {
    headers: await headers(),
  })
  if (!res.ok) return null
  return res.json()
}

export async function queryItems(collection, predicate) {
  const res = await fetch(`${API}/${collection}`, { headers: await headers() })
  if (!res.ok) return []
  const items = await res.json()
  return items.filter(predicate)
}
