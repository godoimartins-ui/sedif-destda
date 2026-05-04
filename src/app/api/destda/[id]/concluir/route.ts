import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth'
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await validateApiKey(req))) return unauthorizedResponse()
  const body = await req.json().catch(()=>({}))
  const e = await prisma.empresaDestda.findUnique({ where: { id: params.id } })
  if (!e) return NextResponse.json({ error: 'Nao encontrado.' }, { status: 404 })
  await prisma.$transaction([prisma.empresaDestda.update({ where:{id:params.id}, data:{status:'concluido',mensagemErro:null,bloqueadoEm:null,processadoEm:new Date()} }),prisma.logDestda.create({ data:{empresaDestdaId:params.id,statusAnterior:e.status,statusNovo:'concluido',mensagem:body.mensagem??'Sucesso.'} })])
  return NextResponse.json({ mensagem: 'Concluido.' })
}