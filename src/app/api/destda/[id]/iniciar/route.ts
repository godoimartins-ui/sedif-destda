import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth'
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await validateApiKey(req))) return unauthorizedResponse()
  const e = await prisma.empresaDestda.findUnique({ where: { id: params.id } })
  if (!e) return NextResponse.json({ error: 'Nao encontrado.' }, { status: 404 })
  await prisma.$transaction([prisma.empresaDestda.update({ where:{id:params.id}, data:{status:'em_execucao',bloqueadoEm:new Date()} }),prisma.logDestda.create({ data:{empresaDestdaId:params.id,statusAnterior:e.status,statusNovo:'em_execucao',mensagem:'Robo iniciou.'} })])
  return NextResponse.json({ mensagem: 'em_execucao.' })
}