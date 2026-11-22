import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface VehiculoInventario {
  id: string
  marca: string
  modelo: string
  tipo: string
  anio: number
  precio: number
  disponible: boolean
  especificaciones: {
    motor: string
    combustible: string
    transmision: string
  }
}

export const TAMANO_PAGINA = 10

export const MARCAS = [
  'Toyota',
  'Honda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Nissan',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'BMW',
]
export const TIPOS = ['Sedan', 'SUV', 'Pickup', 'Hatchback']
export const COMBUSTIBLES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico']

// Access patterns the app resolves (each one is a Firestore query)
export type Patron =
  | { tipo: 'todos' }
  | { tipo: 'marca'; marca: string }
  | { tipo: 'disponibles' }
  | { tipo: 'rangoPrecio'; min: number; max: number }
  | { tipo: 'carroceria'; carroceria: string }
  | { tipo: 'combustible'; combustible: string }

const inventarioRef = collection(db, 'inventario_vehiculos')

const restricciones = (patron: Patron): QueryConstraint[] => {
  switch (patron.tipo) {
    case 'todos':
      return [orderBy('marca')]
    case 'marca':
      return [where('marca', '==', patron.marca), orderBy('precio', 'asc')]
    case 'disponibles':
      return [where('disponible', '==', true), orderBy('precio', 'asc')]
    case 'rangoPrecio':
      return [
        where('precio', '>=', patron.min),
        where('precio', '<=', patron.max),
        orderBy('precio', 'asc'),
      ]
    case 'carroceria':
      return [where('tipo', '==', patron.carroceria), orderBy('anio', 'desc')]
    case 'combustible':
      // Filters on a field of the nested Map
      return [
        where('especificaciones.combustible', '==', patron.combustible),
        where('disponible', '==', true),
        orderBy('precio', 'asc'),
      ]
  }
}

// One explicit read per page: 10 documents, starting after the cursor when given
export const consultarPagina = async (
  patron: Patron,
  cursor?: QueryDocumentSnapshot<DocumentData>
) => {
  const consulta = query(
    inventarioRef,
    ...restricciones(patron),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(TAMANO_PAGINA)
  )

  const snapshot = await getDocs(consulta)

  return {
    vehiculos: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as VehiculoInventario[],
    ultimoDocumento: snapshot.docs[snapshot.docs.length - 1] ?? null,
  }
}

// Single document read by its custom ID (e.g. VEH001)
export const obtenerVehiculoPorId = async (id: string): Promise<VehiculoInventario | null> => {
  const snapshot = await getDoc(doc(db, 'inventario_vehiculos', id))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as VehiculoInventario) : null
}
