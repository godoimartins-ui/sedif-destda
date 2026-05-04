import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
export default async function DetalhesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  const empresa = await prisma.empresaDestda.findUnique({ where: { id: params.id }, include: { logs: { orderBy: { criadoEm: 'desc' } } } })
  if (!empresa) notFound()
  return (<div className="flex min-h-screen bg-gray-50"><Sidebar /><main className="flex-1 p-8"><div className="mb-6"><Link href="/fila" className="text-gray-500 text-sm">← Voltar</Link><h1 className="text-2xl font-bold text-gray-900 mt-2">{empresa.razaoSocial}</h1><div className="flex items-center gap-3 mt-1"><StatusBadge status={empresa.status} /><span className="text-gray-400 text-sm">{empresa.cnpj}</span></div></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2"><div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="font-semibold text-gray-800 mb-4">Dados</h2><dl className="grid grid-cols-2 gap-4">{[['CNPJ',empresa.cnpj],['Razao Social',empresa.razaoSocial],['UF',empresa.uf],['Municipio',empresa.municipio],['Regime',empresa.regimeTributario],['Competencia',String(empresa.competenciaMes).padStart(2,'0')+'/'+empresa.competenciaAno]].map(([l,v])=>(<div key={l}><dt className="text-xs text-gray-500 uppercase">{l}</dt><dd className="text-sm text-gray-900 mt-1">{v}</dd></div>))}</dl></div>{empresa.mensagemErro&&<div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6"><h2 className="font-semibold text-red-800 mb-2">Erro</h2><p className="text-sm text-red-700">{empresa.mensagemErro}</p></div>}</div><div><div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"><h2 className="font-semibold text-gray-800 mb-4">Historico</h2><div className="space-y-3">{empresa.logs.map(log=>(<div key={log.id} className="flex gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"/><div><p className="text-xs font-medium text-gray-700">{log.statusAnterior??'inicio'} → {log.statusNovo}</p>{log.mensagem&&<p className="text-xs text-gray-500 mt-0.5">{log.mensagem}</p>}<p className="text-xs text-gray-400">{new Date(log.criadoEm).toLocaleString('pt-BR')}</p></div></div>))}</div></div></div></div></main></div>)
}