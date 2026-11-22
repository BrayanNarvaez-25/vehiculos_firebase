import { useState } from 'react'
import { GENEROS, PLATAFORMAS, type Patron } from '../services/videojuegoService'

interface Props {
  onConsultar: (patron: Patron) => void
  onBuscarPorId: (id: string) => void
  deshabilitado: boolean
}

const TIPOS: { valor: Patron['tipo']; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todos los videojuegos (A-Z)' },
  { valor: 'plataforma', etiqueta: 'Por plataforma' },
  { valor: 'disponibles', etiqueta: 'Solo disponibles' },
  { valor: 'rangoPrecio', etiqueta: 'Rango de precios' },
  { valor: 'genero', etiqueta: 'Por género (mejor calificados)' },
  { valor: 'multijugador', etiqueta: 'Multijugador disponibles' },
]

export const PanelFiltros = ({ onConsultar, onBuscarPorId, deshabilitado }: Props) => {
  const [tipo, setTipo] = useState<Patron['tipo']>('todos')
  const [plataforma, setPlataforma] = useState(PLATAFORMAS[0])
  const [genero, setGenero] = useState(GENEROS[0])
  const [min, setMin] = useState('20')
  const [max, setMax] = useState('40')
  const [id, setId] = useState('')

  const handleConsultar = () => {
    switch (tipo) {
      case 'plataforma':
        return onConsultar({ tipo, plataforma })
      case 'genero':
        return onConsultar({ tipo, genero })
      case 'rangoPrecio':
        return onConsultar({ tipo, min: Number(min), max: Number(max) })
      default:
        return onConsultar({ tipo })
    }
  }

  return (
    <section className="panel">
      <h2>Filtros</h2>
      <div className="controles">
        <label>
          Consulta
          <select value={tipo} onChange={(e) => setTipo(e.target.value as Patron['tipo'])}>
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.etiqueta}
              </option>
            ))}
          </select>
        </label>

        {tipo === 'plataforma' && (
          <label>
            Plataforma
            <select value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
              {PLATAFORMAS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        )}

        {tipo === 'genero' && (
          <label>
            Género
            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              {GENEROS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        )}

        {tipo === 'rangoPrecio' && (
          <>
            <label>
              Precio mínimo
              <input type="number" min="0" value={min} onChange={(e) => setMin(e.target.value)} />
            </label>
            <label>
              Precio máximo
              <input type="number" min="0" value={max} onChange={(e) => setMax(e.target.value)} />
            </label>
          </>
        )}

        <button onClick={handleConsultar} disabled={deshabilitado}>
          Consultar
        </button>
      </div>

      <div className="controles">
        <label>
          Buscar por ID
          <input
            type="text"
            placeholder="VJ001"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </label>
        <button
          onClick={() => onBuscarPorId(id.trim().toUpperCase())}
          disabled={deshabilitado || !id.trim()}
        >
          Buscar
        </button>
      </div>
    </section>
  )
}

export default PanelFiltros
