import { useState } from 'react'
import { COMBUSTIBLES, MARCAS, TIPOS, type Patron } from '../services/inventarioService'

interface Props {
  onConsultar: (patron: Patron) => void
  onBuscarPorId: (id: string) => void
  deshabilitado: boolean
}

const PATRONES: { valor: Patron['tipo']; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todo el inventario (por marca)' },
  { valor: 'marca', etiqueta: 'Por marca' },
  { valor: 'disponibles', etiqueta: 'Solo disponibles' },
  { valor: 'rangoPrecio', etiqueta: 'Rango de precios' },
  { valor: 'carroceria', etiqueta: 'Por tipo de carrocería' },
  { valor: 'combustible', etiqueta: 'Disponibles por combustible' },
]

export const PanelFiltros = ({ onConsultar, onBuscarPorId, deshabilitado }: Props) => {
  const [patron, setPatron] = useState<Patron['tipo']>('todos')
  const [marca, setMarca] = useState(MARCAS[0])
  const [carroceria, setCarroceria] = useState(TIPOS[0])
  const [combustible, setCombustible] = useState(COMBUSTIBLES[0])
  const [min, setMin] = useState('20000')
  const [max, setMax] = useState('40000')
  const [id, setId] = useState('')

  const handleConsultar = () => {
    switch (patron) {
      case 'marca':
        return onConsultar({ tipo: patron, marca })
      case 'carroceria':
        return onConsultar({ tipo: patron, carroceria })
      case 'combustible':
        return onConsultar({ tipo: patron, combustible })
      case 'rangoPrecio':
        return onConsultar({ tipo: patron, min: Number(min), max: Number(max) })
      default:
        return onConsultar({ tipo: patron })
    }
  }

  return (
    <section className="panel">
      <h2>Filtros</h2>
      <div className="controles">
        <label>
          Consulta
          <select value={patron} onChange={(e) => setPatron(e.target.value as Patron['tipo'])}>
            {PATRONES.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.etiqueta}
              </option>
            ))}
          </select>
        </label>

        {patron === 'marca' && (
          <label>
            Marca
            <select value={marca} onChange={(e) => setMarca(e.target.value)}>
              {MARCAS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
        )}

        {patron === 'carroceria' && (
          <label>
            Tipo
            <select value={carroceria} onChange={(e) => setCarroceria(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        )}

        {patron === 'combustible' && (
          <label>
            Combustible
            <select value={combustible} onChange={(e) => setCombustible(e.target.value)}>
              {COMBUSTIBLES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        )}

        {patron === 'rangoPrecio' && (
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
            placeholder="VEH001"
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
