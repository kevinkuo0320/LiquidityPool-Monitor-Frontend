'use client'
import { useEffect, useState } from 'react'

// Update interface to match your database schema
interface WhirlpoolData {
  id: number
  timestamp: string
  position_address: string
  whirlpool_price: string
  token_a_amount: string
  token_b_amount: string
  token_a_fees: string
  token_b_fees: string
}

export default function Dashboard() {
  const [data, setData] = useState<WhirlpoolData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/whirlpool')
      if (!response.ok) throw new Error('Failed to fetch data')
      const jsonData = await response.json()
      console.log(jsonData)
      setData(jsonData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Optional: Set up auto-refresh every minute
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])



  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data.length) return <div>No data available</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Whirlpool Monitoring Dashboard</h1>
      
      {data.map((item, index) => (
        <div key={index} className="mb-6 border rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Position Details</h2>
              <p>Address: {item.position_address}</p>
              <p>Price: {Number(item.whirlpool_price).toFixed(6)}</p>
              <p>Time: {new Date(item.timestamp).toLocaleString()}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Token Amounts</h2>
              <p>Token A: {Number(item.token_a_amount).toFixed(6)}</p>
              <p>Token B: {Number(item.token_b_amount).toFixed(6)}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Fees</h2>
              <p>Token A Fees: {Number(item.token_a_fees).toFixed(6)}</p>
              <p>Token B Fees: {Number(item.token_b_fees).toFixed(6)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}