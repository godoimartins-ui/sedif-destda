import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
  const e = await prisma.empresaDestda.findUnique({ where: { id: params.id } })
  if (!e) return NextResponse.json({ error: 'Nao encontrado.' }, { status: 404 })
  await prisma.$transaction([prisma.empresaDestda.update({ where:{id:params.id}, data:{status:'reprocessar',mensagemErro:null,bloqueadoEm:null} }),prisma.logDestda.create({ data:{empresaDestdaId:params.id,statusAnterior:e.status,statusNovo:'reprocessar',mensagem:'Marcado para reprocessar.'} })])
  return NextResponse.json({ mensagem: 'Marcado para reprocessar.' })
}