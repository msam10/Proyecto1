
import { useState } from "react";
import Cartadetalle from "./Componentes/Carta";
import Modal from "./Componentes/Modal";

export interface IPersonaje {
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  numero: number;
  descripcion: string;
  tipo: string;
}

const personajes: IPersonaje[] = [
  {
    nombre: "LUFFY",
    ataque: 4500,
    defensa: 3200,
    imagen:
      "https://preview.redd.it/what-makes-luffy-such-a-likable-protagonist-v0-lhdd2872qurb1.jpg?width=320&crop=smart&auto=webp&s=214ccf69b93d7c4ce7001b19c9d1bbd12ec98ba2",
    numero: 1,
    descripcion: "Rey de los piratas.",
    tipo: "Fruta del diablo",
  },
  {
    nombre: "ZORO",
    ataque: 3800,
    defensa: 2900,
    imagen: "https://i.pinimg.com/474x/75/f7/92/75f792d473b4fa7e087940be1032bf3b.jpg",
    numero: 2,
    descripcion: "Mejor espadachin del mundo.",
    tipo: "Espadachin",
  },
  {
    nombre: "GARP",
    ataque: 4200,
    defensa: 3800,
    imagen:
      "https://comicvine.gamespot.com/a/uploads/original/11117/111178336/6766913-garp_manga_color.png",
    numero: 3,
    descripcion: "Heroe de la marina.",
    tipo: "Marine",
  },
  {
    nombre: "AOKIJI",
    ataque: 4100,
    defensa: 3600,
    imagen: "https://i.pinimg.com/1200x/0d/8d/f7/0d8df738229467a385b9441026b4f660.jpg",
    numero: 4,
    descripcion: "Ex-almirante de la marina.",
    tipo: "Fruta del diablo",
  },
];

function App() {
  const [personajeSeleccionado, setPersonajeSeleccionado] =
    useState<IPersonaje | null>(null);

    const [busqueda,setBusqueda] =
    useState("");

  const handleCardClick = (personaje: IPersonaje) => {
    setPersonajeSeleccionado(personaje);
  };

  const handleCloseModal = () => {
    setPersonajeSeleccionado(null);
  };

  return (
    <div className="bg-linear-to-r from-cyan-500 to-blue-500  bg-gray-100  min-h-screen">
      <input
            type="text"
            onChange={(e)=>{setBusqueda(e.target.value)}}
          className="bg-blue-950 pt-5 justify-center flex "
             value={busqueda}
          
            > 
        
        </input>
        <div className="flex flex-wrap gap-6 p-8 justify-center">
      {personajes.filter((personajes) =>personajes.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())).map((personaje) => (
        <div
          key={personaje.numero}
          className="bg-linear-to-r from-green-400 to-blue-500  border-4 rounded-lg w-110 font-mono text-white"
        >  
          <Cartadetalle
            ataque={personaje.ataque}
            nombre={personaje.nombre}
            defensa={personaje.defensa}
            imagen={personaje.imagen}
            numero={personaje.numero}
            onClick={() => handleCardClick(personaje)}
          />
        </div>
      ))}
</div>
      {personajeSeleccionado && (
        <Modal
          descripcion={personajeSeleccionado.descripcion}
          tipo={personajeSeleccionado.tipo}
          ataque={personajeSeleccionado.ataque}
          defensa={personajeSeleccionado.defensa}
          imagen={personajeSeleccionado.imagen}
          nombre={personajeSeleccionado.nombre}
          onClose={handleCloseModal}
          numero={personajeSeleccionado.numero}
        />
      )}
    </div>
  );
}

export default App;


