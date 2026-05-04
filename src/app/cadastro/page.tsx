'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'

const UFS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

type FormData = {
  cnpj: string; razaoSocial: string; inscricaoEstadual: string; uf: string
  municipio: string; regimeTributario: string; competenciaMes: number; competenciaAno: number
  responsavel: string; observacoes: string;
}

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/destda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, competenciaMes: Number(data.competenciaMes), competenciaAno: Number(data.competenciaAno) }),
      })
      if (res.ok) { toast.success('Empresa cadastrada com sucesso!'); router.push('/fila') }
      else toast.error('Erro ao cadastrar empresa.')
    } catch { toast.error('Erro de conexao.') }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Novo Cadastro</h1>
          <p className="text-gray-500 text-sm mt-1">Adicione uma empresa para o SEDIF/DeSTDA</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ *</label>
                <input {...register('cnpj', { required: true })} placeholder="00.000.000/0000-00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.cnpj && <p className="text-red-500 text-xs mt-1">Campo obrigatorio</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razao Social *</label>
                <input {...register('razaoSocial', { required: true })} placeholder="Nome da empresa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inscricao Estadual</label>
                <input {...register('inscricaoEstadual')} placeholder="000.000.000.000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UF *</label>
                <select {...register('uf', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipio *</label>
                <input {...register('municipio', { required: true })} placeholder="Nome da cidade"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regime Tributario *</label>
                <select {...register('regimeTributario', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  <option value="simples_nacional">Simples Nacional</option>
                  <option value="lucro_presumido">Lucro Presumido</option>
                  <option value="lucro_real">Lucro Real</option>
                  <option value="mei">MEI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes *</label>
                <select {...register('competenciaMes', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  {Array.from({length:12},(_,i)=>i+1).map(m => <option key={m} value={m}>{String(m).padStart(2,'0')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
                <input {...register('competenciaAno', { required: true })} type="number" placeholder="2024" min="2020" max="2099"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsavel</label>
                <input {...register('responsavel')} placeholder="Nome do responsavel"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observacoes</label>
              <textarea {...register('observacoes')} rows={3} placeholder="Informacoes adicionais..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading}
                className="bg-[#0f2044] hover:bg-[#1a3468] text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-60">
                {loading ? 'Salvando...' : 'Cadastrar Empresa'}
              </button>
              <button type="button" onClick={() => router.push('/fila')}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-lg transition">Cancelar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}