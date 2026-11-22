import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase";

// Run once: npm run seed
// Writes the "inventario_vehiculos" collection with custom IDs (VEH001, VEH002, ...)

type Fila = [
  marca: string,
  modelo: string,
  tipo: string,
  anio: number,
  precio: number,
  disponible: boolean,
  motor: string,
  combustible: string,
  transmision: string,
];

const filas: Fila[] = [
  ["Toyota", "Corolla", "Sedan", 2025, 24500, true, "2.0", "Gasolina", "Automática"],
  ["Toyota", "RAV4", "SUV", 2025, 33500, true, "2.5", "Híbrido", "Automática"],
  ["Toyota", "Hilux", "Pickup", 2024, 41800, true, "2.8", "Diésel", "Manual"],
  ["Toyota", "Yaris", "Hatchback", 2023, 16900, false, "1.5", "Gasolina", "Manual"],
  ["Toyota", "Camry", "Sedan", 2024, 31500, true, "2.5", "Híbrido", "Automática"],
  ["Honda", "Civic", "Sedan", 2024, 26800, true, "2.0", "Gasolina", "Automática"],
  ["Honda", "CR-V", "SUV", 2024, 35200, true, "1.5", "Híbrido", "Automática"],
  ["Honda", "Fit", "Hatchback", 2022, 17800, true, "1.5", "Gasolina", "Manual"],
  ["Honda", "HR-V", "SUV", 2023, 27900, false, "1.8", "Gasolina", "Automática"],
  ["Hyundai", "Elantra", "Sedan", 2023, 21500, true, "2.0", "Gasolina", "Automática"],
  ["Hyundai", "Tucson", "SUV", 2024, 31200, true, "2.5", "Gasolina", "Automática"],
  ["Hyundai", "i20", "Hatchback", 2023, 16400, true, "1.2", "Gasolina", "Manual"],
  ["Hyundai", "Ioniq 5", "SUV", 2025, 44900, true, "Eléctrico 225 kW", "Eléctrico", "Automática"],
  ["Kia", "Sportage", "SUV", 2023, 29900, false, "2.0", "Gasolina", "Automática"],
  ["Kia", "Rio", "Hatchback", 2021, 16800, true, "1.4", "Gasolina", "Manual"],
  ["Kia", "K5", "Sedan", 2024, 28900, true, "2.5", "Gasolina", "Automática"],
  ["Kia", "EV6", "SUV", 2025, 48500, true, "Eléctrico 239 kW", "Eléctrico", "Automática"],
  ["Mazda", "Mazda3", "Sedan", 2023, 23900, false, "2.5", "Gasolina", "Automática"],
  ["Mazda", "CX-5", "SUV", 2022, 32400, true, "2.5", "Gasolina", "Automática"],
  ["Mazda", "Mazda2", "Hatchback", 2025, 18900, true, "1.5", "Gasolina", "Manual"],
  ["Mazda", "CX-30", "SUV", 2024, 27600, true, "2.0", "Gasolina", "Automática"],
  ["Nissan", "Sentra", "Sedan", 2021, 19800, true, "2.0", "Gasolina", "Automática"],
  ["Nissan", "Frontier", "Pickup", 2022, 37600, true, "2.3", "Diésel", "Manual"],
  ["Nissan", "Rogue", "SUV", 2022, 30200, true, "2.5", "Gasolina", "Automática"],
  ["Nissan", "Leaf", "Hatchback", 2024, 29900, true, "Eléctrico 110 kW", "Eléctrico", "Automática"],
  ["Ford", "F-150", "Pickup", 2025, 54900, true, "3.5", "Gasolina", "Automática"],
  ["Ford", "Ranger", "Pickup", 2023, 38400, true, "2.0", "Diésel", "Automática"],
  ["Ford", "Explorer", "SUV", 2025, 44900, true, "2.3", "Gasolina", "Automática"],
  ["Ford", "Fiesta", "Hatchback", 2020, 15900, false, "1.6", "Gasolina", "Manual"],
  ["Chevrolet", "Tahoe", "SUV", 2026, 58900, true, "5.3", "Gasolina", "Automática"],
  ["Chevrolet", "Silverado", "Pickup", 2023, 52300, false, "5.3", "Gasolina", "Automática"],
  ["Chevrolet", "Spark", "Hatchback", 2023, 15200, true, "1.4", "Gasolina", "Manual"],
  ["Chevrolet", "Onix", "Sedan", 2024, 17900, true, "1.0", "Gasolina", "Automática"],
  ["Volkswagen", "Golf", "Hatchback", 2024, 27300, true, "2.0", "Gasolina", "Automática"],
  ["Volkswagen", "Jetta", "Sedan", 2021, 22400, true, "1.4", "Gasolina", "Automática"],
  ["Volkswagen", "Amarok", "Pickup", 2024, 43600, false, "3.0", "Diésel", "Automática"],
  ["Volkswagen", "ID.4", "SUV", 2025, 41900, true, "Eléctrico 150 kW", "Eléctrico", "Automática"],
  ["BMW", "Serie 3", "Sedan", 2026, 48500, true, "2.0", "Gasolina", "Automática"],
  ["BMW", "X3", "SUV", 2025, 55900, true, "2.0", "Híbrido", "Automática"],
  ["BMW", "i4", "Sedan", 2025, 59500, false, "Eléctrico 250 kW", "Eléctrico", "Automática"],
  ["BMW", "Serie 1", "Hatchback", 2024, 38500, true, "2.0", "Gasolina", "Automática"],
  ["Mitsubishi", "L200", "Pickup", 2020, 34900, true, "2.4", "Diésel", "Manual"],
  ["Suzuki", "Swift", "Hatchback", 2020, 17500, false, "1.2", "Gasolina", "Manual"],
  ["Toyota", "Prius", "Hatchback", 2024, 29500, true, "1.8", "Híbrido", "Automática"],
];

async function seed() {
  for (const [i, f] of filas.entries()) {
    const id = `VEH${String(i + 1).padStart(3, "0")}`;
    await setDoc(doc(db, "inventario_vehiculos", id), {
      marca: f[0],
      modelo: f[1],
      tipo: f[2],
      anio: f[3],
      precio: f[4],
      disponible: f[5],
      especificaciones: {
        motor: f[6],
        combustible: f[7],
        transmision: f[8],
      },
    });
    console.log(`Saved ${id} - ${f[0]} ${f[1]}`);
  }
  console.log(`\nDone: ${filas.length} documents written to "inventario_vehiculos".`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
