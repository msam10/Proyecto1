
import { useState } from "react";
import Cartadetalle from "./Componentes/Carta";
import Modal from "./Componentes/Modal";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";


export interface IPersonaje {
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  numero: number;
  descripcion: string;
  tipo: string;
  vida:number;

}

const personajesDefault: IPersonaje[] = [
  {
    nombre: "LUFFY",
    ataque: 4500,
    defensa: 3200,
    imagen:
      "https://preview.redd.it/what-makes-luffy-such-a-likable-protagonist-v0-lhdd2872qurb1.jpg?width=320&crop=smart&auto=webp&s=214ccf69b93d7c4ce7001b19c9d1bbd12ec98ba2",
    numero: 1,
    descripcion: "Rey de los piratas.",
    tipo: "Fruta del diablo",
    vida:100,
      
  },
  {
    nombre: "ZORO",
    ataque: 3800,
    defensa: 2900,
    imagen: "https://i.pinimg.com/474x/75/f7/92/75f792d473b4fa7e087940be1032bf3b.jpg",
    numero: 2,
    descripcion: "Mejor espadachin del mundo.",
    tipo: "Espadachin",
    vida:100,
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
    vida:100,
  },
  {
    nombre: "AOKIJI",
    ataque: 4100,
    defensa: 3600,
    imagen: "https://i.pinimg.com/1200x/0d/8d/f7/0d8df738229467a385b9441026b4f660.jpg",
    numero: 4,
    descripcion: "Ex-almirante de la marina.",
    tipo: "Fruta del diablo",
    vida:100,
  },
];



function App() {

  const [personajes, setPersonajes] = useState(personajesDefault)

 
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
     <Route path='/' element={<Home  personajes={personajes}/>}/>
     <Route path='/Formulario'element={<Formulario agregarCarta={agregarCarta} cantidadCartas={personajes.length}/>}/>
      

   </Routes>
     
  
    </div>
  );
}

export default App;