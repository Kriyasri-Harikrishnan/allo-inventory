function getBaseUrl() {
  if (typeof window !== "undefined") 
    return ""
  if (process.env.VERCEL_URL) 
    return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000" 
}

const base = `${getBaseUrl()}/api`

export async function fetchProducts() {
    const res = await fetch(`${base}/products`)
    if (!res.ok) 
        throw new Error("Failed to fetch products!")
    return res.json()
}

export async function fetchWarehouses() {
    const res = await fetch(`${base}/warehouses`)
    if (!res.ok) 
        throw new Error("Failed to fetch warehouses!")
    return res.json()
}

export async function createReservation(stockId: string, quantity: number) {
    const res = await fetch(`${base}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockId, quantity }),
    })
    const data = await res.json()
    if (!res.ok) 
        return { error: data.error, status: res.status }
    return { data, status: res.status }
}

export async function confirmReservation(id: string) {
    const res = await fetch(`${base}/reservations/${id}/confirm`, {
        method: "POST",
    })
    const data = await res.json()
    if (!res.ok) 
        return { error: data.error, status: res.status }
    return { data, status: res.status }
}

export async function releaseReservation(id: string) {
    const res = await fetch(`${base}/reservations/${id}/release`, {
        method: "POST",
    })
    const data = await res.json()
    if (!res.ok) 
        return { error: data.error, status: res.status }
    return { data, status: res.status }
}

export async function fetchAdminReservations() {
    const res = await fetch(`${base}/admin/reservations`)
    if (!res.ok) 
        throw new Error("Failed to fetch reservations for admin page!")
    return res.json()
}

export async function fetchAdminStats() {
    const res = await fetch(`${base}/admin/stats`)
    if (!res.ok) 
        throw new Error("Failed to fetch stats for admin page!")
    return res.json()
}