import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const allData = await prisma.position_records.findMany({
      orderBy: {
        timestamp: 'asc'
      },
      take: 50
    })

    return NextResponse.json(allData)

  } catch (error) {
    const err = error as Error
    
    console.error('Database error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    })

    return NextResponse.json(
      { 
        error: 'Database error',
        details: err.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 