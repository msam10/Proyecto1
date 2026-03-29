import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";
import { toApiCartaMap, toApiUpdateCartaMap, toCartaMap, type iApiCarta, type IPersonaje } from "./Componentes/interfaces";
import Actualizarcard from "./Componentes/Edit_carta";

const API_URL = import.meta.env.VITE_PROYECTO_CARTAS_API;

function App() {

  const [personajes, setPersonajes] = useState(personajesDefault)
  const [Loading, setLoading] = useState(false);

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
    try {
      await fetch(`${API_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usersecretpasskey: "Sama477355EZ"
        },
        body: JSON.stringify(toApiCartaMap(personaje)),
      });
      fetchTask();
    } catch (e) {
      console.error("Error adding task", e);
    }}

    const deleteCarta = async (numero: number) => {
        try {
           const listaFiltrada =personajes.filter(personajes => personajes.numero !== numero);
            if (!listaFiltrada) return;  
            await fetch(`${API_URL}/card/${numero}`, {
                method: "DELETE",
                headers: { usersecretpasskey:"Sama477355EZ"},
            });
            fetchTask();
        } catch (e) {
            console.error("Error updating carta:", e);  
        }
    };

const  agregarCarta = (personaje:IPersonaje)=>{
  setPersonajes([...personajes,personaje])
}

const eliminarCarta = (numero:number)=>{
const listaFiltrada =personajes.filter(personajes => personajes.numero !== numero)

setPersonajes(listaFiltrada)

}
  return (
     <div className="min-h-screen bg-linear-to-br from-amber-200 via-sky-200 to-amber-300 flex flex-col items-center py-12">
       <Routes>
     <Route path='/' element={<Home  personajes={personajes} eliminarCarta={deleteCarta} />}/>
     <Route path='/Formulario'element={<Formulario agregarCarta={addCarta}  cantidadCartas={personajes.length}/>}/>
     <Route path='/actualizar/:numero'element={< Actualizarcard actualizarCarta={addCarta} personajes={personajes} />} />
   </Routes>
     
  
    </div>
  );
}

export default App;