import { collection, getDocs, orderBy, query, where, type Query } from 'firebase/firestore'
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
