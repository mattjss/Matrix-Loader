"use client"

import { useEffect, useState } from "react"

const MONO = '"JetBrains Mono","Fira Code",ui-monospace,"Courier New",monospace'

const COLOR: Record<string, string> = {
  cmd:   'rgba(255,255,255,0.92)',
  data:  'rgba(255,255,255,0.38)',
  step:  'rgba(255,255,255,0.62)',
  ok:    'rgba(255,255,255,0.88)',
  blank: 'transparent',
}

// ── Animated ASCII mark: 3-bar equalizer ────────────────────────────────────
// Each bar cycles through heights 0–5 at a different phase offset,
// creating a flowing left-to-right wave.
const CYCLE  = [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0] // 12-step sine
const PHASES = [0, 4, 8]                               // bar phase offsets
const MARK_ROWS = 5

function AsciiMark({ frame }: { frame: number }) {
  const heights = PHASES.map(p => CYCLE[(frame + p) % CYCLE.length])

  return (
    <div style={{
      fontFamily: MONO,
      fontSize: 13,
      lineHeight: 2,
      userSelect: 'none',
      flexShrink: 0,
      letterSpacing: 0,
    }}>
      {Array.from({ length: MARK_ROWS }, (_, row) => {
        const threshold = MARK_ROWS - row
        const chars = heights.map(h => h >= threshold ? '█' : '░')
        return (
          <div key={row}>
            {chars.map((char, b) => (
              <span
                key={b}
                style={{
                  color: char === '█'
                    ? 'rgba(255,255,255,0.72)'
                    : 'rgba(255,255,255,0.07)',
                  marginRight: b < 2 ? '0.3em' : 0,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// ── Sequence ─────────────────────────────────────────────────────────────────
type LineType = 'cmd' | 'data' | 'step' | 'ok' | 'blank'

interface SeqEntry {
  text:  string
  type:  LineType
  delay: number   // ms to hold after line finishes typing
}

const SEQUENCE: SeqEntry[] = [
  // ── boot ──────────────────────────────────────────────────────────────────
  { text: '> agent.boot()',                              type: 'cmd',   delay: 320 },
  { text: '  runtime    v2025.05-stable',               type: 'data',  delay: 80  },
  { text: '  model      claude-opus-4',                 type: 'data',  delay: 80  },
  { text: '  tools      browser · code · memory',       type: 'data',  delay: 80  },
  { text: '  context    200k tokens · 0 loaded',        type: 'data',  delay: 500 },
  { text: '',                                            type: 'blank', delay: 140 },
  // ── analyze ───────────────────────────────────────────────────────────────
  { text: '> task.analyze()',                            type: 'cmd',   delay: 280 },
  { text: '  class      reasoning + synthesis',         type: 'data',  delay: 80  },
  { text: '  depth      multi-step · planning req.',    type: 'data',  delay: 80  },
  { text: '  queue      4-step plan compiled',          type: 'data',  delay: 500 },
  { text: '',                                            type: 'blank', delay: 140 },
  // ── context ───────────────────────────────────────────────────────────────
  { text: '> context.build()',                          type: 'cmd',   delay: 280 },
  { text: '  recall     k=4 · min_dist=0.028',         type: 'data',  delay: 110 },
  { text: '  inject     3 chunks · 4,218 tok',         type: 'data',  delay: 110 },
  { text: '  augment    web_search queued → step 2',   type: 'data',  delay: 500 },
  { text: '',                                            type: 'blank', delay: 140 },
  // ── execute ───────────────────────────────────────────────────────────────
  { text: '> plan.execute()',                            type: 'cmd',   delay: 280 },
  { text: '  1/4  ◆  decompose + scope    ✓  12ms',   type: 'step',  delay: 400 },
  { text: '  2/4  ◆  retrieve + augment   ✓  890ms',  type: 'step',  delay: 480 },
  { text: '  3/4  ◆  synthesize           ✓  2.1s',   type: 'step',  delay: 560 },
  { text: '  4/4  ◆  verify + polish      ✓  340ms',  type: 'step',  delay: 420 },
  { text: '',                                            type: 'blank', delay: 140 },
  // ── done ──────────────────────────────────────────────────────────────────
  { text: '> session.end()',                             type: 'cmd',   delay: 200 },
  { text: '  in         2,841 tok · cache 68%',        type: 'data',  delay: 80  },
  { text: '  out        1,047 tok · $0.0012',          type: 'data',  delay: 80  },
  { text: '  latency    3.6s end-to-end',              type: 'data',  delay: 80  },
  { text: '  status     ■ delivered',                   type: 'ok',    delay: 3400 },
]

type DoneLine = { text: string; type: LineType }

// ── Component ────────────────────────────────────────────────────────────────
export function MatrixLoader() {
  const [done,    setDone]    = useState<DoneLine[]>([])
  const [typing,  setTyping]  = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [blink,   setBlink]   = useState(true)
  const [frame,   setFrame]   = useState(0)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(id)
  }, [])

  // ASCII mark tick — independent of typing
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 120)
    return () => clearInterval(id)
  }, [])

  // Typing engine
  useEffect(() => {
    if (lineIdx >= SEQUENCE.length) {
      const t = setTimeout(() => {
        setDone([])
        setTyping('')
        setLineIdx(0)
      }, 2400)
      return () => clearTimeout(t)
    }

    const entry = SEQUENCE[lineIdx]

    if (entry.type === 'blank') {
      setDone(prev => [...prev, { text: '', type: 'blank' }])
      setTyping('')
      const t = setTimeout(() => setLineIdx(i => i + 1), entry.delay)
      return () => clearTimeout(t)
    }

    const tids: ReturnType<typeof setTimeout>[] = []
    let ci = 0

    function tick() {
      const jitter = 15 + Math.random() * 15
      const t = setTimeout(() => {
        ci++
        setTyping(entry.text.slice(0, ci))
        if (ci < entry.text.length) {
          tick()
        } else {
          const doneT = setTimeout(() => {
            setDone(prev => [...prev, { text: entry.text, type: entry.type }])
            setTyping('')
            setLineIdx(i => i + 1)
          }, entry.delay)
          tids.push(doneT)
        }
      }, jitter)
      tids.push(t)
    }
    tick()
    return () => tids.forEach(clearTimeout)
  }, [lineIdx])

  const currentType = lineIdx < SEQUENCE.length ? SEQUENCE[lineIdx].type : 'data'
  const showCursor  = lineIdx < SEQUENCE.length && SEQUENCE[lineIdx].type !== 'blank'

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

      {/* Left: animated ASCII mark */}
      <AsciiMark frame={frame} />

      {/* Right: terminal output */}
      <div style={{
        fontFamily:    MONO,
        fontSize:      13,
        lineHeight:    2,
        letterSpacing: '0.01em',
        userSelect:    'none',
        minWidth:      0,
      }}>
        {done.map((line, i) => (
          <div
            key={i}
            style={{
              color:     COLOR[line.type] ?? COLOR.data,
              minHeight: '1.5em',
            }}
          >
            {line.text || ' '}
          </div>
        ))}

        {showCursor && (
          <div style={{ color: COLOR[currentType] ?? COLOR.data }}>
            {typing}
            <span style={{
              display:       'inline-block',
              width:         '0.55em',
              height:        '1em',
              verticalAlign: 'text-bottom',
              background:    'rgba(255,255,255,0.72)',
              opacity:       blink ? 0.85 : 0,
              transition:    'opacity 0.05s',
              marginLeft:    '1px',
            }} />
          </div>
        )}
      </div>
    </div>
  )
}
