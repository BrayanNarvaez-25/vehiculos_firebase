import { addDoc, collection } from "firebase/firestore";
import { db } from "../src/firebase";

interface Vehiculo {
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  anio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
}

const vehiculos: Vehiculo[] = [
  // Toyota Corolla already exists in the collection (created manually)
  { marca: "Honda", modelo: "Civic", precio: 26800, stock: 5, anio: 2024, tipo: "Sedan" },
  { marca: "Mazda", modelo: "Mazda3", precio: 23900, stock: 0, anio: 2023, tipo: "Sedan" },
  { marca: "Hyundai", modelo: "Elantra", precio: 21500, stock: 12, anio: 2022, tipo: "Sedan" },
  { marca: "Nissan", modelo: "Sentra", precio: 19800, stock: 7, anio: 2021, tipo: "Sedan" },
  { marca: "BMW", modelo: "Serie 3", precio: 48500, stock: 3, anio: 2026, tipo: "Sedan" },
  { marca: "Toyota", modelo: "RAV4", precio: 33500, stock: 10, anio: 2025, tipo: "SUV" },
  { marca: "Honda", modelo: "CR-V", precio: 35200, stock: 6, anio: 2024, tipo: "SUV" },
  { marca: "Kia", modelo: "Sportage", precio: 29900, stock: 0, anio: 2023, tipo: "SUV" },
  { marca: "Chevrolet", modelo: "Tahoe", precio: 58900, stock: 2, anio: 2026, tipo: "SUV" },
  { marca: "Hyundai", modelo: "Tucson", precio: 31200, stock: 14, anio: 2022, tipo: "SUV" },
  { marca: "Mazda", modelo: "CX-5", precio: 32400, stock: 9, anio: 2021, tipo: "SUV" },
  { marca: "Ford", modelo: "F-150", precio: 54900, stock: 4, anio: 2025, tipo: "Pickup" },
  { marca: "Toyota", modelo: "Hilux", precio: 41800, stock: 11, anio: 2024, tipo: "Pickup" },
  { marca: "Chevrolet", modelo: "Silverado", precio: 52300, stock: 0, anio: 2023, tipo: "Pickup" },
  { marca: "Nissan", modelo: "Frontier", precio: 37600, stock: 6, anio: 2022, tipo: "Pickup" },
  { marca: "Mitsubishi", modelo: "L200", precio: 34900, stock: 15, anio: 2020, tipo: "Pickup" },
  { marca: "Volkswagen", modelo: "Golf", precio: 27300, stock: 5, anio: 2024, tipo: "Hatchback" },
  { marca: "Chevrolet", modelo: "Spark", precio: 15200, stock: 20, anio: 2023, tipo: "Hatchback" },
  { marca: "Kia", modelo: "Rio", precio: 16800, stock: 18, anio: 2021, tipo: "Hatchback" },
  { marca: "Suzuki", modelo: "Swift", precio: 17500, stock: 0, anio: 2020, tipo: "Hatchback" },
  { marca: "Mazda", modelo: "Mazda2", precio: 18900, stock: 13, anio: 2025, tipo: "Hatchback" },
];

async function generarVehiculos() {
  const ref = collection(db, "vehiculos");
  for (const vehiculo of vehiculos) {
    const docRef = await addDoc(ref, vehiculo);
    console.log(`Added ${vehiculo.marca} ${vehiculo.modelo} (${docRef.id})`);
  }
  console.log(`\nDone: ${vehiculos.length} vehicles inserted.`);
}

generarVehiculos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error generating vehicles:", error);
    process.exit(1);
  });
