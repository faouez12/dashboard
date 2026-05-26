'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Please enter your access password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to dashboard
        router.push(data.redirect || '/admin/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Invalid administrator password.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError('Connection failed. Please check your internet connection.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white relative font-sans overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950/80 to-zinc-950 z-0 pointer-events-none" />
      <div className="absolute -top-[40%] -left-[30%] w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-[40%] -right-[30%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-md p-8 md:p-10 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-[2.5rem] shadow-2xl shadow-black/80 z-10 flex flex-col items-center">
        {/* Decorative Badge */}
        <span className="flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] uppercase tracking-widest font-mono font-bold mb-8">
          <ShieldCheck className="h-3.5 w-3.5" /> SECURE CONTROL NODE
        </span>

        {/* Logo/Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight font-display text-white">
            SHAHINE<span className="text-blue-500">.</span>SPORTS
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-medium">
            Enter password to authenticate and unlock control terminal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Access Token / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-5 py-4 bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-2xl text-sm placeholder-zinc-700 outline-none transition-all pr-12 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-black italic uppercase tracking-wider text-xs rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? 'Validating Token...' : 'Unlock Console'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest border-t border-zinc-800/40 pt-6 w-full flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-blue-500" /> Powered by Antigravity v2026
        </div>
      </div>
    </div>
  )
}
