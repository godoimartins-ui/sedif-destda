import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const totais = await prisma.empresaDestda.groupBy({ by: ['status'], _count: true })
  const totaisMap = Object.fromEntries(totais.map((t) => [t.status, t._count]))
  const totalGeral = totais.reduce((acc, t) => acc + t._count, 0)
  const ultimos = await prisma.empresaDestda.findMany({ orderBy: { criadoEm: 'desc' }, take: 8 })

  const cards = [
    { label: 'Total Geral',  value: totalGeral,                     color: 'bg-[#0f2044] text-white' },
    { label: 'Aguardando',   value: totaisMap['aguardando'] ?? 0,    color: 'bg-yellow-50 text-yellow-800 border border-yellow-200' },
    { label: 'Em Execucao',  value: totaisMap['em_execucao'] ?? 0,   color: 'bg-blue-50 text-blue-800 border border-blue-200' },
    { label: 'Concluidos',   value: totaisMap['concluido'] ?? 0,     color: 'bg-green-50 text-green-800 border border-green-200' },
    { label: 'Com Erro',     value: totaisMap['erro'] ?? 0,          color: 'bg-red-50 text-red-800 border border-red-200' },
    { label: 'Reprocessar',  value: totaisMap['reprocessar'] ?? 0,   color: 'bg-orange-50 text-orange-800 border border-orange-200' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Visao geral do processamento SEDIF/DeSTDA</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {cards.map((card) => (
            <div key={card.label} className={`rounded-xl p-5 shadow-sm ${card.color}`}>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="text-sm mt-1 opacity-80">{card.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Ultimos Cadastros</h2>
            <Link href="/fila" className="text-sm text-blue-600 hover:underline">Ver todos</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">UF</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Competencia</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ultimos.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link href={`/detalhes/${emp.id}`} className="hover:text-blue-600">{emp.razaoSocial}</Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{emp.cnpj}</td>
                    <td className="px-6 py-4 text-gray-500">{emp.uf}</td>
                    <td className="px-6 py-4 text-gray-500">{String(emp.competenciaMes).padStart(2,'0')}/{emp.competenciaAno}</td>
                    <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ultimos.length === 0 && <div className="text-center py-12 text-gray-400">Nenhum cadastro ainda.</div>}
          </div>
        </div>
      </main>
    </div>
  )
}