import { useState } from "react";
import type { IPersonaje } from "../Componentes/interfaces";
import { Link, useParams, useNavigate } from "react-router";

function ActualizarCard({ actualizarCarta, personajes }: { actualizarCarta: (personaje: IPersonaje) => void, personajes: IPersonaje[] }) {
    const parametros = useParams();
    const navigate = useNavigate();
    const id = parametros.numero;

    const personajeEncontrado = personajes.find((p) => p.numero === parseInt(id!));

    const [card, setCard] = useState<IPersonaje>(personajeEncontrado ? personajeEncontrado : {
        nombre: "",
        descripcion: "",
        numero: 0,
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
        let newErrors = { nombre: "", descripcion: "", tipo: "", ataque: "", defensa: "", vida: "", imagen: "" };

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
        // Validación de vida
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

    const handleSubmit = async () => { 
        if (validateCard()) {
            try {
                await actualizarCarta(card); 
                navigate("/"); 
            } catch (error) {
                console.error("No se pudo actualizar:", error);
                alert("Error al guardar los cambios");
            }
        }
    };

    if (!personajeEncontrado) {
        return (
            <div className="flex flex-col items-center p-10">
                <p className="text-gray-500 mb-4 font-bold">No se encontró esa carta</p>
                <Link to="/" className="bg-gray-800 text-white p-3 rounded-xl px-6">Volver al inicio</Link>
            </div>
        );
    }

    const inputBase = "w-full p-3 rounded-2xl bg-amber-100/40 border border-amber-400/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all shadow-sm";
    const labelBase = "text-xs font-bold text-gray-700 uppercase ml-2 mb-1 block";

    return (
        <div className="flex flex-col items-center p-8">
            
            <Link to="/" className="self-start mb-6 text-gray-800 font-bold hover:text-amber-600 transition-all">
                ← VOLVER AL MAZO
            </Link>

            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-4xl p-8 border border-white shadow-xl">
                
                <h2 className="text-2xl font-black text-center mb-8 uppercase italic text-gray-800 tracking-tight">
                    Editar Carta #{card.numero}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="md:col-span-2">
                        <label className={labelBase}>Nombre del Personaje</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            className={inputBase}
                            value={card.nombre}
                            onChange={(e) => setCard({ ...card, nombre: e.target.value })}
                            onFocus={() => setErrors({ ...errors, nombre: "" })}
                        />
                        {errors.nombre && <p className="text-red-500 text-[10px] mt-1 font-bold italic uppercase ml-2">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className={labelBase}>Tipo</label>
                        <input
                            type="text"
                            className={inputBase}
                            value={card.tipo}
                            onChange={(e) => setCard({ ...card, tipo: e.target.value })}
                            onFocus={() => setErrors({ ...errors, tipo: "" })}
                        />
                    </div>

                    <div>
                        <label className={labelBase}>URL Imagen</label>
                        <input
                            type="text"
                            className={inputBase}
                            value={card.imagen}
                            onChange={(e) => setCard({ ...card, imagen: e.target.value })}
                            onFocus={() => setErrors({ ...errors, imagen: "" })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelBase}>Descripción</label>
                        <textarea
                            className={`${inputBase} h-24 resize-none`}
                            value={card.descripcion}
                            onChange={(e) => setCard({ ...card, descripcion: e.target.value })}
                            onFocus={() => setErrors({ ...errors, descripcion: "" })}
                        />
                    </div>

                    <div className="bg-amber-200/70 p-4 rounded-2xl border border-amber-300 shadow-sm">
                        <label className="block text-center text-[10px] font-black uppercase mb-1">Ataque</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-center text-3xl font-bold outline-none"
                            value={card.ataque}
                            onChange={(e) => setCard({ ...card, ataque: Number(e.target.value) })}
                            onFocus={() => setErrors({ ...errors, ataque: "" })}
                        />
                    </div>

                    <div className="bg-sky-200/70 p-4 rounded-2xl border border-sky-300 shadow-sm">
                        <label className="block text-center text-[10px] font-black uppercase mb-1">Defensa</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-center text-3xl font-bold outline-none"
                            value={card.defensa}
                            onChange={(e) => setCard({ ...card, defensa: Number(e.target.value) })}
                            onFocus={() => setErrors({ ...errors, defensa: "" })}
                        />
                    </div>

                  
                    <div className="md:col-span-2 bg-emerald-200/70 p-4 rounded-2xl border border-emerald-300 shadow-sm">
                        <label className="block text-center text-[10px] font-black uppercase mb-1">Puntos de Vida:</label>
                        <input
                            type="number"
                            className="w-full bg-transparent text-center text-3xl font-bold outline-none"
                            value={card.vida}
                            onChange={(e) => setCard({ ...card, vida: Number(e.target.value) })}
                            onFocus={() => setErrors({ ...errors, vida: "" })}
                        />
                        {errors.vida && <p className="text-red-500 text-center text-[10px] font-bold italic uppercase">{errors.vida}</p>}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="md:col-span-2 mt-4 bg-gray-800 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-sky-500 transition-all active:scale-95 shadow-md"
                    >
                        Guardar Cambios
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ActualizarCard;