
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
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState<IPersonaje | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const handleCardClick = (personaje: IPersonaje) => setPersonajeSeleccionado(personaje);
  const handleCloseModal = () => setPersonajeSeleccionado(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-200 via-sky-200 to-amber-300 flex flex-col items-center py-12">
     
      <input
        type="text"
        placeholder="Buscar personaje..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-96 p-3 mb-10 rounded-2xl text-center text-gray-800 placeholder-gray-500
                   bg-amber-100/60 backdrop-blur-sm border border-amber-400/40 
                   focus:outline-none focus:ring-4 focus:ring-sky-300 shadow-md transition-all"
      />

   
      <div className="flex flex-wrap gap-10 justify-center">
        {personajes
          .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
          .map((personaje) => (
            <div
              key={personaje.numero}
              onClick={() => handleCardClick(personaje)}
              className="relative w-[400px] h-[640px] bg-linear-to-br from-sky-100 via-amber-100 to-rose-100 
                         rounded-4xl p-7 shadow-lg hover:shadow-amber-500/30 
                         transform hover:scale-[1.03] hover:-translate-y-2 cursor-pointer 
                         transition-all overflow-hidden text-gray-800"
            >
            
            <div className="overflow-hidden rounded-2xl shadow-md h-[88%]">
                <Cartadetalle
                  ataque={personaje.ataque}
                  defensa={personaje.defensa}
                  nombre={personaje.nombre}
                  imagen={personaje.imagen}
                  numero={personaje.numero}
                />
              </div>

              <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-sm font-semibold text-gray-800">
                <div className="bg-amber-200/80 px-3 py-1 pt-5 rounded-lg shadow-sm text-2xl">
                   Ataque: {personaje.ataque}
                </div>
                <div className="bg-sky-200/80 px-3 py-1  pt-5 rounded-lg shadow-sm text-2xl">
                  Defensa: {personaje.defensa}
                </div>
              </div>
            </div>
          ))}
      </div>

      {personajeSeleccionado && (
        <Modal
          descripcion={personajeSeleccionado.descripcion}
          tipo= {personajeSeleccionado.tipo}
          ataque={personajeSeleccionado.ataque}
          defensa={personajeSeleccionado.defensa}
          imagen={personajeSeleccionado.imagen}
          nombre={personajeSeleccionado.nombre}
          numero={personajeSeleccionado.numero}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;