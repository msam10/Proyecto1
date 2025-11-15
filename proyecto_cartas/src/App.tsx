
import Cartadetalle from './Componentes/Carta'

function App() {
  
  return (
    <div className="bg-linear-to-r from-cyan-500 to-blue-500">
    <Cartadetalle 
    ataque={8000}
    nombre="Luffy"
    defensa={6000}
    descripcion="Luffy,usuario de la fruta del diablo; hito hito no mi."
    imagen="https://preview.redd.it/what-makes-luffy-such-a-likable-protagonist-v0-lhdd2872qurb1.jpg?width=320&crop=smart&auto=webp&s=214ccf69b93d7c4ce7001b19c9d1bbd12ec98ba2"
    tipo="ataque fisico\ofensivo"
    numero={1}
    
    />





    
    </div>
  )
}


export default App
