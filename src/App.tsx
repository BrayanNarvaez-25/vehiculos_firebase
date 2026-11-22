import './App.css'
import InventarioVehiculos from './components/InventarioVehiculos'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Inventario de vehículos</h1>
        <p>Consulta el inventario por marca, tipo, combustible, precio y disponibilidad.</p>
      </header>
      <InventarioVehiculos />
    </div>
  )
}

export default App
