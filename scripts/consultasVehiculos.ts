import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type Query,
} from "firebase/firestore";
import { db } from "../src/firebase";

const vehiculosRef = collection(db, "vehiculos");

async function ejecutarConsulta(titulo: string, consulta: Query) {
  console.log(`\n=== ${titulo} ===`);
  try {
    const snapshot = await getDocs(consulta);
    console.log(`Results: ${snapshot.size}`);
    snapshot.forEach((doc) => {
      const v = doc.data();
      console.log(
        `- ${v.marca} ${v.modelo} | ${v.tipo} | ${v.anio} | $${v.precio} | stock: ${v.stock}`
      );
    });
  } catch (error) {
    // If an index is missing, the message includes a link to create it
    console.error("Query failed:", (error as Error).message);
  }
}

// Query 1: available vehicles, cheapest first
const consulta1 = query(
  vehiculosRef,
  where("stock", ">", 0),
  orderBy("stock"),
  orderBy("precio", "asc")
);

// Query 2: available SUVs, cheapest first
const consulta2 = query(
  vehiculosRef,
  where("tipo", "==", "SUV"),
  where("stock", ">", 0),
  orderBy("stock"),
  orderBy("precio", "asc")
);

// Query 3: available vehicles priced between 20000 and 40000
const consulta3 = query(
  vehiculosRef,
  where("precio", ">=", 20000),
  where("precio", "<=", 40000),
  where("stock", ">", 0),
  orderBy("precio", "asc")
);

// Query 4 (challenge): available Sedans from 2023 onwards, newest first
const consulta4 = query(
  vehiculosRef,
  where("tipo", "==", "Sedan"),
  where("anio", ">=", 2023),
  where("stock", ">", 0),
  orderBy("anio", "desc")
);

async function main() {
  await ejecutarConsulta("Query 1: stock > 0, price ASC", consulta1);
  await ejecutarConsulta('Query 2: SUV, stock > 0, price ASC', consulta2);
  await ejecutarConsulta("Query 3: price 20000-40000, stock > 0, price ASC", consulta3);
  await ejecutarConsulta('Query 4: Sedan, year >= 2023, stock > 0, year DESC', consulta4);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
