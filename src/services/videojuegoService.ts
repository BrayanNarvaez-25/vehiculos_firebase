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

export interface Videojuego {
  id: string
  titulo: string
  plataforma: string
  genero: string
  precio: number
  disponible: boolean
  anio: number
  calificacion: number
  detalles: {
    desarrollador: string
    multijugador: boolean
    clasificacion: string
  }
}

export const TAMANO_PAGINA = 10

export const PLATAFORMAS = ['PC', 'PS5', 'Xbox', 'Switch']
export const GENEROS = ['Accion', 'Aventura', 'RPG', 'Deportes', 'Estrategia', 'Carreras']

// Access patterns the app resolves (each one is a Firestore query)
export type Patron =
  | { tipo: 'todos' }
  | { tipo: 'plataforma'; plataforma: string }
  | { tipo: 'disponibles' }
  | { tipo: 'rangoPrecio'; min: number; max: number }
  | { tipo: 'genero'; genero: string }
  | { tipo: 'multijugador' }

const videojuegosRef = collection(db, 'videojuegos')

const restricciones = (patron: Patron): QueryConstraint[] => {
  switch (patron.tipo) {
    case 'todos':
      return [orderBy('titulo')]
    case 'plataforma':
      return [where('plataforma', '==', patron.plataforma), orderBy('precio', 'asc')]
    case 'disponibles':
      return [where('disponible', '==', true), orderBy('precio', 'asc')]
    case 'rangoPrecio':
      return [
        where('precio', '>=', patron.min),
        where('precio', '<=', patron.max),
        orderBy('precio', 'asc'),
      ]
    case 'genero':
      return [where('genero', '==', patron.genero), orderBy('calificacion', 'desc')]
    case 'multijugador':
      // Filters on a field of the nested Map
      return [
        where('detalles.multijugador', '==', true),
        where('disponible', '==', true),
        orderBy('calificacion', 'desc'),
      ]
  }
}

// One explicit read per page: 10 documents, starting after the cursor when given
export const consultarPagina = async (
  patron: Patron,
  cursor?: QueryDocumentSnapshot<DocumentData>
) => {
  const consulta = query(
    videojuegosRef,
    ...restricciones(patron),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(TAMANO_PAGINA)
  )

  const snapshot = await getDocs(consulta)

  return {
    videojuegos: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Videojuego[],
    ultimoDocumento: snapshot.docs[snapshot.docs.length - 1] ?? null,
  }
}

// Single document read by its custom ID (e.g. VJ001)
export const obtenerVideojuegoPorId = async (id: string): Promise<Videojuego | null> => {
  const snapshot = await getDoc(doc(db, 'videojuegos', id))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Videojuego) : null
}
