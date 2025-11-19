import { useState } from 'react'
import AtomSimulator from './components/AtomSimulator'
import BusManager from './components/BusManager'
import Header from './components/Header'

function App() {
  const [active, setActive] = useState('atom')
  const [language, setLanguage] = useState('it')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Header active={active} onSwitch={setActive} language={language} setLanguage={setLanguage} />
        {active === 'atom' ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Simulazione Atomo</h1>
            <p className="text-white/70">Visualizzazione 2D con orbite, elettroni e controllo velocità. Usa il pulsante Fullscreen per immergerti.</p>
            <AtomSimulator />
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Dispositivo Bus</h1>
            <p className="text-white/70">Crea linee, carica un'immagine con fermate/orari per l'estrazione automatica e calcola gli arrivi stimati.</p>
            <BusManager />
          </div>
        )}
      </div>
    </div>
  )
}

export default App