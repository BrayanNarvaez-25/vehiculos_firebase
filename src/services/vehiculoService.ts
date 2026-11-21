import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type Query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Vehiculo {
  id: string
  marca: string
  modelo: string
  precio: number
  stock: number
  anio: number
  tipo: string
}

const vehiculosRef = collection(db, 'vehiculos')

const ejecutar = async (consulta: Query): Promise<Vehiculo[]> => {
  const snapshot = await getDocs(consulta)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Vehiculo[]
}

// Query 1: available vehicles, cheapest first
export const consulta1 = () =>
  ejecutar(query(vehiculosRef, where('stock', '>', 0), orderBy('stock'), orderBy('precio', 'asc')))

// Query 2: available SUVs, cheapest first
export const consulta2 = () =>
  ejecutar(
    query(
      vehiculosRef,
      where('tipo', '==', 'SUV'),
      where('stock', '>', 0),
      orderBy('stock'),
      orderBy('precio', 'asc')
    )
  )

// Query 3: available vehicles priced between 20000 and 40000
export const consulta3 = () =>
  ejecutar(
    query(
      vehiculosRef,
      where('precio', '>=', 20000),
      where('precio', '<=', 40000),
      where('stock', '>', 0),
      orderBy('precio', 'asc')
    )
  )

// Query 4 (challenge): available Sedans from 2023 onwards, newest first
export const consulta4 = () =>
  ejecutar(
    query(
      vehiculosRef,
      where('tipo', '==', 'Sedan'),
      where('anio', '>=', 2023),
      where('stock', '>', 0),
      orderBy('anio', 'desc')
    )
  )

export const TAMANO_PAGINA = 10

// Fetches one page of vehicles (10 docs) straight from Firestore.
// Pass the last document of the previous page as the cursor to get the next one.
export const obtenerVehiculosPaginados = async (
  cursor?: QueryDocumentSnapshot<DocumentData>
) => {
  const consulta = cursor
    ? query(vehiculosRef, orderBy('precio', 'asc'), startAfter(cursor), limit(TAMANO_PAGINA))
    : query(vehiculosRef, orderBy('precio', 'asc'), limit(TAMANO_PAGINA))

  const snapshot = await getDocs(consulta)

  return {
    vehiculos: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Vehiculo[],
    ultimoDocumento: snapshot.docs[snapshot.docs.length - 1] ?? null,
  }
}
