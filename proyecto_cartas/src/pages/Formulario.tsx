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
    imagen: "",
  });

  const validateCard = (): boolean => {
    let flag = true;
    let newErrors = { nombre: "", descripcion: "", tipo: "", ataque: "", defensa: "", imagen: "" };

    if (!card.nombre || card.nombre.length < 3) {
      newErrors.nombre = "Mínimo 3 caracteres";
      flag = false;
    }
    if (!card.descripcion) {
      newErrors.descripcion = "La descripción es necesaria";
      flag = false;
    }
    if (card.ataque < 0) {
      newErrors.ataque = "Ataque inválido";
      flag = false;
    }
    if (card.defensa < 0) {
      newErrors.defensa = "Defensa inválida";
      flag = false;
    }
    if (!card.tipo) {
      newErrors.tipo = "El tipo es obligatorio";
      flag = false;
    }
    if (!card.imagen) {
      newErrors.imagen = "URL de imagen obligatoria";
      flag = false;
    }

    setErrors(newErrors);
    return flag;
  };

  const handleSubmit = () => {
    if (validateCard()) {
      agregarCarta(card);
      navigate("/"); // Redirige al home tras crear
    }
  };

  // Clases de estilo constantes
  const inputClass = "w-full bg-white/60 border border-indigo-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400 text-slate-700";
  const labelClass = "text-sm font-bold text-indigo-900 mb-1 block ml-1 uppercase tracking-wider";

  return (
    <div className="w-full max-w-2xl px-4">
      {/* Botón Volver */}
      <Link to="/" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 font-bold mb-6 group transition-all">
        <span className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform mr-3">←</span>
        VOLVER AL INICIO
      </Link>

      {/* Tarjeta del Formulario */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 uppercase italic">
            Nueva Carta
          </h2>
          <div className="h-1 w-20 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre del Personaje</label>
            <input
              type="text"
              placeholder="Ej: Shanks"
              className={inputClass}
              value={card.nombre}
              onChange={(e) => setCard({ ...card, nombre: e.target.value })}
              onFocus={() => setErrors({ ...errors, nombre: "" })}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1 italic">{errors.nombre}</p>}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción / Lore</label>
            <textarea
              placeholder="Habla un poco sobre sus habilidades..."
              className={`${inputClass} h-24 resize-none`}
              value={card.descripcion}
              onChange={(e) => setCard({ ...card, descripcion: e.target.value })}
              onFocus={() => setErrors({ ...errors, descripcion: "" })}
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1 italic">{errors.descripcion}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className={labelClass}>Tipo</label>
            <input
              type="text"
              placeholder="Ej: Pirata"
              className={inputClass}
              value={card.tipo}
              onChange={(e) => setCard({ ...card, tipo: e.target.value })}
              onFocus={() => setErrors({ ...errors, tipo: "" })}
            />
            {errors.tipo && <p className="text-red-500 text-xs mt-1 italic">{errors.tipo}</p>}
          </div>

          {/* Imagen URL */}
          <div>
            <label className={labelClass}>Imagen (URL)</label>
            <input
              type="text"
              placeholder="https://..."
              className={inputClass}
              value={card.imagen}
              onChange={(e) => setCard({ ...card, imagen: e.target.value })}
              onFocus={() => setErrors({ ...errors, imagen: "" })}
            />
            {errors.imagen && <p className="text-red-500 text-xs mt-1 italic">{errors.imagen}</p>}
          </div>

          {/* Estadísticas en contenedores destacados */}
          <div className="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-100 group">
            <label className={labelClass}>🔥 Ataque</label>
            <input
              type="number"
              className={`${inputClass} text-center font-bold text-lg`}
              value={card.ataque}
              onChange={(e) => setCard({ ...card, ataque: Number(e.target.value) })}
            />
          </div>

          <div className="bg-sky-600/5 p-4 rounded-2xl border border-sky-100">
            <label className={labelClass}>🛡️ Defensa</label>
            <input
              type="number"
              className={`${inputClass} text-center font-bold text-lg`}
              value={card.defensa}
              onChange={(e) => setCard({ ...card, defensa: Number(e.target.value) })}
            />
          </div>

          {/* Botón Final */}
          <div className="md:col-span-2 mt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 transform transition hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
            >
              ¡Añadir a la Tripulación!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Formulario;