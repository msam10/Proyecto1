import { useState } from "react";
import type { IPersonaje } from "../Componentes/interfaces";
import { Link, useNavigate } from "react-router";

function Formulario({ agregarCarta, cantidadCartas }: { agregarCarta: (personaje: IPersonaje) => void, cantidadCartas: number }) {
  const navigate = useNavigate();
  const [card, setCard] = useState<IPersonaje>({
    nombre: "",
    descripcion: "",
    numero: cantidadCartas + 1,
    tipo: "",
    ataque: 0,
    defensa: 0,
    imagen: "",
    vida: 100, 
  });

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    ataque: "",
    defensa: "",
    vida: "",
    imagen: "",
  });

  const validateCard = (): boolean => {
    let flag = true;
    const newErrors = { nombre: "", descripcion: "", tipo: "", ataque: "", defensa: "", vida: "", imagen: "" };

    if (!card.nombre || card.nombre.length < 3) {
      newErrors.nombre = "Mínimo 3 caracteres";
      flag = false;
    }
    if (!card.descripcion) {
      newErrors.descripcion = "La descripción es necesaria";
      flag = false;
    }
    if (card.ataque < 0) {
      newErrors.ataque = "Valor inválido";
      flag = false;
    }
    if (card.defensa < 0) {
      newErrors.defensa = "Valor inválido";
      flag = false;
    }
  
    if (card.vida <= 0) {
      newErrors.vida = "Debe ser mayor a 0";
      flag = false;
    }
    if (!card.tipo) {
      newErrors.tipo = "El tipo es obligatorio";
      flag = false;
    }
    if (!card.imagen) {
      newErrors.imagen = "URL obligatoria";
      flag = false;
    }

    setErrors(newErrors);
    return flag;
  };

  const handleSubmit = () => {
    if (validateCard()) {
      agregarCarta(card);
      navigate("/");
    }
  };

  const inputBase = "w-full p-3 rounded-2xl bg-amber-100/40 border border-amber-400/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all shadow-sm";
  const labelBase = "text-xs font-bold text-gray-700 uppercase ml-2 mb-1 block";

  return (
    <div className="flex flex-col items-center p-8">
      
      <Link to="/" className="self-start mb-6 text-gray-800 font-bold hover:text-amber-600 transition-all">
        ← VOLVER AL MAZO
      </Link>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-4xl p-8 border border-white shadow-xl">
        
        <h2 className="text-2xl font-black text-center mb-8 uppercase italic text-gray-800 tracking-tight">
          Nueva Carta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="md:col-span-2">
            <label className={labelBase}>Nombre del Personaje</label>
            <input
              type="text"
              placeholder="Ej: Luffy"
              className={inputBase}
              value={card.nombre}
              onChange={(e) => setCard({ ...card, nombre: e.target.value })}
            />
            {errors.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase ml-2">{errors.nombre}</p>}
          </div>

          <div>
            <label className={labelBase}>Tipo</label>
            <input
              type="text"
              placeholder="Clase"
              className={inputBase}
              value={card.tipo}
              onChange={(e) => setCard({ ...card, tipo: e.target.value })}
            />
          </div>

          <div>
            <label className={labelBase}>URL Imagen</label>
            <input
              type="text"
              placeholder="Link de imagen"
              className={inputBase}
              value={card.imagen}
              onChange={(e) => setCard({ ...card, imagen: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelBase}>Descripción</label>
            <textarea
              placeholder="Habilidades o historia..."
              className={`${inputBase} h-24 resize-none`}
              value={card.descripcion}
              onChange={(e) => setCard({ ...card, descripcion: e.target.value })}
            />
          </div>

          <div className="bg-amber-200/70 p-4 rounded-2xl border border-amber-300 shadow-sm">
            <label className="block text-center text-[10px] font-black uppercase mb-1">Ataque</label>
            <input
              type="number"
              className="w-full bg-transparent text-center text-3xl font-bold outline-none"
              value={card.ataque}
              onChange={(e) => setCard({ ...card, ataque: Number(e.target.value) })}
            />
          </div>

          <div className="bg-sky-200/70 p-4 rounded-2xl border border-sky-300 shadow-sm">
            <label className="block text-center text-[10px] font-black uppercase mb-1">Defensa</label>
            <input
              type="number"
              className="w-full bg-transparent text-center text-3xl font-bold outline-none"
              value={card.defensa}
              onChange={(e) => setCard({ ...card, defensa: Number(e.target.value) })}
            />
          </div>

      
          <div className="md:col-span-2 bg-emerald-200/70 p-4 rounded-2xl border border-emerald-300 shadow-sm">
            <label className="block text-center text-[10px] font-black uppercase mb-1">Puntos de Vida:</label>
            <input
              type="number"
              className="w-full bg-transparent text-center text-3xl font-bold outline-none"
              value={card.vida}
              onChange={(e) => setCard({ ...card, vida: Number(e.target.value) })}
            />
            {errors.vida && <p className="text-red-500 text-center text-[10px] font-bold italic uppercase">{errors.vida}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="md:col-span-2 mt-4 bg-gray-800 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all active:scale-95 shadow-md"
          >
            Añadir al Mazo
          </button>

        </div>
      </div>
    </div>
  );
}

export default Formulario;