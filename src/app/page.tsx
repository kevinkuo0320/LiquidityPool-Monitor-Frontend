'use client'
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Add interface for data structure
// interface WhirlpoolData {
//   positionAddress: string;
//   timestamp: number;
//   whirlpoolPrice: number;
//   tokenAmounts: {
//     tokenA: number;
//     tokenB: number;
//   };
//   fees: {
//     tokenA: number;
//     tokenB: number;
//   };
// }

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

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const WhirlpoolDashboard = () => {
  // Update state definitions with proper types
  const [poolData, setPoolData] = useState<WhirlpoolData[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [positions, setPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    // useEffect(() => {
    //     // Disable for a single line
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     const loadData = async () => {

    //     // Or disable for a block
    //     /* eslint-disable @typescript-eslint/no-explicit-any */
    //     try {
    //         const response = await fetch('/whirlpool_monitoring_data.json');
    //         const rawData = await response.json() as WhirlpoolData[];
    //         setData(rawData);
    //         const uniquePositions = [...new Set(rawData.map(item => item.positionAddress))];
    //         setPositions(uniquePositions);
    //         setSelectedPosition(uniquePositions[0]);
    //     } catch (error) {
    //         console.error('Error loading data:', error);
    //     }
    //     /* eslint-enable @typescript-eslint/no-explicit-any */
    //     };

    //     loadData();
    //     const interval = setInterval(loadData, 300000);
    //     return () => clearInterval(interval);
    // }, []);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/whirlpool')
        if (!response.ok) throw new Error('Failed to fetch data')
        const rawData = await response.json();
        setPoolData(rawData)
        setError(null)
        const uniquePositions = [...new Set(rawData.map((item: WhirlpoolData) => item.position_address))];
        setPositions(uniquePositions as string[]);
        setSelectedPosition(uniquePositions[0] as string);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    };
    fetchData()
    const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);
  
    // useEffect(() => {
    //   fetchData()
      
    //   // Optional: Set up auto-refresh every minute
    //   const interval = setInterval(fetchData, 60000)
    //   return () => clearInterval(interval)
    // }, [])

  
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredData = poolData.filter((item: any) => item.position_address === selectedPosition);
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!poolData.length) return <div>No data available</div>
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/">
        <h1 className="text-2xl font-bold hover:text-gray-300 cursor-pointer">
          Orca Liquidity Pool Position Monitor</h1>
        </Link>
        <select 
          className="p-2 border rounded"
          value={selectedPosition || ''}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          {positions.map(pos => (
            <option key={pos} value={pos}>
              Position: {pos.slice(0, 8)}...
            </option>
          ))}
        </select>
      </div>

              {/* Latest Stats Card */}
      <Card>
          <CardHeader>
            <CardTitle>Latest Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-lg font-bold">
                    
                      {Number(filteredData[filteredData.length - 1].whirlpool_price).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Update</p>
                    <p className="text-lg">
                      {new Date(filteredData[filteredData.length - 1].timestamp).toLocaleString('en-US')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Token A (SOL) Amount</p>
                    <p className="text-lg font-bold">
                      {Number(filteredData[filteredData.length - 1].token_a_amount).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Token B (USDC) Amount</p>
                    <p className="text-lg font-bold">
                      {Number(filteredData[filteredData.length - 1].token_b_amount).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">LP Position Value</p>
                    <p className="text-lg font-bold">
                      ${Number(Number(filteredData[filteredData.length - 1].token_a_amount) 
                      * Number(filteredData[filteredData.length - 1].whirlpool_price)
                      + Number(filteredData[filteredData.length - 1].token_b_amount)
                       ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Yield</p>
                    <p className="text-lg font-bold">
                      ${Number(Number(filteredData[filteredData.length - 1].token_a_fees) 
                      * Number(filteredData[filteredData.length - 1].whirlpool_price) 
                      + Number(filteredData[filteredData.length - 1].token_b_fees)
                       ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Chart */}
        <Card>
          <CardHeader>
            <CardTitle>SOL in LP Position Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDateTime}
                  />
                  <YAxis 
                    domain={[120, 260]} // Fixed range from 0 to 100
                  />
                  <Tooltip 
                    labelFormatter={formatDateTime}
                    formatter={(value) => [`${Number(value).toFixed(4)}`, 'Price (SOL)']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="whirlpool_price" 
                    stroke="#8884d8" 
                    name="Price (SOL)"
                  />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDateTime}
                  />
                  <YAxis 
                    domain={[4000, 5000]} // Fixed range from 0 to 100
                  />
                  <Tooltip 
                    labelFormatter={formatDateTime}
                    formatter={(value) => [`${Number(value).toFixed(4)}`, 'Total Value']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={(data) => {
                      return Number(data.token_a_amount) * 
                      Number(data.whirlpool_price) + Number(data.token_b_amount);
                    }}
                    stroke="#82ca9d" 
                    name="Total Value"
                  />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


        {/* Token Amounts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Token Amounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDateTime}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={formatDateTime}
                    formatter={(value) => [`${Number(value).toFixed(4)}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="token_a_amount" 
                    stroke="#82ca9d" 
                    name="Token A"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="token_b_amount" 
                    stroke="#ffc658" 
                    name="Token B"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fees Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Accumulated Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDateTime}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={formatDateTime}
                    formatter={(value) => [`${Number(value).toFixed(6)}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="token_a_fees" 
                    stroke="#ff7300" 
                    name="Fee Token A"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="token_b_fees" 
                    stroke="#0088fe" 
                    name="Fee Token B"
                  />
                  <Line 
                    type="monotone" 
                    dataKey={(data) => {
                      return Number(data.token_a_fees) * Number(data.whirlpool_price) 
                      + Number(data.token_b_fees);
                    }}
                    stroke="#82ca9d" 
                    name="Total Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default WhirlpoolDashboard;