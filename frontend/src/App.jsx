import { useState, useEffect, useCallback, useRef } from 'react'
import { getState, getHistory, addLight, removeLight, setMode, setBrightness, serviceLight, setSpeed } from './api.js'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import EnergyPanel from './components/EnergyPanel.jsx'
import StreetLightMap from './components/StreetLightMap.jsx'
import SavingsRing from './components/SavingsRing.jsx'
import SystemLog from './components/SystemLog.jsx'
import AmbientBackground from './components/AmbientBackground.jsx'

function App() {
  const [state, setState] = useState(null)
  const [history, setHistory] = useState([])
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState([])
  const logIdRef = useRef(0)

  const addLog = useCallback((message, type = 'info') => {
    logIdRef.current += 1
    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    setLogs(prev => [{ id: logIdRef.current, message, type, timestamp }, ...prev].slice(0, 50))
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [newState, newHistory] = await Promise.all([getState(), getHistory()])
      setState(newState)
      setHistory(newHistory)
      setConnected(true)
    } catch (err) {
      setConnected(false)
      console.error('Fetch error:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Detect state changes for logging
  const prevLightsRef = useRef({})
  useEffect(() => {
    if (!state) return
    state.lights.forEach(light => {
      const prev = prevLightsRef.current[light.id]
      if (prev) {
        if (prev.status !== light.status) {
          addLog(`${light.location}: ${prev.status} → ${light.status}`, 'info')
        }
        if (prev.mode !== light.mode) {
          addLog(`${light.location}: Mode changed to ${light.mode}`, 'mode')
        }
        if (!prev.operational && light.operational) {
          addLog(`${light.location}: Service restored — operational`, 'success')
        }
        if (prev.operational && !light.operational) {
          addLog(`${light.location}: FAULT DETECTED — maintenance required`, 'error')
        }
      }
      prevLightsRef.current[light.id] = light
    })
  }, [state, addLog])

  const handleAddLight = async (location) => {
    try {
      await addLight(location)
      addLog(`Added new node: ${location}`, 'success')
    } catch (err) {
      addLog(`Failed to add node: ${err.message}`, 'error')
    }
  }

  const handleRemoveLight = async (id) => {
    try {
      await removeLight(id)
      const light = state?.lights.find(l => l.id === id)
      addLog(`Removed node: ${light?.location || id}`, 'warning')
    } catch (err) {
      addLog(`Failed to remove node: ${err.message}`, 'error')
    }
  }

  const handleModeChange = async (id, mode) => {
    try {
      await setMode(id, mode)
      const light = state?.lights.find(l => l.id === id)
      addLog(`${light?.location || id}: Mode set to ${mode}`, 'mode')
    } catch (err) {
      addLog(`Failed to set mode: ${err.message}`, 'error')
    }
  }

  const handleBrightnessChange = async (id, brightness) => {
    try {
      await setBrightness(id, brightness)
    } catch (err) {
      addLog(`Failed to set brightness: ${err.message}`, 'error')
    }
  }

  const handleService = async (id) => {
    try {
      await serviceLight(id)
      const light = state?.lights.find(l => l.id === id)
      addLog(`${light?.location || id}: Serviced — health restored to 100%`, 'service')
    } catch (err) {
      addLog(`Failed to service: ${err.message}`, 'error')
    }
  }

  const handleSpeedChange = async (minutes) => {
    try {
      await setSpeed(minutes)
      addLog(`Simulation speed: ${minutes}x`, 'info')
    } catch (err) {
      addLog(`Failed to set speed: ${err.message}`, 'error')
    }
  }

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-2 border-slate-700 border-t-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-mono">Connecting to Night Grid...</p>
        </div>
      </div>
    )
  }

  const stats = {
    active: state.lights.filter(l => l.status === 'NIGHT_ACTIVE').length,
    idle: state.lights.filter(l => l.status === 'NIGHT_IDLE').length,
    eco: state.lights.filter(l => l.mode === 'ECO').length,
    faulty: state.lights.filter(l => !l.operational).length,
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <AmbientBackground weather={state.weather} />
      
      <Header
        clock={state.clock}
        dayCount={state.day_count}
        isDay={state.is_day}
        weather={state.weather}
        temperature={state.temperature}
        minutesPerTick={state.minutes_per_tick}
        onSpeedChange={handleSpeedChange}
        connected={connected}
        stats={stats}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — Dashboard */}
          <div className="lg:col-span-1">
            <Dashboard
              lights={state.lights}
              onAdd={handleAddLight}
              onRemove={handleRemoveLight}
              onModeChange={handleModeChange}
              onBrightnessChange={handleBrightnessChange}
              onService={handleService}
            />
          </div>

          {/* Center column — Map & Energy */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <StreetLightMap
                  lights={state.lights}
                  isDay={state.is_day}
                  weather={state.weather}
                />
              </div>
              <div className="md:col-span-1">
                <SavingsRing
                  savings={state.energy.savings_vs_baseline}
                  ecoSavings={state.energy.savings_vs_eco}
                />
              </div>
            </div>

            <EnergyPanel energy={state.energy} history={history} />

            <SystemLog logs={logs} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App