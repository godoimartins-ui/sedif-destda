import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'

export default async function LogsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  const logsData = await prisma.logDestda.findMany({
    orderBy: { criadoEm: 'desc' }, take: 100,
    include: { empresa: { select: { razaoSocial: true, cnpj: true } } },
  })
  const erros = await prisma.empresaDestda.findMany({ where: { status: 'erro' }, orderBy: { atualizadoEm: 'desc' }, take: 20 })
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Logs e Erros</h1>
          <p className="text-gray-500 text-sm mt-1">Historico de alteracoes de status</p>
        </div>
        {erros.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-red-700 mb-4">⚠️ Com Erro ({erros.length})</h2>
            <div className="space-y-3">
              {erros.map(emp => (
                <div key={emp.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-red-800">{emp.razaoSocial}</p>
                    <p className="text-xs text-red-600 mt-1">{emp.mensagemErro}</p>
                  </div>
                  <Link href={`/detalhes/${emp.id}`} className="text-sm text-red-700 hover:underline ml-4">Detalhes</Link>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Historico de Logs</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">De</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Para</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsData.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/detalhes/${log.empresaDestdaId}`} className="font-medium text-gray-900 hover:text-blue-600">{log.empresa?.razaoSocial}</Link>
                    </td>
                    <td className="px-6 py-4">{log.statusAnterior ? <StatusBadge status={log.statusAnterior} /> : '-'}</td>
                    <td className="px-6 py-4">{log.statusNovo ? <StatusBadge status={log.statusNovo} /> : '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs"><p className="truncate">{log.mensagem ?? '-'}</p></td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(log.criadoEm).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}