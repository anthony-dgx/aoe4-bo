import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BuildOrder, AppSettings } from '../../../shared/types'

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-3">
      {children}
    </h4>
  )
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  note,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  note?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/50 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8a84b]/50 transition-colors"
      />
      {note && <p className="text-white/30 text-xs leading-snug">{note}</p>}
    </div>
  )
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const [profileId, setProfileId] = useState('')
  const [claudeApiKey, setClaudeApiKey] = useState('')
  const [resolvedName, setResolvedName] = useState<string | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [builds, setBuilds] = useState<BuildOrder[]>([])
  const [hotkeys, setHotkeys] = useState<AppSettings['hotkeys'] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    async function load() {
      try {
        const settings: AppSettings = await window.electronAPI.settings.getAll()
        setProfileId(settings.profileId ?? '')
        setClaudeApiKey(settings.claudeApiKey ?? '')
        setHotkeys(settings.hotkeys ?? null)
        if (settings.playerName) setResolvedName(settings.playerName)
      } catch {
        // ignore
      }
      try {
        const allBuilds: BuildOrder[] = await window.electronAPI.builds.list()
        setBuilds(allBuilds)
      } catch {
        // ignore
      }
    }
    load()
  }, [open])

  async function handleLookup() {
    if (!profileId.trim()) return
    setLookingUp(true)
    setLookupError(null)
    setResolvedName(null)
    try {
      const result = await window.electronAPI.settings.lookupProfile(profileId.trim())
      if (result?.name) {
        setResolvedName(result.name)
      } else {
        setLookupError('Profile not found')
      }
    } catch (err) {
      setLookupError('Lookup failed')
    } finally {
      setLookingUp(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await window.electronAPI.settings.set('profileId', profileId)
      await window.electronAPI.settings.set('claudeApiKey', claudeApiKey)
      if (resolvedName) {
        await window.electronAPI.settings.set('playerName', resolvedName)
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 1500)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteBuild(id: string) {
    try {
      await window.electronAPI.builds.delete(id)
      setBuilds((prev) => prev.filter((b) => b.id !== id))
    } catch {
      // ignore
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-[360px] bg-[#111111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-base font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
              {/* Profile */}
              <section>
                <SectionTitle>Profile</SectionTitle>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 font-medium">AoE4 Profile ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profileId}
                        onChange={(e) => setProfileId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                        placeholder="e.g. 12345678"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8a84b]/50 transition-colors"
                      />
                      <button
                        onClick={handleLookup}
                        disabled={lookingUp || !profileId.trim()}
                        className="px-3 py-2 bg-[#c8a84b]/20 border border-[#c8a84b]/40 rounded-lg text-[#c8a84b] text-sm font-medium hover:bg-[#c8a84b]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {lookingUp ? '…' : 'Lookup'}
                      </button>
                    </div>
                    {resolvedName && (
                      <p className="text-green-400 text-xs flex items-center gap-1.5">
                        <span>✓</span>
                        <span>{resolvedName}</span>
                      </p>
                    )}
                    {lookupError && (
                      <p className="text-red-400 text-xs">{lookupError}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Claude API Key */}
              <section>
                <SectionTitle>AI Tips</SectionTitle>
                <InputField
                  label="Claude API Key"
                  type="password"
                  value={claudeApiKey}
                  onChange={setClaudeApiKey}
                  placeholder="sk-ant-…"
                  note="Stored in plain text in your app config. Keep it private."
                />
              </section>

              {/* Hotkeys */}
              {hotkeys && (
                <section>
                  <SectionTitle>Hotkeys</SectionTitle>
                  <div className="flex flex-col gap-2">
                    {(
                      [
                        ['Toggle Overlay', hotkeys.toggleOverlay],
                        ['Next Step', hotkeys.nextStep],
                        ['Prev Step', hotkeys.prevStep],
                        ['Show Pregame', hotkeys.showPregame],
                      ] as [string, string][]
                    ).map(([label, key]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-white/50">{label}</span>
                        <kbd className="px-2 py-1 bg-white/8 border border-white/15 rounded text-xs text-white/60 font-mono">
                          {key}
                        </kbd>
                      </div>
                    ))}
                    <p className="text-white/25 text-xs mt-1">
                      Hotkey configuration coming in a future update.
                    </p>
                  </div>
                </section>
              )}

              {/* Build Management */}
              <section>
                <SectionTitle>Saved Builds ({builds.length})</SectionTitle>
                {builds.length === 0 ? (
                  <p className="text-white/30 text-sm">No builds saved yet.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {builds.map((build) => (
                      <div
                        key={build.id}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 truncate">{build.title}</p>
                          <p className="text-xs text-white/35">{build.civ} · {build.author}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteBuild(build.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm flex-shrink-0"
                          title="Delete build"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 bg-[#c8a84b] text-black rounded-lg text-sm font-semibold hover:bg-[#e8c96b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving…' : saveSuccess ? '✓ Saved' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
