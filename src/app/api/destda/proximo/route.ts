import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, unauthorizedResponse } from '@/lib/apiAuth'

export async function GET(req: NextRequest) {
  if (!(await validateApiKey(req))) return unauthorizedResponse()
  const empresa = await prisma.$transaction(async (tx) => {
    const registro = await tx.empresaDestda.findFirst({
      where: {
        status: { in: ['aguardando', 'reprocessar'] },
        OR: [{ bloqueadoEm: null }, { bloqueadoEm: { lt: new Date(Date.now() - 10 * 60 * 1000) } }],
      },
      orderBy: { criadoEm: 'asc' },
    })
    if (!registro) return null
    return tx.empresaDestda.update({ where: { id: registro.id }, data: { bloqueadoEm: new Date() } })
  })
  if (!empresa) return NextResponse.json({ mensagem: 'Nenhum registro na fila.' }, { status: 204 })
  return NextResponse.json(empresa)
}