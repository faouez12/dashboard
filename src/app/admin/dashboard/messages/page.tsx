'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Trash2, Calendar, MapPin, Users, User, ArrowRight, ShieldAlert } from 'lucide-react'
import { fetchMessages, deleteMessage } from '@/app/admin/actions'
import { useToast } from '../components/ToastProvider'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  topic: string
  type: string
  eventDetails?: string
  date?: string
  runners?: string
  created_at: string
}

export default function MessagesDashboardPage() {
  const toast = useToast()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadMessages = async () => {
    try {
      const data = await fetchMessages()
      setMessages(data as ContactMessage[])
      if (data.length > 0) {
        setSelectedMessage(data[0] as ContactMessage)
      } else {
        setSelectedMessage(null)
      }
    } catch (err) {
      console.error(err)
      toast.error('Load Error', 'Failed to retrieve inbox messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Permanently purge this customer inquiry from inbox?')) {
      setDeletingId(id)
      try {
        await deleteMessage(id)
        toast.success('Inquiry Purged', 'Inquiry deleted successfully.')
        
        // Remove locally
        const updated = messages.filter(m => m.id !== id)
        setMessages(updated)
        
        if (selectedMessage?.id === id) {
          setSelectedMessage(updated.length > 0 ? updated[0] : null)
        }
      } catch (err) {
        console.error(err)
        toast.error('Deletion Failure', 'Failed to remove message record.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse text-slate-400">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-[500px] bg-white/5 border border-white/10 rounded-2xl" />
          <div className="lg:col-span-7 h-[500px] bg-white/5 border border-white/10 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full text-slate-300">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
          <Mail className="text-[#ccff00]" size={28} />
          Inquiries Inbox
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
          Review bookings inquiries, gear questions, and event coordinator messages.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-mono uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-4">
          <Mail size={36} className="text-slate-700 animate-pulse" />
          Inbox is currently empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Message list */}
          <div className="lg:col-span-5 bg-[#1A1A1A] border border-white/5 rounded-3xl overflow-hidden flex flex-col max-h-[600px]">
            <div className="px-5 py-4 border-b border-white/5 bg-zinc-950/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inquiry List ({messages.length})</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id
                      ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${selectedMessage?.id === msg.id ? 'text-white' : 'text-slate-300'}`}>
                        {msg.name}
                      </span>
                      {msg.type === 'booking' && (
                        <span className="px-1.5 py-0.5 bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-[8px] font-mono font-bold rounded uppercase">
                          Booking
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase truncate">
                      {msg.topic}
                    </span>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-2">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="text-[8px] font-mono text-slate-500 uppercase">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      disabled={deletingId === msg.id}
                      className="p-1.5 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Purge message"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Message Detail Viewer */}
          <div className="lg:col-span-7 bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            {selectedMessage ? (
              <div className="space-y-6">
                
                {/* Header metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#ccff00] uppercase tracking-widest block font-mono">
                      Sender Dossier
                    </span>
                    <h3 className="text-xl font-black text-white uppercase mt-1 tracking-tight">
                      {selectedMessage.name}
                    </h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs font-mono text-[#ccff00] hover:underline block mt-0.5"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Submission timestamp</span>
                    <span className="text-xs font-bold text-slate-300 block mt-1">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Topic info */}
                <div className="bg-zinc-950/25 p-4 rounded-xl border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Topic / Intent</span>
                      <span className="text-white font-bold block mt-1 uppercase font-mono">{selectedMessage.topic}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Inquiry Type</span>
                      <span className="text-white font-bold block mt-1 uppercase font-mono">{selectedMessage.type}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Sub-fields */}
                {selectedMessage.type === 'booking' && (
                  <div className="bg-[#ccff00]/5 border border-[#ccff00]/10 p-5 rounded-2xl space-y-4">
                    <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldAlert size={12} /> Booking Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block">Target Date</span>
                        <div className="text-white font-bold mt-1 flex items-center gap-1">
                          <Calendar size={12} className="text-[#ccff00]" /> {selectedMessage.date || 'Not specified'}
                        </div>
                      </div>

                      {selectedMessage.eventDetails && (
                        <div>
                          <span className="text-[8px] text-slate-500 uppercase block">Event details</span>
                          <div className="text-white font-bold mt-1 flex items-center gap-1">
                            <MapPin size={12} className="text-[#ccff00]" /> {selectedMessage.eventDetails}
                          </div>
                        </div>
                      )}

                      {selectedMessage.runners && (
                        <div>
                          <span className="text-[8px] text-slate-500 uppercase block">Runners Count</span>
                          <div className="text-white font-bold mt-1 flex items-center gap-1">
                            <Users size={12} className="text-[#ccff00]" /> {selectedMessage.runners}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message text body */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block font-mono">Message Narrative</span>
                  <div className="p-6 bg-zinc-950/40 rounded-2xl border border-white/5 text-sm text-slate-300 leading-relaxed white-space-pre-wrap whitespace-pre-wrap select-all">
                    {selectedMessage.message}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-24 text-center text-slate-600 font-mono uppercase tracking-widest text-xs">
                Select an inquiry from the list.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
