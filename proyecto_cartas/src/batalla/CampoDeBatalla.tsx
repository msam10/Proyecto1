import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import type { IPersonaje } from "../Componentes/interfaces";
import Carta from "../Componentes/Carta";
import { GiCrossedSwords, GiSkullCrossedBones, GiShipWheel, GiTreasureMap, GiPirateFlag, GiAnchor, GiWaveCrest, GiCompass } from "react-icons/gi";
type Jugador = "p1" | "p2";

type LogEntry = {
    turno: number;
    atacante: string;
    defensor: string;
    damage: number;
    vidaRestante: number;
    mensaje: string;
    tipoAtaque: string;
};

const FRASES_PIRATAS = {
    ataque: [
        "¡Gomu Gomu no Pistol! 💥",
        "¡Santoryu: Oni Giri! ⚔️",
        "¡Diable Jambe: Flambage Shot! 🔥",
        "¡Mera Mera no Mi: Hiken! 🔥",
        "¡Yami Yami no Mi: Kurouzu! 🌑",
        "¡Ope Ope no Mi: Room! ⭕",
        "¡Gura Gura no Mi: Kaishin! 🌊",
        "¡Haki del Conquistador! ⚡",
        "¡Rokuogan! 💢",
        "¡Bajaré a Marineford con un solo ataque! 💀",
    ],
    victoria: [
        "¡EL REY DE LOS PIRATAS HA NACIDO! 👑",
        "¡El One Piece es real! 🏴‍☠️",
        "¡Zehahaha! ¡La era de los piratas continúa!",
        "¡No hay sueño imposible para un pirata! ☠️",
    ],
    empate: [
        "¡Dos voluntades igual de fuertes! 💪",
        "¡Ninguno cederá hasta alcanzar sus sueños! 🤝",
    ],
    derrota: [
        "¡Un pirata nunca se rinde, volverá más fuerte! 🦾",
        "¡La voluntad de D. nunca muere! ⚔️",
    ]
};

const TIPOS_ATAQUE = [
    { nombre: "Ataque con Haki", icono: "⚡", multiplicador: 1.3 },
    { nombre: "Fruta del Diablo", icono: "🍎", multiplicador: 1.5 },
    { nombre: "Espadazo Pirata", icono: "⚔️", multiplicador: 1.1 },
    { nombre: "Cañonazo", icono: "💣", multiplicador: 1.2 },
    { nombre: "Golpe del Kraken", icono: "🐙", multiplicador: 1.4 },
];

