import { Atom, BusFront, Languages } from 'lucide-react'

export default function Header({ active, onSwitch, language, setLanguage }) {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur border-b border-white/10 rounded-xl">
      <div className="flex items-center gap-2 text-white">
        <img src="/flame-icon.svg" alt="logo" className="w-8 h-8"/>
        <span className="font-semibold">Science & Transit</span>
      </div>
      <nav className="flex items-center gap-2">
        <button onClick={()=>onSwitch('atom')} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${active==='atom'?'bg-indigo-600 text-white':'bg-white/10 text-white/80 hover:bg-white/20'}`}>
          <Atom size={16}/> Atomo
        </button>
        <button onClick={()=>onSwitch('bus')} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${active==='bus'?'bg-indigo-600 text-white':'bg-white/10 text-white/80 hover:bg-white/20'}`}>
          <BusFront size={16}/> Bus
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 text-white/80">
          <Languages size={16}/>
          <select className="bg-transparent outline-none" value={language} onChange={e=>setLanguage(e.target.value)}>
            <option value="it">IT</option>
            <option value="en">EN</option>
          </select>
        </div>
      </nav>
    </header>
  )
}
