import './App.css'
import CatalogoVideojuegos from './components/CatalogoVideojuegos'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Catálogo de videojuegos</h1>
        <p>Consulta el inventario por plataforma, género, precio y disponibilidad.</p>
      </header>
      <CatalogoVideojuegos />
    </div>
  )
}

export default App
