import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";
import { toApiCartaMap, toApiUpdateCartaMap, toCartaMap, type iApiCarta, type IPersonaje } from "./Componentes/interfaces";
import Actualizarcard from "./Componentes/Edit_carta";

const API_URL = import.meta.env.VITE_PROYECTO_CARTAS_API;

function App() {
  const [personajes, setPersonajes] = useState<IPersonaje[]>([]);
  const [loading, setLoading] = useState(false); 

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/card`, { 
        headers: { usersecretpasskey: "Sama477355EZ" } 
      });
      const data = await res.json() as { data: iApiCarta[] };
      setPersonajes(data.data.map(toCartaMap));
    } catch (e) {
      console.error("error fetching task", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const addCarta = async (personaje: IPersonaje) => {
    setLoading(true); 
    try {
      await fetch(`${API_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Sama477355EZ"
        },
        body: JSON.stringify(toApiCartaMap(personaje)),
      });
      await fetchTask(); 
    } catch (e) {
      console.error("Error adding task", e);
    } finally {
      setLoading(false); 
    }
  };

  const updateCarta = async (personaje: IPersonaje) => {
    setLoading(true); // Iniciamos carga
    try {
      await fetch(`${API_URL}/card/${personaje.numero}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "usersecretpasskey": "Sama477355EZ"
        },
        body: JSON.stringify(toApiUpdateCartaMap(personaje)),
      });
      await fetchTask();
      console.log("Carta actualizada con éxito");
    } catch (e) {
      console.error("Error updating card:", e);
    } finally {
      setLoading(false); 
    }
  };

  const deleteCarta = async (numero: number) => {
    setLoading(true); 
    try {
      await fetch(`${API_URL}/card/${numero}`, {
        method: "DELETE",
        headers: { usersecretpasskey: "Sama477355EZ" },
      });
      await fetchTask();
    } catch (e) {
      console.error("Error deleting carta:", e);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-200 via-sky-200 to-amber-300 flex flex-col items-center py-12">
      
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 border-solid mb-4"></div>
          <p className="font-['Cinzel'] font-bold tracking-widest uppercase">Procesando...</p>
        </div>
      )}

      <Routes>
        <Route path='/' element={<Home personajes={personajes} eliminarCarta={deleteCarta} />} />
        <Route path='/Formulario' element={<Formulario agregarCarta={addCarta} cantidadCartas={personajes.length} />} />
        <Route path='/actualizar/:numero' element={<Actualizarcard actualizarCarta={updateCarta} personajes={personajes} />} />
      </Routes>
    </div>
  );
}

export default App;