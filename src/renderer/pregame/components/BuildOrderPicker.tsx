import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BuildOrder } from '../../../shared/types'

interface BuildOrderPickerProps {
  builds: BuildOrder[]
  myCiv: string
  selectedId: string | null
  onSelect: (id: string) => void
  onImport: (url: string) => Promise<void>
  importing: boolean
  importError: string | null
}

function CivBadge({ civ }: { civ: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white/60 border border-white/10 uppercase tracking-wide">
      {civ}
    </span>
  )
}

export function BuildOrderPicker({
  builds,
  myCiv,
  selectedId,
  onSelect,
  onImport,
  importing,
  importError,
}: BuildOrderPickerProps) {
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const civLower = myCiv.toLowerCase()
  const matchingBuilds = builds.filter((b) => b.civ.toLowerCase() === civLower)
  const otherBuilds = builds.filter((b) => b.civ.toLowerCase() !== civLower)
  const sortedBuilds = [...matchingBuilds, ...otherBuilds]

  async function handleImport() {
    if (!url.trim()) return
    await onImport(url.trim())
    setUrl('')
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text.trim())
      inputRef.current?.focus()
    } catch {
      // clipboard access may fail
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40">Build Orders</h3>
        <span className="text-xs text-white/30">{builds.length} saved</span>
      </div>

      {sortedBuilds.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-white/40 text-sm">No build orders saved yet.</p>
          <p className="text-white/25 text-xs mt-1">Import one below to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
          {sortedBuilds.map((build) => {
            const isMatch = build.civ.toLowerCase() === civLower
            const isSelected = build.id === selectedId
            return (
              <motion.button
                key={build.id}
                onClick={() => onSelect(build.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={[
                  'flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border transition-colors',
                  isSelected
                    ? 'bg-[#c8a84b]/15 border-[#c8a84b]/50'
                    : isMatch
                    ? 'bg-white/7 border-white/15 hover:bg-white/10'
                    : 'bg-white/3 border-white/8 opacity-50 hover:opacity-75 hover:bg-white/5',
                ].join(' ')}
              >
                {/* Radio dot */}
                <div
                  className={[
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    isSelected ? 'border-[#c8a84b]' : 'border-white/25',
                  ].join(' ')}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#c8a84b]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-[#c8a84b]' : 'text-white/90'}`}>
                      {build.title}
                    </span>
                    {isMatch && !isSelected && (
                      <span className="text-[10px] text-green-400/70 font-medium">✓ your civ</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/40 text-xs">{build.author}</span>
                    <CivBadge civ={build.civ} />
                    <span className="text-white/25 text-[10px]">{build.season}</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* URL import */}
      <div className="mt-1 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImport()}
            placeholder="Paste build order URL…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8a84b]/50 focus:bg-white/8 transition-colors"
          />
          <button
            onClick={handlePaste}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors text-sm"
            title="Paste from clipboard"
          >
            📋
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !url.trim()}
            className="px-4 py-2 bg-[#c8a84b]/20 border border-[#c8a84b]/40 rounded-lg text-[#c8a84b] text-sm font-medium hover:bg-[#c8a84b]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {importing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#c8a84b]/40 border-t-[#c8a84b] rounded-full animate-spin" />
                Importing
              </span>
            ) : (
              'Import'
            )}
          </button>
        </div>

        <AnimatePresence>
          {importError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs px-1"
            >
              {importError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
