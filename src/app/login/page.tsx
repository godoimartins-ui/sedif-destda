'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password: senha, redirect: false })
    setLoading(false)
    if (res?.ok) router.push('/dashboard')
    else toast.error('E-mail ou senha invalidos.')
  }

  return (
    <div className="min-h-screen bg-[#0f2044] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0f2044] rounded-2xl mb-4">
            <span className="text-white text-2xl">🏛️</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f2044]">Godoi Contabilidade</h1>
          <p className="text-gray-500 text-sm mt-1">Portal SEDIF/DeSTDA</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#0f2044] hover:bg-[#1a3468] text-white font-semibold py-3 rounded-lg transition disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Portal restrito - Godoi Contabilidade</p>
      </div>
    </div>
  )
}