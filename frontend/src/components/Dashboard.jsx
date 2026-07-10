import { useState } from 'react'
import { Plus, SlidersHorizontal, Search, Filter } from 'lucide-react'
import LightCard from './LightCard.jsx'

export default function Dashboard({ lights, onAdd, onRemove, onModeChange, onBrightnessChange, onService, isDay }) {
  const [newLocation, setNewLocation] = useState('')
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const location = newLocation.trim()
    if (!location) return
    setAdding(true)
    try {
      await onAdd(location)
      setNewLocation('')
    } finally {
      setAdding(false)
    }
  }

  const filteredLights = lights.filter(light => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && light.status === 'NIGHT_ACTIVE') ||
      (filter === 'idle' && light.status === 'NIGHT_IDLE') ||
      (filter === 'day' && light.status === 'DAY')
    const matchesSearch = light.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filters = [
    { key: 'all', label: 'All', count: lights.length },
    { key: 'active', label: 'Active', count: lights.filter(l => l.status === 'NIGHT_ACTIVE').length },
    { key: 'idle', label: 'Idle', count: lights.filter(l => l.status === 'NIGHT_IDLE').length },
    { key: 'day', label: 'Day', count: lights.filter(l => l.status === 'DAY').length },
  ]

  return (
    <section className="glass-panel p-5 animate-slide-up">
      <div className="mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <SlidersHorizontal className="h-4 w-4 text-amber-400" />
            </div>
            <h2 className="text-base font-semibold text-slate-100">Network Nodes</h2>
          </div>
          <span className="text-xs font-mono rounded-full bg-slate-800 px-2.5 py-1 text-slate-400 border border-slate-700">
            {lights.length} nodes
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <form onSubmit={submit} className="relative">
          <input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add new node location..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3.5 py-2.5 pr-24 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={adding || !newLocation.trim()}
            className="absolute right-1.5 top-1.5 flex items-center gap-1.5 rounded-md bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-glow-sm"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Add
          </button>
        </form>

        <div className="flex gap-1 bg-slate-950/50 rounded-lg p-0.5 border border-slate-800/50">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all relative ${
                filter === f.key
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`ml-1 text-[10px] font-mono ${filter === f.key ? 'text-amber-400' : 'text-slate-600'}`}>
                  {f.count}
                </span>
              )}
              {filter === f.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
        {filteredLights.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 p-10 text-center">
            <Filter className="h-8 w-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {searchQuery ? 'No matching nodes found.' : 'No nodes in this network partition.'}
            </p>
          </div>
        ) : (
          filteredLights.map((light, i) => (
            <div key={light.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <LightCard
                light={light}
                onRemove={onRemove}
                onModeChange={onModeChange}
                onBrightnessChange={onBrightnessChange}
                onService={onService}
              />
            </div>
          ))
        )}
      </div>
    </section>
  )
}
