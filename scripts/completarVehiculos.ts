import { addDoc, collection, getCountFromServer } from "firebase/firestore";
import { db } from "../src/firebase";

type Tipo = "Sedan" | "SUV" | "Pickup" | "Hatchback";

// Extra vehicles to reach at least 40 documents for the pagination workshop
const vehiculos: { marca: string; modelo: string; precio: number; stock: number; anio: number; tipo: Tipo }[] = [
  { marca: "Toyota", modelo: "Yaris", precio: 16900, stock: 14, anio: 2024, tipo: "Hatchback" },
  { marca: "Honda", modelo: "Fit", precio: 17800, stock: 9, anio: 2022, tipo: "Hatchback" },
  { marca: "Hyundai", modelo: "i20", precio: 16400, stock: 17, anio: 2023, tipo: "Hatchback" },
  { marca: "Ford", modelo: "Fiesta", precio: 15900, stock: 0, anio: 2020, tipo: "Hatchback" },
  { marca: "Peugeot", modelo: "208", precio: 19700, stock: 8, anio: 2025, tipo: "Hatchback" },
  { marca: "Toyota", modelo: "Camry", precio: 31500, stock: 6, anio: 2025, tipo: "Sedan" },
  { marca: "Kia", modelo: "K5", precio: 28900, stock: 4, anio: 2024, tipo: "Sedan" },
  { marca: "Mercedes-Benz", modelo: "Clase C", precio: 51200, stock: 2, anio: 2026, tipo: "Sedan" },
  { marca: "Volkswagen", modelo: "Jetta", precio: 22400, stock: 11, anio: 2021, tipo: "Sedan" },
  { marca: "Audi", modelo: "A4", precio: 46800, stock: 0, anio: 2023, tipo: "Sedan" },
  { marca: "Ford", modelo: "Explorer", precio: 44900, stock: 5, anio: 2025, tipo: "SUV" },
  { marca: "Nissan", modelo: "Rogue", precio: 30200, stock: 13, anio: 2022, tipo: "SUV" },
  { marca: "Subaru", modelo: "Forester", precio: 33900, stock: 7, anio: 2024, tipo: "SUV" },
  { marca: "Jeep", modelo: "Grand Cherokee", precio: 53500, stock: 3, anio: 2026, tipo: "SUV" },
  { marca: "Suzuki", modelo: "Vitara", precio: 24700, stock: 16, anio: 2021, tipo: "SUV" },
  { marca: "RAM", modelo: "1500", precio: 57800, stock: 2, anio: 2025, tipo: "Pickup" },
  { marca: "Ford", modelo: "Ranger", precio: 38400, stock: 10, anio: 2023, tipo: "Pickup" },
  { marca: "Isuzu", modelo: "D-Max", precio: 36200, stock: 12, anio: 2022, tipo: "Pickup" },
  { marca: "Volkswagen", modelo: "Amarok", precio: 43600, stock: 0, anio: 2024, tipo: "Pickup" },
  { marca: "GMC", modelo: "Sierra", precio: 59900, stock: 1, anio: 2026, tipo: "Pickup" },
];

async function completarVehiculos() {
  const ref = collection(db, "vehiculos");
  for (const vehiculo of vehiculos) {
    const docRef = await addDoc(ref, vehiculo);
    console.log(`Added ${vehiculo.marca} ${vehiculo.modelo} (${docRef.id})`);
  }
  const total = (await getCountFromServer(ref)).data().count;
  console.log(`\nDone. Total documents in collection: ${total}`);
}

completarVehiculos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error completing vehicles:", error);
    process.exit(1);
  });
