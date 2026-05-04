import clsx from 'clsx'

const statusConfig: Record<string, { label: string; color: string }> = {
  aguardando:  { label: 'Aguardando',  color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  em_execucao: { label: 'Em Execucao', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  concluido:   { label: 'Concluido',   color: 'bg-green-100 text-green-800 border-green-300' },
  erro:        { label: 'Erro',        color: 'bg-red-100 text-red-800 border-red-300' },
  reprocessar: { label: 'Reprocessar', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  cancelado:   { label: 'Cancelado',   color: 'bg-gray-100 text-gray-600 border-gray-300' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, color: 'bg-gray-100 text-gray-700 border-gray-300' }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.color)}>
      {config.label}
    </span>
  )
}