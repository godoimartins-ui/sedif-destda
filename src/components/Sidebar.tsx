'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import clsx from 'clsx'
const nav = [{href:'/dashboard',label:'Dashboard',icon:'📊'},{href:'/cadastro',label:'Novo Cadastro',icon:'➕'},{href:'/fila',label:'Fila',icon:'📋'},{href:'/logs',label:'Logs',icon:'🔍'}]
export default function Sidebar() {
  const p = usePathname(); const {data:s} = useSession()
  return (<aside className="w-64 min-h-screen bg-[#0f2044] text-white flex flex-col shadow-xl"><div className="p-6 border-b border-white/10"><div className="text-xl font-bold">Godoi Contabilidade</div><div className="text-xs text-blue-300 mt-1">Portal SEDIF/DeSTDA</div></div><nav className="flex-1 p-4 space-y-1">{nav.map(item=><Link key={item.href} href={item.href} className={clsx('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',p.startsWith(item.href)?'bg-blue-600 text-white':'text-blue-100 hover:bg-white/10')}><span>{item.icon}</span>{item.label}</Link>)}</nav><div className="p-4 border-t border-white/10"><div className="text-sm text-blue-200 mb-1">{s?.user?.name}</div><div className="text-xs text-blue-400 mb-3">{s?.user?.email}</div><button onClick={()=>signOut({callbackUrl:'/login'})} className="w-full text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">Sair</button></div></aside>)
}