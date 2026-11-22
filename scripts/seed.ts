import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase";

// Run once: npm run seed
// Writes the "videojuegos" collection with custom IDs (VJ001, VJ002, ...)

type Fila = [
  titulo: string,
  plataforma: string,
  genero: string,
  precio: number,
  disponible: boolean,
  anio: number,
  calificacion: number,
  desarrollador: string,
  multijugador: boolean,
  clasificacion: string,
];

const filas: Fila[] = [
  ["The Witcher 3", "PC", "RPG", 29.99, true, 2015, 9.7, "CD Projekt Red", false, "M"],
  ["Elden Ring", "PS5", "RPG", 59.99, true, 2022, 9.5, "FromSoftware", true, "M"],
  ["Cyberpunk 2077", "PC", "RPG", 39.99, true, 2020, 8.6, "CD Projekt Red", false, "M"],
  ["Baldur's Gate 3", "PC", "RPG", 59.99, true, 2023, 9.8, "Larian Studios", true, "M"],
  ["Starfield", "Xbox", "RPG", 69.99, false, 2023, 8.0, "Bethesda", false, "M"],
  ["Final Fantasy XVI", "PS5", "RPG", 59.99, true, 2023, 8.5, "Square Enix", false, "M"],
  ["Persona 5 Royal", "Switch", "RPG", 49.99, true, 2022, 9.3, "Atlus", false, "T"],
  ["Xenoblade Chronicles 3", "Switch", "RPG", 59.99, true, 2022, 9.0, "Monolith Soft", false, "T"],
  ["God of War Ragnarok", "PS5", "Accion", 69.99, true, 2022, 9.4, "Santa Monica Studio", false, "M"],
  ["Marvel's Spider-Man 2", "PS5", "Accion", 69.99, true, 2023, 9.0, "Insomniac Games", false, "T"],
  ["Hades", "PC", "Accion", 24.99, true, 2020, 9.3, "Supergiant Games", false, "T"],
  ["Devil May Cry 5", "Xbox", "Accion", 29.99, true, 2019, 8.9, "Capcom", false, "M"],
  ["Hi-Fi Rush", "Xbox", "Accion", 29.99, false, 2023, 8.8, "Tango Gameworks", false, "T"],
  ["Doom Eternal", "PC", "Accion", 39.99, true, 2020, 9.0, "id Software", true, "M"],
  ["Super Mario Odyssey", "Switch", "Aventura", 59.99, true, 2017, 9.7, "Nintendo", false, "E"],
  ["Zelda: Tears of the Kingdom", "Switch", "Aventura", 69.99, true, 2023, 9.8, "Nintendo", false, "E10+"],
  ["Horizon Forbidden West", "PS5", "Aventura", 59.99, true, 2022, 8.8, "Guerrilla Games", false, "T"],
  ["Uncharted 4", "PS5", "Aventura", 19.99, false, 2016, 9.3, "Naughty Dog", true, "T"],
  ["Hollow Knight", "PC", "Aventura", 14.99, true, 2017, 9.4, "Team Cherry", false, "E10+"],
  ["Ori and the Will of the Wisps", "Xbox", "Aventura", 29.99, true, 2020, 9.2, "Moon Studios", false, "E"],
  ["EA Sports FC 24", "PS5", "Deportes", 59.99, true, 2023, 7.5, "EA Sports", true, "E"],
  ["NBA 2K24", "Xbox", "Deportes", 59.99, true, 2023, 7.0, "Visual Concepts", true, "E"],
  ["Mario Tennis Aces", "Switch", "Deportes", 39.99, false, 2018, 7.4, "Camelot", true, "E"],
  ["Rocket League", "PC", "Deportes", 19.99, true, 2015, 8.7, "Psyonix", true, "E"],
  ["Madden NFL 24", "PS5", "Deportes", 49.99, true, 2023, 6.8, "EA Tiburon", true, "E"],
  ["Mario Strikers: Battle League", "Switch", "Deportes", 39.99, true, 2022, 7.2, "Next Level Games", true, "E"],
  ["Civilization VI", "PC", "Estrategia", 29.99, true, 2016, 8.8, "Firaxis Games", true, "E10+"],
  ["Age of Empires IV", "PC", "Estrategia", 39.99, true, 2021, 8.3, "Relic Entertainment", true, "T"],
  ["Halo Wars 2", "Xbox", "Estrategia", 19.99, false, 2017, 7.6, "Creative Assembly", true, "T"],
  ["Fire Emblem: Three Houses", "Switch", "Estrategia", 59.99, true, 2019, 9.0, "Intelligent Systems", false, "T"],
  ["XCOM 2", "PC", "Estrategia", 24.99, true, 2016, 8.6, "Firaxis Games", true, "T"],
  ["Total War: Warhammer III", "PC", "Estrategia", 59.99, true, 2022, 8.4, "Creative Assembly", true, "T"],
  ["Forza Horizon 5", "Xbox", "Carreras", 59.99, true, 2021, 9.2, "Playground Games", true, "E"],
  ["Gran Turismo 7", "PS5", "Carreras", 69.99, true, 2022, 8.7, "Polyphony Digital", true, "E"],
  ["Mario Kart 8 Deluxe", "Switch", "Carreras", 59.99, true, 2017, 9.3, "Nintendo", true, "E"],
  ["Need for Speed Unbound", "PC", "Carreras", 39.99, false, 2022, 7.5, "Criterion Games", true, "T"],
  ["Assetto Corsa Competizione", "PC", "Carreras", 34.99, true, 2019, 8.0, "Kunos Simulazioni", true, "E"],
  ["Forza Motorsport", "Xbox", "Carreras", 59.99, true, 2023, 7.8, "Turn 10 Studios", true, "E"],
  ["Resident Evil 4", "PS5", "Accion", 39.99, true, 2023, 9.2, "Capcom", false, "M"],
  ["Red Dead Redemption 2", "PC", "Aventura", 39.99, true, 2018, 9.6, "Rockstar Games", true, "M"],
  ["Stardew Valley", "Switch", "Aventura", 14.99, true, 2016, 9.1, "ConcernedApe", true, "E"],
  ["Diablo IV", "PC", "RPG", 69.99, true, 2023, 8.0, "Blizzard Entertainment", true, "M"],
  ["Street Fighter 6", "PS5", "Accion", 59.99, false, 2023, 9.1, "Capcom", true, "T"],
  ["Mortal Kombat 1", "Xbox", "Accion", 69.99, true, 2023, 8.2, "NetherRealm Studios", true, "M"],
];

async function seed() {
  for (const [i, f] of filas.entries()) {
    const id = `VJ${String(i + 1).padStart(3, "0")}`;
    await setDoc(doc(db, "videojuegos", id), {
      titulo: f[0],
      plataforma: f[1],
      genero: f[2],
      precio: f[3],
      disponible: f[4],
      anio: f[5],
      calificacion: f[6],
      detalles: {
        desarrollador: f[7],
        multijugador: f[8],
        clasificacion: f[9],
      },
    });
    console.log(`Saved ${id} - ${f[0]}`);
  }
  console.log(`\nDone: ${filas.length} documents written to "videojuegos".`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
