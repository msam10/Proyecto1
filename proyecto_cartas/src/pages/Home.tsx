import { useState } from "react";
import type { IPersonaje } from "../App";
import Cartadetalle from "../Componentes/Carta";
import Modal from "../Componentes/Modal";
import { Link } from "react-router";


const Home = ({personajes}:{personajes: IPersonaje[]}) =>{
      const [personajeSeleccionado, setPersonajeSeleccionado] = useState<IPersonaje | null>(null);
  const [busqueda, setBusqueda] = useState("");
   const handleCardClick = (personaje: IPersonaje) => setPersonajeSeleccionado(personaje);
  const handleCloseModal = () => setPersonajeSeleccionado(null);
    return (<>
          <Link to='/Formulario'><h1>Crear</h1></Link>
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
                  vida={personaje.vida}
                  eliminarCarta={personaje.eliminarCarta}  
                  
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
           vida={personajeSeleccionado.vida}
          onClose={handleCloseModal}
        />
      )}
      </>

    )
}


export default Home