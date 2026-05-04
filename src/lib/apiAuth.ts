import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'
export async function validateApiKey(req: NextRequest): Promise<boolean> {
  const k = req.headers.get('x-api-key')
  if (!k) return false
  const key = await prisma.apiKey.findFirst({ where: { chave: k, ativa: true } })
  return !!key
}
export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Chave de API invalida.' }, { status: 401 })
}