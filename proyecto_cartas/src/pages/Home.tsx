import { useState } from "react";
import type { IPersonaje } from "../Componentes/interfaces";
import Cartadetalle from "../Componentes/Carta";
import Modal from "../Componentes/Modal";
import { Link } from "react-router";

const Home = ({ personajes, eliminarCarta }: { personajes: IPersonaje[], eliminarCarta: (numero: number) => void }) => {
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState<IPersonaje | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const handleCloseModal = () => setPersonajeSeleccionado(null);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      
      {/* Barra superior con Buscador y Crear */}
      <div className="w-full max-w-5xl flex justify-center items-center gap-6 mb-12">
        <input
          type="text"
          placeholder="Buscar carta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-96 p-3 rounded-2xl text-center bg-amber-100/60 backdrop-blur-sm border border-amber-400/40 
                     focus:outline-none focus:ring-4 focus:ring-sky-300 shadow-md transition-all font-medium"
        />

        <Link 
          to='/Formulario' 
          className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-8 py-3 rounded-2xl 
                     font-bold uppercase tracking-widest shadow-lg transform transition-all 
                     hover:scale-105 active:scale-95 hover:shadow-sky-500/40"
        >
          Crear
        </Link>
      </div>

      {/* Grid de Cartas */}
      <div className="flex flex-wrap gap-10 justify-center">
        {personajes
          .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
          .map((personaje) => (
            <div
              key={personaje.numero}
              className="group relative w-[400px] h-[640px] bg-linear-to-br from-sky-100 via-amber-100 to-rose-100 
                         rounded-4xl p-7 shadow-lg hover:shadow-amber-500/30 
                         transform hover:scale-[1.03] hover:-translate-y-2 cursor-pointer 
                         transition-all overflow-hidden text-gray-800"
            >
              
            
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm('¿Eliminar personaje?')) eliminarCarta(personaje.numero);
                }}
                className="absolute top-5 right-5 z-10 bg-white/90 hover:bg-red-500 hover:text-white 
                           text-red-500 w-9 h-9 rounded-full flex items-center justify-center 
                           shadow-md border border-red-100 transition-all font-bold"
              >
                ✕
              </button>

              <div onClick={() => setPersonajeSeleccionado(personaje)} className="h-full">
                <div className="overflow-hidden rounded-2xl shadow-md h-[88%]">
                  <Cartadetalle 
                    ataque={personaje.ataque}
                    defensa={personaje.defensa}
                    nombre={personaje.nombre}
                    imagen={personaje.imagen}
                    numero={personaje.numero}
                    vida={personaje.vida}
                    eliminarCarta={eliminarCarta} 
                  />
                </div>

                <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-sm font-semibold text-gray-800">
                  <div className="bg-amber-200/80 px-3 py-1 pt-5 rounded-lg shadow-sm text-2xl">
                     Ataque: {personaje.ataque}
                  </div>
                  <div className="bg-sky-200/80 px-3 py-1 pt-5 rounded-lg shadow-sm text-2xl">
                    Defensa: {personaje.defensa}
                  </div>
                </div>
              </div>
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
          numero={personajeSeleccionado.numero}
          vida={personajeSeleccionado.vida}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Home;