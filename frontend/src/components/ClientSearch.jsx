import { useState, useEffect, useRef } from 'react'
import adminService from '../services/adminService'
import counselorService from '../services/counselorService'

export default function ClientSearch({ onSelect, selectedClient, counselorId }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  // Cerrar dropdown al clickear afuera
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!search || search.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        let data
        if (counselorId) {
          // Counselor busca entre sus propios clientes
          data = await counselorService.getClients(counselorId, search)
        } else {
          // Admin busca entre todos los clientes
          data = await adminService.getClients(search)
        }
        setResults(data.clients || [])
        setOpen(true)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, 300)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleSelect = (client) => {
    onSelect(client)
    setSearch(`${client.firstName} ${client.lastName}`)
    setOpen(false)
  }

  const handleClear = () => {
    onSelect(null)
    setSearch('')
    setResults([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscá por nombre o email..."
          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm pr-10"
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
          >
            ×
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-lg mt-1 p-3 text-sm text-stone-400 z-10">
          Buscando...
        </div>
      )}

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
          {results.map((client) => (
            <button
              key={client._id}
              onClick={() => handleSelect(client)}
              className="w-full text-left px-4 py-2.5 hover:bg-orange-50 transition-colors border-b border-stone-50 last:border-0"
            >
              <div className="font-medium text-stone-700 text-sm">
                {client.firstName} {client.lastName}
              </div>
              <div className="text-xs text-stone-400">{client.email}</div>
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && search.length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-lg mt-1 p-3 text-sm text-stone-400 z-10">
          No se encontraron clientes.
        </div>
      )}

      {selectedClient && (
        <div className="mt-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-stone-700">
              {selectedClient.firstName} {selectedClient.lastName}
            </span>
            <span className="text-xs text-stone-400 ml-2">{selectedClient.email}</span>
          </div>
          <button onClick={handleClear} className="text-stone-300 hover:text-red-400 text-lg">×</button>
        </div>
      )}
    </div>
  )
}