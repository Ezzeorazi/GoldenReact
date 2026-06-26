// Primitivos de formulario para el panel admin (tema oscuro con acento dorado).
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

const baseField =
  'w-full bg-[#111] text-gold/95 font-condensed text-lg ' +
  'border border-gold/25 rounded-lg px-4 py-2.5 outline-none ' +
  'placeholder-gold/40 focus:border-gold/70 transition-colors'

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block mb-4">
      <span className="block font-condensed text-gold/70 text-sm tracking-[1.5px] uppercase mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-gold/40 text-sm mt-1">{hint}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseField} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseField} leading-relaxed resize-y ${props.className ?? ''}`} />
}

export function Select(
  { options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] },
) {
  return (
    <select {...props} className={`${baseField} appearance-none cursor-pointer ${props.className ?? ''}`}>
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>)}
    </select>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0a0a0a] border border-gold/15 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

export function Btn({
  children, onClick, type = 'button', variant = 'gold', disabled, className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'gold' | 'ghost' | 'danger'
  disabled?: boolean
  className?: string
}) {
  const styles = {
    gold:   'bg-gold text-black hover:brightness-110',
    ghost:  'border border-gold/40 text-gold hover:bg-gold/10',
    danger: 'border border-red-500/50 text-red-400 hover:bg-red-500/10',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-condensed font-bold tracking-[2px] uppercase
                  text-sm px-5 py-2.5 rounded-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

/** Mensaje de estado (éxito / error). */
export function StatusMsg({ status }: { status: { type: 'ok' | 'error'; text: string } | null }) {
  if (!status) return null
  return (
    <div
      className={`font-condensed text-base px-4 py-3 rounded-lg mb-4 border
        ${status.type === 'ok'
          ? 'bg-green-500/10 border-green-500/40 text-green-300'
          : 'bg-red-500/10 border-red-500/40 text-red-300'}`}
    >
      {status.text}
    </div>
  )
}
