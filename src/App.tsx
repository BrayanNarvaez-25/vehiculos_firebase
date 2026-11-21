import { useState } from 'react'
import './App.css'
import {
  consulta1,
  consulta2,
  consulta3,
  consulta4,
  type Vehiculo,
} from './services/vehiculoService'
import VehiculoListaPaginada from './components/VehiculoListaPaginada'

const consultas = [
  { titulo: 'Consulta 1: stock > 0, precio ASC', ejecutar: consulta1 },
  { titulo: 'Consulta 2: SUV, stock > 0, precio ASC', ejecutar: consulta2 },
  { titulo: 'Consulta 3: precio 20000-40000, stock > 0', ejecutar: consulta3 },
  { titulo: 'Consulta 4: Sedan, año >= 2023, año DESC', ejecutar: consulta4 },
]

function App() {
  const [titulo, setTitulo] = useState('')
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleConsultar = async (t: string, ejecutar: () => Promise<Vehiculo[]>) => {
    setTitulo(t)
    setError('')
    setVehiculos([])
    setCargando(true)
    try {
      setVehiculos(await ejecutar())
    } catch (e) {
      // If an index is missing, the message contains the link to create it
      setError((e as Error).message)
    } finally {
      setCargando(false)
    }
  }

  const enlace = error.match(/https?:\/\/\S+/)?.[0].replace(/[.,]$/, '')

  return (
    <div>
      <VehiculoListaPaginada />
      <h1>Consulta de vehículos</h1>
      <div>
        {consultas.map((c) => (
          <button key={c.titulo} onClick={() => handleConsultar(c.titulo, c.ejecutar)}>
            {c.titulo}
          </button>
        ))}
      </div>

      {titulo && <h2>{titulo}</h2>}
      {cargando && <p>Consultando...</p>}
      {error && (
        <p className="error">
          {error.split(/https?:\/\/\S+/)[0]}
          {enlace && (
            <a href={enlace} target="_blank" rel="noreferrer">
              Crear índice en Firebase Console
            </a>
          )}
        </p>
      )}
      {titulo && !cargando && !error && <p>Resultados: {vehiculos.length}</p>}

      {vehiculos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Tipo</th>
              <th>Año</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.tipo}</td>
                <td>{v.anio}</td>
                <td>${v.precio.toLocaleString()}</td>
                <td>{v.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