function CampoDeBatalla() {
    const { id1, id2 } = useParams();

    const [carta1, setCarta1] = useState<IPersonaje | null>(null);
    const [carta2, setCarta2] = useState<IPersonaje | null>(null);
    const [carta1Original, setCarta1Original] = useState<IPersonaje | null>(null);
    const [carta2Original, setCarta2Original] = useState<IPersonaje | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reintentos, setReintentos] = useState<number>(0);
    
    const [turno, setTurno] = useState<number>(1);
    const [cartaAtacando, setCartaAtacando] = useState<Jugador | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<Jugador | null>(null);
    const [draw, setDraw] = useState<boolean>(false);
    const [autoBattle, setAutoBattle] = useState<boolean>(false);
    const [ultimoDamage, setUltimoDamage] = useState<number>(0);
    const [animacionAtaque, setAnimacionAtaque] = useState<string>("");
    const [mensajeFlotante, setMensajeFlotante] = useState<string>("");
    const [tipoAtaqueActual, setTipoAtaqueActual] = useState<string>("");
    const timeoutRef = useRef<number | null>(null);
    const maxReintentos = 3;

    // Función para normalizar una carta (asegurar que los números sean números)
    const normalizarCarta = (carta: any): IPersonaje => {
        return {
            ...carta,
            numero: Number(carta.numero) || 0,
            ataque: Number(carta.ataque) || 0,
            defensa: Number(carta.defensa) || 0,
            vida: Number(carta.vida) || 100,
            vidaMaxima: Number(carta.vidaMaxima || carta.vida) || 100,
        };
    };

    const getCarta = async (numero: string): Promise<IPersonaje> => {
        const urlAPI = `https://educapi-v2.onrender.com/card/${numero}`;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const respuesta = await fetch(urlAPI, {
                method: 'GET',
                headers: { usersecretpasskey: "Sama477355EZ" },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}: No se pudo cargar la carta ${numero}`);
            }

            const objeto = await respuesta.json();
            const carta = objeto.data?.[0];
            if (!carta) throw new Error(`No se encontró la carta ${numero}`);
            
            // Normalizar la carta
            return normalizarCarta(carta);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                throw new Error('El Grand Line está muy revuelto. Verifica tu conexión.');
            }
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                throw new Error('¡Tormenta en el Nuevo Mundo! Sin conexión al Grand Line.');
            }
            throw err;
        }
    };

    const cargarCartas = async () => {
        if (!id1 || !id2) {
            setError("¡Faltan los nakamas para la batalla!");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [datosCarta1, datosCarta2] = await Promise.all([
                getCarta(id1),
                getCarta(id2)
            ]);
            
            console.log('Carta 1 cargada:', datosCarta1);
            console.log('Carta 2 cargada:', datosCarta2);
            
            // Guardar originales para reiniciar
            setCarta1Original({...datosCarta1});
            setCarta2Original({...datosCarta2});
            
            setCarta1({...datosCarta1});
            setCarta2({...datosCarta2});
            setReintentos(0);
        } catch (err: any) {
            setError(err.message || "Error al preparar el combate.");
            
            if (reintentos < maxReintentos) {
                setTimeout(() => {
                    setReintentos(prev => prev + 1);
                    cargarCartas();
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCartas();
    }, [id1, id2]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (autoBattle && !gameOver && !cartaAtacando) {
            timeoutRef.current = window.setTimeout(() => {
                realizarAtaque(turno % 2 === 1 ? "p1" : "p2");
            }, 1500);
        }
    }, [autoBattle, turno, gameOver, cartaAtacando]);

    const seleccionarTipoAtaque = (): { nombre: string; icono: string; multiplicador: number } => {
        const random = Math.random();
        if (random < 0.2) return TIPOS_ATAQUE[0];
        if (random < 0.5) return TIPOS_ATAQUE[1];
        if (random < 0.7) return TIPOS_ATAQUE[2];
        if (random < 0.85) return TIPOS_ATAQUE[3];
        return TIPOS_ATAQUE[4];
    };

    const seleccionarFrase = (tipo: 'ataque' | 'victoria' | 'empate' | 'derrota'): string => {
        const frases = FRASES_PIRATAS[tipo];
        return frases[Math.floor(Math.random() * frases.length)];
    };

    const calcularDamage = (atacante: IPersonaje, defensor: IPersonaje, tipoAtaque: { multiplicador: number }): number => {
        const ataqueValor = Number(atacante.ataque) || 0;
        const defensaValor = Number(defensor.defensa) || 0;
        const damageBase = Math.max(1, ataqueValor - defensaValor);
        const variacion = Math.random() * 0.4 - 0.2;
        const damageFinal = Math.max(1, Math.round(damageBase * (1 + variacion) * tipoAtaque.multiplicador));
        console.log(`Daño calculado: ${damageFinal} (Ataque: ${ataqueValor}, Defensa: ${defensaValor})`);
        return damageFinal;
    };

    const verificarGameOver = (cartaActualizada: IPersonaje, jugador: Jugador) => {
        if (cartaActualizada.vida <= 0) {
            setGameOver(true);
            setAutoBattle(false);
            if (jugador === "p1") {
                setWinner("p2");
                setDraw(false);
                setMensajeFlotante(seleccionarFrase('victoria'));
            } else {
                setWinner("p1");
                setDraw(false);
                setMensajeFlotante(seleccionarFrase('victoria'));
            }
            return true;
        }
        return false;
    };

    const realizarAtaque = (atacante: Jugador) => {
        if (!carta1 || !carta2 || gameOver || cartaAtacando) return;

        setCartaAtacando(atacante);

        // Crear copias profundas de las cartas
        const atacanteCarta = JSON.parse(JSON.stringify(atacante === "p1" ? carta1 : carta2));
        const defensorCarta = JSON.parse(JSON.stringify(atacante === "p1" ? carta2 : carta1));

        console.log('Antes del ataque:');
        console.log('Atacante:', atacanteCarta.nombre, 'Vida:', atacanteCarta.vida);
        console.log('Defensor:', defensorCarta.nombre, 'Vida:', defensorCarta.vida);

        const tipoAtaque = seleccionarTipoAtaque();
        const damage = calcularDamage(atacanteCarta, defensorCarta, tipoAtaque);
        
        // Asegurarnos de que la vida sea un número
        const vidaActual = Number(defensorCarta.vida) || 100;
        defensorCarta.vida = Math.max(0, vidaActual - damage);
        
        console.log('Después del ataque:');
        console.log('Defensor:', defensorCarta.nombre, 'Nueva vida:', defensorCarta.vida, 'Daño:', damage);
        
        setUltimoDamage(damage);

        const fraseAtaque = seleccionarFrase('ataque');
        setAnimacionAtaque(atacante);
        setMensajeFlotante(fraseAtaque);
        setTipoAtaqueActual(`${tipoAtaque.icono} ${tipoAtaque.nombre}`);

        setTimeout(() => {
            setAnimacionAtaque("");
            setMensajeFlotante("");
        }, 2000);

        const nuevoLog: LogEntry = {
            turno: turno,
            atacante: atacanteCarta.nombre,
            defensor: defensorCarta.nombre,
            damage: damage,
            vidaRestante: defensorCarta.vida,
            mensaje: fraseAtaque,
            tipoAtaque: tipoAtaque.nombre
        };
        setLogs(prevLogs => [...prevLogs, nuevoLog]);

        // Actualizar la carta correspondiente
        if (atacante === "p1") {
            setCarta2(defensorCarta);
            verificarGameOver(defensorCarta, "p2");
        } else {
            setCarta1(defensorCarta);
            verificarGameOver(defensorCarta, "p1");
        }

        if (atacanteCarta.vida <= 0 && defensorCarta.vida <= 0) {
            setGameOver(true);
            setDraw(true);
            setWinner(null);
            setAutoBattle(false);
            setMensajeFlotante(FRASES_PIRATAS.empate[0]);
        }

        setTimeout(() => {
            setTurno(prev => prev + 1);
            setCartaAtacando(null);
        }, 800);
    };

    const toggleAutoBattle = () => {
        if (gameOver) return;
        setAutoBattle(prev => !prev);
    };

    const reiniciarBatalla = async () => {
        setGameOver(false);
        setWinner(null);
        setDraw(false);
        setTurno(1);
        setLogs([]);
        setCartaAtacando(null);
        setAutoBattle(false);
        setUltimoDamage(0);
        setReintentos(0);
        setMensajeFlotante("");
        setAnimacionAtaque("");
        
        // Restaurar cartas originales si existen
        if (carta1Original && carta2Original) {
            setCarta1({...carta1Original});
            setCarta2({...carta2Original});
        } else {
            await cargarCartas();
        }
    };

    // Función para obtener el porcentaje de vida
    const getPorcentajeVida = (carta: IPersonaje): number => {
        const vidaActual = Number(carta.vida) || 0;
        const vidaMaxima = Number((carta as any).vidaMaxima) || Number(carta1Original?.vida) || 100;
        
        if (vidaActual <= 0 || vidaMaxima <= 0) return 0;
        
        // Si tenemos el daño del último ataque, lo usamos para calcular
        if (ultimoDamage > 0 && vidaActual > 0) {
            return (vidaActual / (vidaActual + ultimoDamage)) * 100;
        }
        
        return (vidaActual / vidaMaxima) * 100;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a] flex items-center justify-center">
                <div className="text-center">
                    <GiShipWheel className="text-8xl text-amber-400 animate-spin mx-auto mb-6" 
                                 style={{ animationDuration: '3s' }} />
                    <h2 className="text-4xl font-bold text-amber-300 mb-4">
                        ¡Zarpando al Grand Line!
                    </h2>
                    <p className="text-amber-200/80 text-xl animate-pulse">
                        Preparando la batalla pirata...
                    </p>
                    {reintentos > 0 && (
                        <div className="mt-4">
                            <GiCompass className="text-4xl text-yellow-400 animate-bounce mx-auto mb-2" />
                            <p className="text-yellow-400">
                                Buscando el camino... ({reintentos}/{maxReintentos})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a] flex items-center justify-center p-4">
                <div className="bg-red-900/40 backdrop-blur-md rounded-xl p-8 max-w-md text-center shadow-2xl border-2 border-red-500/50">
                    <GiSkullCrossedBones className="text-8xl text-red-400 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-red-300 mb-4">
                        ¡Tormenta en el Grand Line!
                    </h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setReintentos(0);
                                cargarCartas();
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg 
                                     hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 w-full 
                                     font-bold text-lg shadow-lg hover:shadow-amber-500/50 transform hover:scale-105
                                     border-2 border-amber-400/50"
                        >
                            <GiShipWheel className="inline mr-2" />
                            ¡Zarpar de Nuevo!
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700 
                                     transition-all duration-300 w-full font-bold border border-gray-500"
                        >
                            <GiAnchor className="inline mr-2" />
                            Volver al Puerto
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a]">
            {/* Fondo decorativo sutil */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Olas en la parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-400 to-transparent"></div>
                    <div className="absolute bottom-8 left-0 right-0 h-8 bg-gradient-to-t from-blue-400 to-transparent"></div>
                </div>
                
                {/* Destellos superiores */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10">
                {!loading && !error && carta1 && carta2 && (
                    <>
                        {/* Banner superior */}
                        <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-900/95 via-yellow-900/90 to-amber-900/95 
                                      backdrop-blur-md border-b-2 border-amber-500/50 shadow-2xl">
                            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GiPirateFlag className="text-3xl text-amber-400" />
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wider">
                                            BATALLA PIRATA
                                        </h1>
                                        <p className="text-amber-200/60 text-xs sm:text-sm">Grand Line • Nuevo Mundo</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="text-center">
                                        <p className="text-amber-400 font-bold text-lg sm:text-xl">Turno {turno}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-xs sm:text-sm border border-green-500/30">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="hidden sm:inline">En el Grand Line</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje flotante de ataque */}
                        {mensajeFlotante && (
                            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                                <div className="bg-gradient-to-r from-amber-900/95 to-yellow-900/95 backdrop-blur-md 
                                              text-amber-200 px-6 py-3 rounded-2xl shadow-2xl border-2 border-amber-500/50 
                                              text-lg sm:text-xl font-bold text-center whitespace-nowrap">
                                    <p className="text-xs sm:text-sm text-amber-400/80 mb-1">{tipoAtaqueActual}</p>
                                    <p>{mensajeFlotante}</p>
                                </div>
                            </div>
                        )}

                        {/* Arena de batalla */}
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            {/* VS Central */}
                            <div className="text-center mb-8">
                                <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-8 py-3 
                                              border-2 border-amber-500/30 shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <GiSkullCrossedBones className="text-3xl sm:text-4xl text-red-400" />
                                        <span className="text-4xl sm:text-5xl font-black text-amber-300 tracking-widest">
                                            VS
                                        </span>
                                        <GiSkullCrossedBones className="text-3xl sm:text-4xl text-blue-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Cartas y controles */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                                {/* Carta 1 */}
                                <div className={`w-full max-w-[280px] sm:max-w-[320px] transition-all duration-500 ${
                                    turno % 2 === 1 && !gameOver ? 'scale-105' : ''
                                } ${animacionAtaque === "p1" ? 'animate-shake' : ''}`}>
                                    <div className="relative">
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                            <div className="bg-red-800/90 backdrop-blur-md text-amber-300 px-4 py-1.5 
                                                          rounded-full border-2 border-red-500/50 shadow-xl text-sm font-bold">
                                                {turno % 2 === 1 ? '⚔️ ATACANDO' : '🛡️ DEFENDIENDO'}
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-2xl 
                                                      shadow-red-500/10">
                                            <Carta
                                                nombre={carta1.nombre}
                                                ataque={carta1.ataque}
                                                defensa={carta1.defensa}
                                                imagen={carta1.imagen}
                                                numero={carta1.numero}
                                                vida={carta1.vida}
                                                tipo={carta1.tipo}
                                                descripcion={carta1.descripcion}
                                                seleccionada={turno % 2 === 1 && !gameOver}
                                            />
                                        </div>
                                        
                                        {/* Barra de vida */}
                                        <div className="mt-3 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-amber-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-amber-300 text-xs sm:text-sm font-bold">❤️ Vida</span>
                                                <span className="text-white font-bold text-sm">{carta1.vida || 0}</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ 
                                                        width: `${getPorcentajeVida(carta1)}%`,
                                                        background: (carta1.vida || 0) > 50 
                                                            ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                                                            : (carta1.vida || 0) > 20 
                                                                ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                                                                : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Controles centrales */}
                                <div className="flex flex-col items-center gap-4 min-w-[160px]">
                                    {!gameOver ? (
                                        <>
                                            <button
                                                onClick={() => realizarAtaque("p1")}
                                                disabled={turno % 2 === 0 || cartaAtacando !== null}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 
                                                         text-amber-200 rounded-xl hover:from-red-700 hover:to-red-800 
                                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all 
                                                         duration-300 font-bold text-sm sm:text-base border-2 border-red-500/50 
                                                         shadow-xl hover:shadow-red-500/30 transform hover:scale-105"
                                            >
                                                <GiCrossedSwords className="inline mr-2" />
                                                ¡ATACAR!
                                                <span className="block text-xs text-amber-400/80 mt-0.5">
                                                    {carta1.nombre}
                                                </span>
                                            </button>

                                            <GiTreasureMap className="text-5xl text-amber-400" />

                                            <button
                                                onClick={() => realizarAtaque("p2")}
                                                disabled={turno % 2 === 1 || cartaAtacando !== null}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-900 
                                                         text-amber-200 rounded-xl hover:from-blue-700 hover:to-blue-800 
                                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all 
                                                         duration-300 font-bold text-sm sm:text-base border-2 border-blue-500/50 
                                                         shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
                                            >
                                                <GiCrossedSwords className="inline mr-2" />
                                                ¡ATACAR!
                                                <span className="block text-xs text-amber-400/80 mt-0.5">
                                                    {carta2.nombre}
                                                </span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center bg-black/50 backdrop-blur-md rounded-2xl p-6 border-2 
                                                      border-amber-500/50 shadow-2xl">
                                            {draw ? (
                                                <>
                                                    <GiWaveCrest className="text-6xl text-yellow-400 mx-auto mb-4 animate-bounce" />
                                                    <p className="text-3xl font-black text-yellow-300 mb-2">
                                                        ¡EMPATE!
                                                    </p>
                                                    <p className="text-yellow-200/80 text-sm">
                                                        {FRASES_PIRATAS.empate[0]}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <GiPirateFlag className="text-6xl text-amber-400 mx-auto mb-4 animate-bounce" />
                                                    <p className="text-3xl font-black text-amber-300 mb-1">
                                                        ¡VICTORIA!
                                                    </p>
                                                    <p className="text-xl font-bold text-white mb-2">
                                                        {winner === "p1" ? carta1.nombre : carta2.nombre}
                                                    </p>
                                                    <p className="text-amber-200/80 text-sm">
                                                        {FRASES_PIRATAS.victoria[0]}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={toggleAutoBattle}
                                        disabled={gameOver}
                                        className={`w-full px-4 py-2.5 rounded-xl font-bold transition-all duration-300 
                                                  text-sm sm:text-base border-2 ${
                                            autoBattle 
                                                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black border-amber-400 shadow-amber-500/30' 
                                                : 'bg-gray-800/80 text-amber-300 border-gray-600 hover:border-amber-500/50'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {autoBattle ? (
                                            <>
                                                <GiShipWheel className="inline mr-2 animate-spin" />
                                                Detener
                                            </>
                                        ) : (
                                            <>
                                                <GiShipWheel className="inline mr-2" />
                                                Auto Batalla
                                            </>
                                        )}
                                    </button>

                                    {gameOver && (
                                        <button
                                            onClick={reiniciarBatalla}
                                            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-800 to-pink-800 
                                                     text-amber-200 rounded-xl hover:from-purple-700 hover:to-pink-700 
                                                     transition-all duration-300 font-bold text-sm sm:text-base border-2 
                                                     border-purple-500/50 shadow-xl hover:shadow-purple-500/30 
                                                     transform hover:scale-105"
                                        >
                                            <GiAnchor className="inline mr-2" />
                                            ¡Nueva Batalla!
                                        </button>
                                    )}
                                </div>
                                
                                {/* Carta 2 */}
                                <div className={`w-full max-w-[280px] sm:max-w-[320px] transition-all duration-500 ${
                                    turno % 2 === 0 && !gameOver ? 'scale-105' : ''
                                } ${animacionAtaque === "p2" ? 'animate-shake' : ''}`}>
                                    <div className="relative">
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                            <div className="bg-blue-800/90 backdrop-blur-md text-amber-300 px-4 py-1.5 
                                                          rounded-full border-2 border-blue-500/50 shadow-xl text-sm font-bold">
                                                {turno % 2 === 0 ? '⚔️ ATACANDO' : '🛡️ DEFENDIENDO'}
                                            </div>
                                        </div>
                                        
                                        <div className="rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl 
                                                      shadow-blue-500/10">
                                            <Carta
                                                nombre={carta2.nombre}
                                                ataque={carta2.ataque}
                                                defensa={carta2.defensa}
                                                imagen={carta2.imagen}
                                                numero={carta2.numero}
                                                vida={carta2.vida}
                                                tipo={carta2.tipo}
                                                descripcion={carta2.descripcion}
                                                seleccionada={turno % 2 === 0 && !gameOver}
                                            />
                                        </div>
                                        
                                        {/* Barra de vida */}
                                        <div className="mt-3 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-blue-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-amber-300 text-xs sm:text-sm font-bold">❤️ Vida</span>
                                                <span className="text-white font-bold text-sm">{carta2.vida || 0}</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ 
                                                        width: `${getPorcentajeVida(carta2)}%`,
                                                        background: (carta2.vida || 0) > 50 
                                                            ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                                                            : (carta2.vida || 0) > 20 
                                                                ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                                                                : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Log de batalla - Diario del Capitán */}
                        <div className="max-w-2xl mx-auto px-4 pb-8">
                            <div className="bg-amber-950/40 backdrop-blur-md rounded-xl border-2 border-amber-700/50 shadow-2xl overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-900/80 to-yellow-900/80 px-6 py-3 border-b border-amber-700/50">
                                    <h3 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
                                        <GiTreasureMap className="text-xl sm:text-2xl" />
                                        Diario del Capitán
                                    </h3>
                                </div>
                                
                                <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
                                    {logs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <GiCompass className="text-4xl sm:text-5xl text-amber-600/50 mx-auto mb-3 animate-spin" 
                                                       style={{ animationDuration: '4s' }} />
                                            <p className="text-amber-300/60 text-base sm:text-lg">
                                                El diario está en blanco... ¡Que comience la aventura!
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {logs.slice().reverse().map((log, index) => (
                                                <div key={index} 
                                                     className="bg-black/30 rounded-lg p-3 border border-amber-500/20 
                                                              hover:border-amber-500/50 transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-amber-400 font-bold text-sm">
                                                            🏴‍☠️ Turno {log.turno}
                                                        </span>
                                                        <span className="text-amber-300/60 text-xs">
                                                            {log.tipoAtaque}
                                                        </span>
                                                    </div>
                                                    <p className="text-amber-200 text-sm">
                                                        <span className="font-bold text-red-400">{log.atacante}</span>
                                                        {" ataca a "}
                                                        <span className="font-bold text-blue-400">{log.defensor}</span>
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-red-400 font-bold">
                                                            -{log.damage} ❤️
                                                        </span>
                                                        <span className={`text-sm font-bold ${
                                                            log.vidaRestante <= 5 ? 'text-red-500' : 'text-green-400'
                                                        }`}>
                                                            Vida: {log.vidaRestante}
                                                        </span>
                                                    </div>
                                                    <p className="text-amber-400/70 text-xs mt-1 italic">
                                                        "{log.mensaje}"
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #b45309, #d97706);
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
}

export default CampoDeBatalla;