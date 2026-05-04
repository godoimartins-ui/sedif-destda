import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== 'SETUP-GODOI-2024') return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  const hash = await bcrypt.hash('Godoi@2024', 10)
  await prisma.usuario.upsert({ where:{email:'admin@godoi.com.br'}, create:{nome:'Administrador',email:'admin@godoi.com.br',senhaHash:hash}, update:{senhaHash:hash} })
  const k = await prisma.apiKey.upsert({ where:{chave:'PAD-GODOI-2024-ROBO-POWER-AUTOMATE'}, create:{descricao:'Robo Power Automate',chave:'PAD-GODOI-2024-ROBO-POWER-AUTOMATE'}, update:{} })
  return NextResponse.json({ mensagem:'Setup OK!', login:{email:'admin@godoi.com.br',senha:'Godoi@2024'}, apiKey:k.chave })
}