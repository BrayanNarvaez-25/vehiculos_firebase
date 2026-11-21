import { useEffect, useState } from 'react'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import {
  obtenerVehiculosPaginados,
  TAMANO_PAGINA,
  type Vehiculo,
} from '../services/vehiculoService'

type Cursor = QueryDocumentSnapshot<DocumentData>

export const VehiculoListaPaginada = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [pagina, setPagina] = useState(1)
  // cursores[i] = last document of page i + 1; used as startAfter for the next page
  const [cursores, setCursores] = useState<Cursor[]>([])
  const [hayMas, setHayMas] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cargarPagina = async (numero: number, cursoresActuales: Cursor[]) => {
    setCargando(true)
    setError('')
    try {
      // Page N starts after the last document of page N - 1
      const cursor = numero > 1 ? cursoresActuales[numero - 2] : undefined
      const resultado = await obtenerVehiculosPaginados(cursor)

      const nuevos = [...cursoresActuales]
      if (resultado.ultimoDocumento) nuevos[numero - 1] = resultado.ultimoDocumento

      setVehiculos(resultado.vehiculos)
      setCursores(nuevos)
      setPagina(numero)
      setHayMas(resultado.vehiculos.length === TAMANO_PAGINA)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    // Initial load: page 1 (first 10 documents only)
    obtenerVehiculosPaginados()
      .then((r) => {
        setVehiculos(r.vehiculos)
        setCursores(r.ultimoDocumento ? [r.ultimoDocumento] : [])
        setHayMas(r.vehiculos.length === TAMANO_PAGINA)
      })
      .catch((e) => setError((e as Error).message))
  }, [])

  return (
    <div>
      <h2>Lista de vehículos paginada</h2>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Año</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v, i) => (
            <tr key={v.id}>
              <td>{(pagina - 1) * TAMANO_PAGINA + i + 1}</td>
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

      <div>
        <button onClick={() => cargarPagina(pagina - 1, cursores)} disabled={pagina === 1 || cargando}>
          Anterior
        </button>
        <span>Página {pagina}</span>
        <button onClick={() => cargarPagina(pagina + 1, cursores)} disabled={!hayMas || cargando}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default VehiculoListaPaginada
