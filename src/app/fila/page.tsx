'use client'
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Empresa = { id: string; cnpj: string; razaoSocial: string; uf: string; competenciaMes: number; competenciaAno: number; status: string; mensagemErro?: string; }

export default function FilaPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ status: '', uf: '', cnpj: '' })

  const carregar = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtros.status) params.set('status', filtros.status)
    if (filtros.uf) params.set('uf', filtros.uf)
    if (filtros.cnpj) params.set('cnpj', filtros.cnpj)
    const res = await fetch(`/api/destda?${params}`)
    const data = await res.json()
    setEmpresas(data.registros ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [filtros])

  useEffect(() => { carregar() }, [carregar])

  async function reprocessar(id: string) {
    const res = await fetch(`/api/destda/${id}/reprocessar`, { method: 'POST' })
    if (res.ok) { toast.success('Marcado para reprocessar!'); carregar() }
    else toast.error('Erro ao reprocessar.')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fila de Processamento</h1>
            <p className="text-gray-500 text-sm mt-1">{total} registros</p>
          </div>
          <Link href="/cadastro" className="bg-[#0f2044] hover:bg-[#1a3468] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">+ Novo Cadastro</Link>
        </div>
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex gap-4 flex-wrap">
          <select value={filtros.status} onChange={e => setFiltros(f => ({...f, status: e.target.value}))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="em_execucao">Em Execucao</option>
            <option value="concluido">Concluido</option>
            <option value="erro">Erro</option>
            <option value="reprocessar">Reprocessar</option>
          </select>
          <input value={filtros.uf} onChange={e => setFiltros(f => ({...f, uf: e.target.value}))} placeholder="UF" maxLength={2}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={filtros.cnpj} onChange={e => setFiltros(f => ({...f, cnpj: e.target.value}))} placeholder="CNPJ"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={carregar} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">Atualizar</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? <div className="text-center py-12 text-gray-400">Carregando...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Empresa</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">UF</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Competencia</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empresas.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/detalhes/${emp.id}`} className="hover:text-blue-600">{emp.razaoSocial}</Link>
                        {emp.mensagemErro && <p className="text-xs text-red-500 mt-0.5 truncate max-w-xs">{emp.mensagemErro}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono">{emp.cnpj}</td>
                      <td className="px-6 py-4 text-gray-500">{emp.uf}</td>
                      <td className="px-6 py-4 text-gray-500">{String(emp.competenciaMes).padStart(2,'0')}/{emp.competenciaAno}</td>
                      <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link href={`/detalhes/${emp.id}`} className="text-blue-600 hover:underline text-xs">Detalhes</Link>
                          {emp.status === 'erro' && <button onClick={() => reprocessar(emp.id)} className="text-orange-600 hover:underline text-xs">Reprocessar</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {empresas.length === 0 && <div className="text-center py-12 text-gray-400">Nenhum registro encontrado.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}