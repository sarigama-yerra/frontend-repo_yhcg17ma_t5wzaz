import { useEffect, useMemo, useState } from 'react'
import { Upload, Plus, Map, Timer, Languages } from 'lucide-react'
import FullscreenWrapper from './FullscreenWrapper'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ETAList({ etas }) {
  if (!etas || etas.length === 0) return <p className="text-white/70">Nessuna stima disponibile.</p>
  return (
    <ol className="space-y-2">
      {etas.map((e, i) => (
        <li key={i} className="flex justify-between items-center text-white/90">
          <span className="font-medium">{e.name}</span>
          <span className="text-cyan-300 font-mono">{e.eta}</span>
        </li>
      ))}
    </ol>
  )
}

export default function BusManager() {
  const [lines, setLines] = useState([])
  const [name, setName] = useState('Linea A')
  const [language, setLanguage] = useState('it')
  const [stops, setStops] = useState([{ name: 'Capolinea', travel_minutes_from_prev: 0 }])
  const [selected, setSelected] = useState(null)
  const [etas, setEtas] = useState([])
  const [startTime, setStartTime] = useState('')
  const [note, setNote] = useState('')

  const totalMinutes = useMemo(() => stops.reduce((a, s) => a + Number(s.travel_minutes_from_prev || 0), 0), [stops])

  const fetchLines = async () => {
    const res = await fetch(`${BACKEND}/api/bus/lines`)
    const data = await res.json()
    setLines(data)
  }

  useEffect(() => { fetchLines() }, [])

  const addStop = () => setStops([...stops, { name: `Fermata ${stops.length+1}`, travel_minutes_from_prev: 5 }])

  const createLine = async () => {
    const payload = { name, language, stops }
    const r = await fetch(`${BACKEND}/api/bus/lines`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!r.ok) return alert('Errore nella creazione linea')
    await fetchLines()
  }

  const computeEta = async (id) => {
    const q = startTime ? `?start_time=${encodeURIComponent(startTime)}` : ''
    const r = await fetch(`${BACKEND}/api/bus/lines/${id}/eta${q}`)
    const data = await r.json()
    setEtas(data.etas || [])
  }

  const onUploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const r = await fetch(`${BACKEND}/api/bus/parse-image`, { method: 'POST', body: form })
    const data = await r.json()
    if (data.note) setNote(data.note)
    if (Array.isArray(data.stops) && data.stops.length) {
      setStops(data.stops)
    } else {
      alert('Non sono riuscito a estrarre gli orari automaticamente. Puoi inserire manualmente o fornire una chiave OCR.')
    }
  }

  return (
    <FullscreenWrapper>
      <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-900 rounded-2xl border border-white/10">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2"><Map size={20}/> Gestione linee</h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="col-span-1 bg-slate-800 text-white rounded px-3 py-2 outline-none border border-white/10" value={name} onChange={e=>setName(e.target.value)} placeholder="Nome linea"/>
            <div className="col-span-1 flex items-center gap-2 bg-slate-800 text-white rounded px-3 py-2 border border-white/10">
              <Languages size={16} />
              <select className="bg-transparent outline-none flex-1" value={language} onChange={e=>setLanguage(e.target.value)}>
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/90 font-medium">Fermate</h3>
              <button onClick={addStop} className="inline-flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded"><Plus size={16}/> Aggiungi</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {stops.map((s, i) => (
                <div key={i} className="grid grid-cols-7 gap-2 items-center">
                  <span className="text-white/70 text-sm col-span-1">{i+1}.</span>
                  <input className="col-span-4 bg-slate-900/70 text-white rounded px-2 py-1 border border-white/10" value={s.name} onChange={e=>{
                    const copy=[...stops]; copy[i]={...copy[i], name:e.target.value}; setStops(copy)
                  }} />
                  <input type="number" min="0" className="col-span-2 bg-slate-900/70 text-white rounded px-2 py-1 border border-white/10" value={s.travel_minutes_from_prev}
                    onChange={e=>{const copy=[...stops]; copy[i]={...copy[i], travel_minutes_from_prev:Number(e.target.value)}; setStops(copy)}}/>
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-white/70 text-sm">Totale: {totalMinutes} min</div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-white/80 text-sm">
              <Timer size={16}/> Ora di partenza
              <input type="time" className="bg-slate-800 text-white rounded px-2 py-1 border border-white/10" value={startTime} onChange={e=>setStartTime(e.target.value)} />
            </label>
            <label className="inline-flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <Upload size={16}/> <span>Carica immagine orari</span>
              <input type="file" accept="image/*" className="hidden" onChange={onUploadImage} />
            </label>
          </div>

          {note && <p className="text-yellow-300/80 text-sm">{note}</p>}

          <button onClick={createLine} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded">Salva linea</button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2"><Map size={20}/> Linee esistenti</h2>
          <div className="grid gap-3 max-h-64 overflow-auto">
            {lines.map((l) => (
              <div key={l.id} className={`p-3 rounded-lg border ${selected?.id===l.id?'border-cyan-400 bg-cyan-400/10':'border-white/10 bg-white/5'} text-white flex items-center justify-between`}
                onClick={()=>{setSelected(l); setEtas([])}}>
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-white/70">{(l.stops||[]).length} fermate</div>
                </div>
                <button onClick={(e)=>{e.stopPropagation(); computeEta(l.id)}} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-sm">Calcola ETA</button>
              </div>
            ))}
            {lines.length===0 && <p className="text-white/70">Nessuna linea salvata.</p>}
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-white/10">
            <h3 className="text-white/90 font-medium mb-2">Stime arrivo</h3>
            <ETAList etas={etas} />
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  )
}
