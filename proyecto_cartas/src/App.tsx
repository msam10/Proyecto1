
import Cartadetalle from './Componentes/Carta'

function App() {
  
  return (
    <div className="bg-linear-to-r from-cyan-500 to-blue-500 flex flex-wrap gap-6 p-8 bg-gray-100 justify-center min-h-screen">
    
    <Cartadetalle 
    ataque={4500}
    nombre="Luffy"
    defensa={3200}
    descripcion="Monkey D. Luffy, capitán de los Sombrero de Paja, busca ser el Rey de los Piratas con Gear 5 y voluntad indomable."
    imagen="https://preview.redd.it/what-makes-luffy-such-a-likable-protagonist-v0-lhdd2872qurb1.jpg?width=320&crop=smart&auto=webp&s=214ccf69b93d7c4ce7001b19c9d1bbd12ec98ba2"
    tipo="capitan/pirata"
    numero={1}

    />

    <Cartadetalle 
    ataque={3800}
    nombre="Zoro"
    defensa={2900}
    descripcion="Espadachín de los Sombrero de Paja, conocido como “Cazador de Piratas”, maneja el estilo de tres espadas y sueña con ser el mejor espadachín del mundo."
    imagen="https://i.pinimg.com/474x/75/f7/92/75f792d473b4fa7e087940be1032bf3b.jpg"
    tipo=" Espadachín/Pirata"
    numero={2}
    
    />

    <Cartadetalle 
    ataque={4200}
    nombre="Garp"
    defensa={3800}
    descripcion="Monkey D. Garp, héroe de la Marina y abuelo de Luffy, conocido como 'Héroe de la Marina' por capturar a Rocks y Gol D. Roger."
    imagen="https://comicvine.gamespot.com/a/uploads/original/11117/111178336/6766913-garp_manga_color.png"
    tipo="Marine/Vicealmirante"
    numero={3}
    
    />

    <Cartadetalle 
    ataque={4100}
    nombre="Aokiji"
    defensa={3600}
    descripcion= "Kuzan (Aokiji), ex-Almirante de la Marina, maneja la Logia de Hielo y busca justicia autónoma tras dejar el cargo."
    imagen="https://i.pinimg.com/1200x/0d/8d/f7/0d8df738229467a385b9441026b4f660.jpg"
    tipo="Marine/Almirante/Logia."
    numero={4}
    
    />

   



    
    </div>
  )
}


export default App
