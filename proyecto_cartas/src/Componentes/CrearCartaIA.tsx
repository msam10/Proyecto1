import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    GiCookingPot,
    GiBubblingFlask,
    GiPirateFlag,
    GiSwordWound,
    GiShieldBash,
    GiHeartBeats,
} from 'react-icons/gi';
import type { IPersonaje } from './interfaces';
import Carta from './Carta';

const INGREDIENTES = [
    { icon: '🍎', texto: 'Fruta del Diablo' },
    { icon: '⚡', texto: 'Haki del Conquistador' },
    { icon: '🗡️', texto: 'Espadachín legendario' },
    { icon: '🏹', texto: 'Tirador de élite' },
    { icon: '🧭', texto: 'Navegante astuto' },
    { icon: '🔧', texto: 'Cyborg modificado' },
    { icon: '🐟', texto: 'Hombre-Pez guerrero' },
    { icon: '🦴', texto: 'Usuario de paramecia' },
    { icon: '🔥', texto: 'Logia ígnea' },
    { icon: '🌪️', texto: 'Zoan mitológica' },
    { icon: '💀', texto: 'Usuario de veneno' },
    { icon: '🎭', texto: 'Manipulador de sombras' },
];

const CalderoPirataIA = () => {
    const navigate = useNavigate();
    const [calderoPrompt, setCalderoPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pirataGenerado, setPirataGenerado] = useState<IPersonaje | null>(null);

    const agregarIngrediente = (texto: string) => {
        setCalderoPrompt(prev => (prev ? prev + '. ' + texto : texto));
        setError(null);
    };

    const cocinarPirata = async () => {
        if (!calderoPrompt.trim()) {
            setError('¡El caldero está vacío! Añade algún ingrediente.');
            return;
        }
        setLoading(true);
        setError(null);
        setPirataGenerado(null);

        try {
            const response = await fetch('https://educapi-v2.onrender.com/ai/generate-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'usersecretpasskey': 'Sama477355EZ',
                },
                body: JSON.stringify({
                    globalContext:
                        'Eres un alquimista del Grand Line que crea tripulantes piratas. A partir de los ingredientes proporcionados, genera un personaje con nombre, imagen, estadísticas equilibradas (ataque, defensa, vida) y una breve historia. Responde en formato JSON con los campos name, attack, defense, lifePoints, pictureUrl, description, attributes.tipo.',
                    cardPrompt: calderoPrompt,
                }),
            });

            if (!response.ok) {
                throw new Error(`Poción fallida: ${response.status}`);
            }

            const data = await response.json();
            const carta: IPersonaje = {
                numero: data.idCard ? Number(data.idCard) : Date.now(),
                nombre: data.name || data.nombre || 'Engendro del caldero',
                ataque: data.attack || data.ataque || 0,
                defensa: data.defense || data.defensa || 0,
                vida: data.lifePoints || data.vida || 100,
                vidaMaxima: data.lifePoints || data.vidaMaxima || data.vida || 100,
                imagen: data.pictureUrl || data.imagen || '',
                tipo: data.attributes?.tipo || data.tipo || 'Desconocido',
                descripcion: data.description || data.descripcion || 'Una creación surgida del caldero maldito.',
            };

            setPirataGenerado(carta);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'El caldero explotó. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const vaciarCaldero = () => {
        setCalderoPrompt('');
        setError(null);
    };

    const bgGradient = 'bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a]';

    return (
        <div className={`min-h-screen ${bgGradient} text-amber-200 overflow-hidden relative`}>
            {/* Fondo decorativo */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-400 to-transparent" />
                    <div className="absolute bottom-8 left-0 right-0 h-8 bg-gradient-to-t from-blue-400 to-transparent" />
                </div>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent" />
            </div>

            {/* Barra superior */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-900/95 via-yellow-900/90 to-amber-900/95 backdrop-blur-md border-b-2 border-amber-500/50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-1.5 bg-black/30 hover:bg-black/50 text-amber-300 rounded-lg border border-amber-500/30 transition-all duration-300 text-sm font-bold"
                    >
                        <GiPirateFlag className="text-lg" />
                        <span className="hidden sm:inline">Mi Flota</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <GiCookingPot className="text-2xl text-amber-400" />
                        <h1 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                            CALDERO PIRATA
                        </h1>
                    </div>
                    <div className="w-16" /> {/* balance */}
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-8">
                <div className="text-center mb-8">
                    <p className="text-amber-200/60 text-sm tracking-[0.2em] uppercase">
                        Mezcla ingredientes y forja un nuevo nakama
                    </p>
                </div>

                <div className="bg-black/40 backdrop-blur-md rounded-2xl border-2 border-amber-500/20 p-6 sm:p-8 shadow-2xl">
                    {/* Ingredientes */}
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-[0.2em] mb-3">
                            <GiBubblingFlask className="text-lg" /> Ingredientes
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {INGREDIENTES.map((ing) => (
                                <button
                                    key={ing.texto}
                                    onClick={() => agregarIngrediente(ing.texto)}
                                    className="px-3 py-1.5 bg-amber-900/30 hover:bg-amber-800/50 border border-amber-500/30 rounded-full text-xs font-bold text-amber-200 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1"
                                >
                                    <span className="text-base">{ing.icon}</span>
                                    <span className="hidden sm:inline">{ing.texto}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt actual */}
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-amber-300 uppercase mb-2">
                            Pócima actual
                        </label>
                        <div className="w-full p-4 bg-black/50 border border-amber-500/30 rounded-xl min-h-[80px] text-amber-100 text-sm leading-relaxed break-words">
                            {calderoPrompt || (
                                <span className="text-gray-500 italic">Añade ingredientes para empezar...</span>
                            )}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-amber-400">
                            <span>{calderoPrompt.length} caracteres</span>
                            <button
                                onClick={vaciarCaldero}
                                disabled={loading || !calderoPrompt.trim()}
                                className="text-red-400 hover:text-red-200 disabled:opacity-40 transition-colors"
                            >
                                Vaciar caldero
                            </button>
                        </div>
                    </div>

                    {/* Botón Cocinar */}
                    <button
                        onClick={cocinarPirata}
                        disabled={loading || !calderoPrompt.trim()}
                        className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all duration-300 ${loading || !calderoPrompt.trim()
                                ? 'bg-gray-800 cursor-not-allowed text-gray-600'
                                : 'bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <GiCookingPot className="text-2xl animate-spin" style={{ animationDuration: '1.5s' }} />
                                Hirviendo la pócima...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <GiCookingPot className="text-2xl" />
                                ¡Cocinar Pirata!
                            </span>
                        )}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm text-center backdrop-blur-sm">
                            💥 {error}
                        </div>
                    )}

                    {/* Resultado */}
                    {pirataGenerado && (
                        <div className="mt-10 pt-8 border-t border-amber-500/20">
                            <h3 className="text-2xl font-black text-center text-amber-300 mb-8 flex items-center justify-center gap-3">
                                <GiPirateFlag className="text-3xl text-amber-400" />
                                ¡Nuevo Nakama!
                                <GiPirateFlag className="text-3xl text-amber-400" />
                            </h3>

                            <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
                                {/* Carta visual */}
                                <div className="mx-auto w-64">
                                    <div className="rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                                        <Carta
                                            nombre={pirataGenerado.nombre}
                                            ataque={pirataGenerado.ataque}
                                            defensa={pirataGenerado.defensa}
                                            vida={pirataGenerado.vida}
                                            imagen={pirataGenerado.imagen}
                                            numero={pirataGenerado.numero}
                                            tipo={pirataGenerado.tipo}
                                            descripcion={pirataGenerado.descripcion}
                                            seleccionada={false}
                                        />
                                    </div>
                                </div>

                                {/* Detalles y acción */}
                                <div className="space-y-5 bg-black/30 rounded-2xl border border-amber-500/20 p-5 backdrop-blur-sm">
                                    <div>
                                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-[0.2em] mb-3">
                                            Estadísticas
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-red-300">
                                                    <GiSwordWound /> Ataque
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 bg-gray-800 rounded-full h-2">
                                                        <div
                                                            className="h-full rounded-full bg-red-500"
                                                            style={{ width: `${Math.min(100, (pirataGenerado.ataque / 200) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-white">{pirataGenerado.ataque}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-blue-300">
                                                    <GiShieldBash /> Defensa
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 bg-gray-800 rounded-full h-2">
                                                        <div
                                                            className="h-full rounded-full bg-blue-500"
                                                            style={{ width: `${Math.min(100, (pirataGenerado.defensa / 200) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-white">{pirataGenerado.defensa}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 text-green-300">
                                                    <GiHeartBeats /> Vida
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 bg-gray-800 rounded-full h-2">
                                                        <div
                                                            className="h-full rounded-full bg-green-500"
                                                            style={{ width: `${((pirataGenerado.vida) / (pirataGenerado.vidaMaxima || 100)) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-white">{pirataGenerado.vida}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-black/40 border border-amber-500/10">
                                        <p className="text-xs text-amber-300 uppercase tracking-wider mb-1">Historia</p>
                                        <p className="text-sm text-amber-100 leading-relaxed italic">
                                            “{pirataGenerado.descripcion}”
                                        </p>
                                    </div>

                                    {/* Botón Ir al Mazo: solo navega, no guarda */}
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 bg-gradient-to-r from-amber-700 to-yellow-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] hover:scale-[1.02]"
                                    >
                                        🏴‍☠️ Ir al Mazo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalderoPirataIA;