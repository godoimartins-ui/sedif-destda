import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const where: Record<string, unknown> = {}
  const status = searchParams.get('status'); if (status) where.status = status
  const uf = searchParams.get('uf'); if (uf) where.uf = uf
  const cnpj = searchParams.get('cnpj'); if (cnpj) where.cnpj = { contains: cnpj }
  const mes = searchParams.get('mes'); if (mes) where.competenciaMes = parseInt(mes)
  const ano = searchParams.get('ano'); if (ano) where.competenciaAno = parseInt(ano)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const [total, registros] = await Promise.all([
    prisma.empresaDestda.count({ where }),
    prisma.empresaDestda.findMany({ where, orderBy: { criadoEm: 'desc' }, skip: (page-1)*limit, take: limit }),
  ])
  return NextResponse.json({ total, pagina: page, registros })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
  const body = await req.json()
  const empresa = await prisma.empresaDestda.create({
    data: {
      cnpj: body.cnpj, razaoSocial: body.razaoSocial, inscricaoEstadual: body.inscricaoEstadual,
      uf: body.uf, municipio: body.municipio, regimeTributario: body.regimeTributario,
      competenciaMes: Number(body.competenciaMes), competenciaAno: Number(body.competenciaAno),
      responsavel: body.responsavel, observacoes: body.observacoes, status: 'aguardando',
    },
  })
  await prisma.logDestda.create({ data: { empresaDestdaId: empresa.id, statusAnterior: null, statusNovo: 'aguardando', mensagem: 'Cadastro criado pelo portal.' } })
  return NextResponse.json(empresa, { status: 201 })
}