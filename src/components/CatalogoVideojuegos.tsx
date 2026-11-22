import { useEffect, useState } from 'react'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import {
  consultarPagina,
  obtenerVideojuegoPorId,
  TAMANO_PAGINA,
  type Patron,
  type Videojuego,
} from '../services/videojuegoService'
import PanelFiltros from './PanelFiltros'

type Cursor = QueryDocumentSnapshot<DocumentData>

export const CatalogoVideojuegos = () => {
  const [patron, setPatron] = useState<Patron>({ tipo: 'todos' })
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([])
  const [pagina, setPagina] = useState(1)
  // cursores[i] = last document of page i + 1, used as startAfter for the next page
  const [cursores, setCursores] = useState<Cursor[]>([])
  const [hayMas, setHayMas] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [busquedaId, setBusquedaId] = useState<string | null>(null)

  const cargarPagina = async (p: Patron, numero: number, cursoresActuales: Cursor[]) => {
    setCargando(true)
    setError('')
    setBusquedaId(null)
    try {
      const cursor = numero > 1 ? cursoresActuales[numero - 2] : undefined
      const resultado = await consultarPagina(p, cursor)

      const nuevos = [...cursoresActuales]
      if (resultado.ultimoDocumento) nuevos[numero - 1] = resultado.ultimoDocumento

      setPatron(p)
      setVideojuegos(resultado.videojuegos)
      setCursores(nuevos)
      setPagina(numero)
      setHayMas(resultado.videojuegos.length === TAMANO_PAGINA)
    } catch (e) {
      // If an index is missing, the message includes the link to create it
      setVideojuegos([])
      setHayMas(false)
      setError((e as Error).message)
    } finally {
      setCargando(false)
    }
  }

  const buscarPorId = async (id: string) => {
    setCargando(true)
    setError('')
    try {
      const encontrado = await obtenerVideojuegoPorId(id)
      setVideojuegos(encontrado ? [encontrado] : [])
      setBusquedaId(id)
      setHayMas(false)
      setPagina(1)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    // Initial load: first 10 documents only
    consultarPagina({ tipo: 'todos' })
      .then((r) => {
        setVideojuegos(r.videojuegos)
        setCursores(r.ultimoDocumento ? [r.ultimoDocumento] : [])
        setHayMas(r.videojuegos.length === TAMANO_PAGINA)
      })
      .catch((e) => setError((e as Error).message))
  }, [])

  const enlace = error.match(/https?:\/\/\S+/)?.[0].replace(/[.,]$/, '')

  return (
    <>
      <PanelFiltros
        onConsultar={(p) => cargarPagina(p, 1, [])}
        onBuscarPorId={buscarPorId}
        deshabilitado={cargando}
      />

      <section className="contenido">
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
        {cargando && <p>Consultando...</p>}
        {busquedaId && videojuegos.length === 0 && !error && (
          <p>No existe ningún videojuego con el ID {busquedaId}.</p>
        )}

        {videojuegos.length > 0 && (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Plataforma</th>
                  <th>Género</th>
                  <th>Precio</th>
                  <th>Disponible</th>
                  <th>Calificación</th>
                  <th>Desarrollador</th>
                  <th>Multijugador</th>
                </tr>
              </thead>
              <tbody>
                {videojuegos.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.titulo}</td>
                    <td>{v.plataforma}</td>
                    <td>{v.genero}</td>
                    <td>${v.precio.toFixed(2)}</td>
                    <td>{v.disponible ? 'Sí' : 'No'}</td>
                    <td>{v.calificacion}</td>
                    <td>{v.detalles.desarrollador}</td>
                    <td>{v.detalles.multijugador ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!busquedaId && (
          <nav className="paginacion">
            <button
              onClick={() => cargarPagina(patron, pagina - 1, cursores)}
              disabled={pagina === 1 || cargando}
            >
              Anterior
            </button>
            <span>Página {pagina}</span>
            <button
              onClick={() => cargarPagina(patron, pagina + 1, cursores)}
              disabled={!hayMas || cargando}
            >
              Siguiente
            </button>
          </nav>
        )}
      </section>
    </>
  )
}

export default CatalogoVideojuegos
