import Carta from "../Componentes/Carta";
import type { IPersonaje } from "../Componentes/interfaces.ts";
import { useState } from "react";
import { Link } from "react-router";
import { LuSwords, LuX, LuSearch, LuFilter, LuZap, LuArrowLeft } from "react-icons/lu";

type Props = {
    mazo: IPersonaje[];
    loading: boolean;
};

function SeleccionarCartas({ mazo, loading }: Props) {
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<IPersonaje | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<IPersonaje | null>(null);
    const [filtroTipo, setFiltroTipo] = useState<string>("todos");
    const [busqueda, setBusqueda] = useState<string>("");
    const [ordenarPor, setOrdenarPor] = useState<string>("numero");

    // Obtener tipos únicos para el filtro
    const tiposUnicos = Array.from(new Set(mazo.map(carta => carta.tipo)));

    const handleSeleccionarCarta = (carta: IPersonaje) => {
        // Si la carta ya está seleccionada como P1, la deseleccionamos
        if (cartaSeleccionada1?.numero === carta.numero) {
            setCartaSeleccionada1(null);
            return;
        }

        // Si la carta ya está seleccionada como P2, la deseleccionamos
        if (cartaSeleccionada2?.numero === carta.numero) {
            setCartaSeleccionada2(null);
            return;
        }

        // Si no hay P1 seleccionado, lo asignamos
        if (!cartaSeleccionada1) {
            setCartaSeleccionada1(carta);
        } 
        // Si P1 está seleccionado pero no P2
        else if (!cartaSeleccionada2) {
            setCartaSeleccionada2(carta);
        }
        // Si ambos están seleccionados, reemplazamos P2
        else {
            setCartaSeleccionada2(carta);
        }
    };

    const handleIntercambiarCartas = () => {
        if (cartaSeleccionada1 && cartaSeleccionada2) {
            setCartaSeleccionada1(cartaSeleccionada2);
            setCartaSeleccionada2(cartaSeleccionada1);
        }
    };

    const handleLimpiarSeleccion = () => {
        setCartaSeleccionada1(null);
        setCartaSeleccionada2(null);
    };

    // Filtrar y ordenar cartas
    const cartasFiltradas = mazo
        .filter(carta => {
            const coincideTipo = filtroTipo === "todos" || carta.tipo === filtroTipo;
            const coincideBusqueda = carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                   carta.numero.toString().includes(busqueda);
            return coincideTipo && coincideBusqueda;
        })
        .sort((a, b) => {
            switch (ordenarPor) {
                case "ataque":
                    return b.ataque - a.ataque;
                case "defensa":
                    return b.defensa - a.defensa;
                case "vida":
                    return b.vida - a.vida;
                case "nombre":
                    return a.nombre.localeCompare(b.nombre);
                default:
                    return a.numero - b.numero;
            }
        });

    const listoBatalla = cartaSeleccionada1 !== null && cartaSeleccionada2 !== null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold animate-pulse">Cargando cartas del mazo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            
            {/* BOTÓN VOLVER AL MENÚ */}
            <div className="mb-6 flex justify-start relative z-20">
                <Link to="/">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-xl transition-all duration-300 font-bold shadow-lg backdrop-blur-md group">
                        <LuArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Inicio
                    </button>
                </Link>
            </div>

            {/* PANEL DE SELECCIÓN SUPERIOR - Estilo Arena versus */}
            <div className="bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950 backdrop-blur-xl rounded-3xl p-6 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 relative overflow-hidden">
                {/* Detalles de fondo tecnológico/fantástico */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none" />
                
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-8 text-center tracking-wide uppercase">
                    Preparar Duelo
                </h2>
                
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8 relative z-10">
                    
                    {/* Slot P1 (Jugador Azul) */}
                    <div className={`w-full lg:w-[340px] rounded-2xl p-5 transition-all duration-300 relative ${
                        cartaSeleccionada1 
                            ? 'bg-gradient-to-br from-blue-950/40 to-blue-900/10 border border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.2)]' 
                            : 'bg-gray-900/40 border border-dashed border-gray-700 hover:border-gray-600'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-blue-400 font-black text-sm tracking-wider uppercase bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/50">
                                🔵 Jugador 1
                            </span>
                            {cartaSeleccionada1 && (
                                <button
                                    onClick={() => setCartaSeleccionada1(null)}
                                    className="text-gray-400 hover:text-red-400 p-1 hover:bg-gray-800/80 rounded-full transition-all"
                                >
                                    <LuX size={18} />
                                </button>
                            )}
                        </div>

                        {cartaSeleccionada1 ? (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-20 rounded-lg overflow-hidden border border-blue-500/50 flex-shrink-0 bg-gray-950">
                                    <img 
                                        src={cartaSeleccionada1.imagen} 
                                        alt={cartaSeleccionada1.nombre} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-white min-w-0 flex-1">
                                    <p className="font-black text-lg truncate text-blue-100">{cartaSeleccionada1.nombre}</p>
                                    <p className="text-xs text-blue-400/80 font-bold mb-2 uppercase tracking-wide">{cartaSeleccionada1.tipo}</p>
                                    <div className="flex gap-3 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800/80 justify-around">
                                        <span className="font-semibold text-red-400">⚔️ {cartaSeleccionada1.ataque}</span>
                                        <span className="font-semibold text-blue-400">🛡️ {cartaSeleccionada1.defensa}</span>
                                        <span className="font-semibold text-green-400">❤️ {cartaSeleccionada1.vida}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm font-semibold italic">Elige tu primer guerrero...</p>
                            </div>
                        )}
                    </div>

                    {/* VS CENTRAL */}
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-500 to-orange-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                            VS
                        </span>
                    </div>

                    {/* Slot P2 (Jugador Rojo) */}
                    <div className={`w-full lg:w-[340px] rounded-2xl p-5 transition-all duration-300 relative ${
                        cartaSeleccionada2 
                            ? 'bg-gradient-to-br from-red-950/40 to-red-900/10 border border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)]' 
                            : 'bg-gray-900/40 border border-dashed border-gray-700 hover:border-gray-600'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-red-400 font-black text-sm tracking-wider uppercase bg-red-950/60 px-3 py-1 rounded-full border border-red-800/50">
                                🔴 Jugador 2
                            </span>
                            {cartaSeleccionada2 && (
                                <button
                                    onClick={() => setCartaSeleccionada2(null)}
                                    className="text-gray-400 hover:text-red-400 p-1 hover:bg-gray-800/80 rounded-full transition-all"
                                >
                                    <LuX size={18} />
                                </button>
                            )}
                        </div>

                        {cartaSeleccionada2 ? (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-20 rounded-lg overflow-hidden border border-red-500/50 flex-shrink-0 bg-gray-950">
                                    <img 
                                        src={cartaSeleccionada2.imagen} 
                                        alt={cartaSeleccionada2.nombre} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-white min-w-0 flex-1">
                                    <p className="font-black text-lg truncate text-red-100">{cartaSeleccionada2.nombre}</p>
                                    <p className="text-xs text-red-400/80 font-bold mb-2 uppercase tracking-wide">{cartaSeleccionada2.tipo}</p>
                                    <div className="flex gap-3 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-gray-800/80 justify-around">
                                        <span className="font-semibold text-red-400">⚔️ {cartaSeleccionada2.ataque}</span>
                                        <span className="font-semibold text-blue-400">🛡️ {cartaSeleccionada2.defensa}</span>
                                        <span className="font-semibold text-green-400">❤️ {cartaSeleccionada2.vida}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm font-semibold italic">Elige tu contrincante...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción del panel */}
                <div className="flex flex-wrap gap-4 justify-center relative z-10 border-t border-gray-800/80 pt-6">
                    <button
                        onClick={handleIntercambiarCartas}
                        disabled={!listoBatalla}
                        className="px-5 py-2.5 bg-gray-850 hover:bg-gray-800 border border-gray-700 text-gray-250 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:text-white"
                    >
                        🔄 Intercambiar
                    </button>
                    <button
                        onClick={handleLimpiarSeleccion}
                        disabled={!cartaSeleccionada1 && !cartaSeleccionada2}
                        className="px-5 py-2.5 bg-gray-850 hover:bg-gray-800 border border-gray-700 text-gray-250 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:text-red-400"
                    >
                        🗑️ Limpiar
                    </button>
                    <Link 
                        to={listoBatalla ? `/campo-de-batalla/${cartaSeleccionada1?.numero}/${cartaSeleccionada2?.numero}` : '#'}
                        className={listoBatalla ? '' : 'pointer-events-none'}
                    >
                        <button
                            disabled={!listoBatalla}
                            className={`px-8 py-3.5 rounded-xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl ${
                                listoBatalla
                                    ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-orange-500/20 hover:scale-105 active:scale-95'
                                    : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                            }`}
                        >
                            <LuSwords size={22} className={listoBatalla ? 'animate-bounce' : ''} />
                            ¡INICIAR COMBATE!
                        </button>
                    </Link>
                </div>
            </div>

            {/* PANEL DE BÚSQUEDA Y FILTROS */}
            <div className="bg-gray-900/65 backdrop-blur-md rounded-2xl p-5 mb-8 shadow-lg border border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Buscador */}
                    <div className="relative">
                        <LuSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o número..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-950 text-white placeholder-gray-500 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm font-semibold"
                        />
                    </div>

                    {/* Filtro por tipo */}
                    <div className="relative">
                        <LuFilter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-950 text-white rounded-xl border border-gray-800 focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer text-sm font-semibold"
                        >
                            <option value="todos">Todos los elementos</option>
                            {tiposUnicos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ordenador de atributos */}
                    <div className="relative">
                        <LuZap className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={ordenarPor}
                            onChange={(e) => setOrdenarPor(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-950 text-white rounded-xl border border-gray-800 focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer text-sm font-semibold"
                        >
                            <option value="numero">Atributo: Por defecto</option>
                            <option value="ataque">Atributo: Ataque ↑</option>
                            <option value="defensa">Atributo: Defensa ↑</option>
                            <option value="vida">Atributo: Vida ↑</option>
                            <option value="nombre">Atributo: Nombre A-Z</option>
                        </select>
                    </div>

                    {/* Contador de mazo */}
                    <div className="flex items-center justify-center bg-gray-950 rounded-xl border border-gray-800 px-4 py-2.5 text-sm font-semibold">
                        <span className="text-gray-400">
                            Guerreros: <span className="text-white font-black">{cartasFiltradas.length}</span> de {mazo.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* GRILLA DE CARTAS RESPONSIVE */}
            {cartasFiltradas.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800">
                    <p className="text-gray-500 text-xl font-medium">No hay cartas que coincidan con la búsqueda.</p>
                </div>
            ) : (
                /* AJUSTE CLAVE: Reduje a minmax(250px) para que tengan mejor forma de carta */
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                    {cartasFiltradas.map((carta) => {
                        const esSeleccionada1 = cartaSeleccionada1?.numero === carta.numero;
                        const esSeleccionada2 = cartaSeleccionada2?.numero === carta.numero;
                        const estaSeleccionada = esSeleccionada1 || esSeleccionada2;
                        
                        return (
                            <div
                                key={carta.numero}
                                onClick={() => handleSeleccionarCarta(carta)}
                                className={`relative cursor-pointer transition-all duration-300 h-full select-none ${
                                    estaSeleccionada 
                                        ? 'scale-105 -translate-y-1' 
                                        : 'hover:scale-105 hover:-translate-y-1'
                                }`}
                            >
                                {/* Pestaña superior flotante indicando el rol asignado */}
                                {estaSeleccionada && (
                                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 rounded-full px-4 py-1 shadow-lg font-black text-xs tracking-wider text-white ${
                                        esSeleccionada1 
                                            ? 'bg-blue-500 shadow-blue-500/30' 
                                            : 'bg-red-500 shadow-red-500/30'
                                    }`}>
                                        {esSeleccionada1 ? 'JUGADOR 1' : 'JUGADOR 2'}
                                    </div>
                                )}
                                
                                {/* Contenedor de la carta */}
                                <div className={`rounded-[1.2rem] transition-all duration-300 h-full overflow-hidden ${
                                    estaSeleccionada 
                                        ? `ring-4 ${esSeleccionada1 ? 'ring-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)]' : 'ring-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]'} shadow-2xl` 
                                        : 'ring-1 ring-gray-800 hover:ring-gray-600 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)]'
                                }`}>
                                    <Carta 
                                        nombre={carta.nombre}
                                        ataque={carta.ataque}
                                        defensa={carta.defensa}
                                        imagen={carta.imagen}
                                        numero={carta.numero}
                                        vida={carta.vida}
                                        tipo={carta.tipo}
                                        /* ¡BORRÉ DESCRIPCIÓN AQUÍ! Ya no dará error de TS ni romperá el diseño */
                                        seleccionada={estaSeleccionada}
                                    />
                                </div>

                                {/* Filtro de color sutil (overlay) sobre las cartas seleccionadas */}
                                {estaSeleccionada && (
                                    <div className={`absolute inset-0 rounded-[1.2rem] pointer-events-none transition-opacity duration-300 ${
                                        esSeleccionada1 ? 'bg-blue-500/10' : 'bg-red-500/10'
                                    }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BOTÓN FLOTANTE DE BATALLA EN MÓVIL */}
            {listoBatalla && (
                <div className="fixed bottom-6 right-6 md:hidden z-50">
                    <Link to={`/campo-de-batalla/${cartaSeleccionada1?.numero}/${cartaSeleccionada2?.numero}`}>
                        <button className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black rounded-full p-4 shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-transform border-2 border-yellow-300/35">
                            <LuSwords size={28} />
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default SeleccionarCartas;