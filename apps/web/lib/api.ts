const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Product {
  id: string
  name: string
  price: number
  margin?: number
  icon?: string
  category?: string
  description?: string
  vendor?: string
}

export interface Order {
  id: string
  productId: string
  buyerAddress: string
  vendorAddress: string
  price: number
  status: 'DRAFT' | 'ESCROWED' | 'IN_TRANSIT' | 'DELIVERED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED'
  createdAt: string
  deliveryDeadline?: string
  txHash?: string
}

export interface Leaderboard {
  rank: number
  address: string
  name: string
  location: string
  earnings: number
  sales: number
}

export const api = {
  // Products
  async getProducts(category?: string, skip = 0, take = 20): Promise<Product[]> {
    const params = new URLSearchParams()
    if (category && category !== 'all') params.append('category', category)
    params.append('skip', skip.toString())
    params.append('take', take.toString())

    const res = await fetch(`${API_URL}/products?${params}`)
    if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`)
    const json = await res.json()
    return json.data || []
  },

  async getProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/${id}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  },

  // Orders
  async createOrder(productId: string, buyerAddress: string, vendorAddress: string, price: number): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        buyerAddress,
        vendorAddress,
        price,
      }),
    })
    if (!res.ok) throw new Error(`Order creation failed: ${res.status}`)
    const json = await res.json()
    return json.data
  },

  async getOrder(id: string): Promise<Order | null> {
    const res = await fetch(`${API_URL}/orders/${id}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  },

  async confirmDelivery(id: string): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${id}/confirm-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!res.ok) throw new Error(`Confirm delivery failed: ${res.status}`)
    const json = await res.json()
    return json.data
  },

  async getOrdersByBuyer(address: string): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders/buyer/${address}`)
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  },

  async getOrdersByVendor(address: string): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders/vendor/${address}`)
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  },
}
