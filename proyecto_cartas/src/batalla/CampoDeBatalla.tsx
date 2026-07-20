import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import type { IPersonaje } from "../Componentes/interfaces";
import {
    GiCrossedSwords,
    GiSkullCrossedBones,
    GiShipWheel,
    GiTreasureMap,
    GiPirateFlag,
    GiAnchor,
    GiWaveCrest,
    GiCompass,
    GiHeartBeats,
    GiSwordWound,
    GiShieldBash,
} from "react-icons/gi";
import { FaCrown } from "react-icons/fa";

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
    ],
};

const TIPOS_ATAQUE = [
    { nombre: "Ataque con Haki", icono: "⚡", multiplicador: 1.2 },
    { nombre: "Fruta del Diablo", icono: "🍎", multiplicador: 1.3 },
    { nombre: "Espadazo Pirata", icono: "⚔️", multiplicador: 1.05 },
    { nombre: "Cañonazo", icono: "💣", multiplicador: 1.15 },
    { nombre: "Golpe del Kraken", icono: "🐙", multiplicador: 1.25 },
];

function CampoDeBatalla() {
    const { id1, id2 } = useParams();
    const navigate = useNavigate(); // ✅ Hook de navegación

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
    const [animacionAtaque, setAnimacionAtaque] = useState<string>("");
    const [mensajeFlotante, setMensajeFlotante] = useState<string>("");
    const [tipoAtaqueActual, setTipoAtaqueActual] = useState<string>("");
    const timeoutRef = useRef<number | null>(null);
    const maxReintentos = 3;

    // Normalizar carta (mapeo de campos de la API)
    const normalizarCarta = (carta: unknown): IPersonaje => {
        if (typeof carta !== "object" || carta === null) {
            throw new Error("Carta inválida");
        }
        const c = carta as Record<string, unknown>;
        const attributes = (c.attributes as Record<string, unknown>) || {};
        return {
            numero: Number(c.idCard ?? c.numero) || 0,
            nombre: String(c.name ?? c.nombre ?? "Desconocido"),
            ataque: Number(c.attack ?? c.ataque) || 0,
            defensa: Number(c.defense ?? c.defensa) || 0,
            vida: Number(c.lifePoints ?? c.vida) || 100,
            vidaMaxima: Number(c.lifePoints ?? c.vidaMaxima ?? c.vida) || 100,
            imagen: String(c.pictureUrl ?? c.imagen ?? ""),
            tipo: String(attributes.tipo ?? c.tipo ?? ""),
            descripcion: String(c.description ?? c.descripcion ?? ""),
        };
    };

    const getCarta = async (numero: string): Promise<IPersonaje> => {
        const urlAPI = `https://educapi-v2.onrender.com/card/${numero}`;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const respuesta = await fetch(urlAPI, {
                method: "GET",
                headers: { usersecretpasskey: "Sama477355EZ" },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
            const objeto = await respuesta.json();
            const carta = objeto.data?.[0];
            if (!carta) throw new Error(`No se encontró la carta ${numero}`);
            return normalizarCarta(carta);
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.name === "AbortError")
                    throw new Error("El Grand Line está muy revuelto. Verifica tu conexión.");
                if (err.message.includes("Failed to fetch"))
                    throw new Error("¡Tormenta en el Nuevo Mundo! Sin conexión al Grand Line.");
                throw err;
            }
            throw new Error("Error desconocido al obtener la carta");
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
            const [d1, d2] = await Promise.all([getCarta(id1), getCarta(id2)]);
            setCarta1Original({ ...d1 });
            setCarta2Original({ ...d2 });
            setCarta1({ ...d1 });
            setCarta2({ ...d2 });
            setReintentos(0);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Error al preparar el combate.";
            setError(msg);
            if (reintentos < maxReintentos) {
                setTimeout(() => {
                    setReintentos((prev) => prev + 1);
                    cargarCartas();
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarCartas(); }, [id1, id2]);
    useEffect(() => { return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; }, []);

    useEffect(() => {
        if (autoBattle && !gameOver && !cartaAtacando) {
            timeoutRef.current = window.setTimeout(() => {
                realizarAtaque(turno % 2 === 1 ? "p1" : "p2");
            }, 1500);
        }
    }, [autoBattle, turno, gameOver, cartaAtacando]);

    const seleccionarTipoAtaque = () => {
        const rand = Math.random();
        if (rand < 0.2) return TIPOS_ATAQUE[0];
        if (rand < 0.5) return TIPOS_ATAQUE[1];
        if (rand < 0.7) return TIPOS_ATAQUE[2];
        if (rand < 0.85) return TIPOS_ATAQUE[3];
        return TIPOS_ATAQUE[4];
    };

    const seleccionarFrase = (tipo: keyof typeof FRASES_PIRATAS) =>
        FRASES_PIRATAS[tipo][Math.floor(Math.random() * FRASES_PIRATAS[tipo].length)];

    // Nueva fórmula de daño equilibrada
    const calcularDamage = (
        atacante: IPersonaje,
        defensor: IPersonaje,
        tipoAtaque: { multiplicador: number }
    ): { damage: number; critico: boolean } => {
        const ataque = Number(atacante.ataque) || 1;
        const defensa = Number(defensor.defensa) || 1;
        const vidaMaxDefensor = Number(defensor.vidaMaxima) || 100;

        const ratio = ataque / (ataque + defensa);
        const damageBase = ratio * vidaMaxDefensor * tipoAtaque.multiplicador;

        const variacion = 0.85 + Math.random() * 0.3;
        let damageFinal = damageBase * variacion;

        const critico = Math.random() < 0.1;
        if (critico) damageFinal *= 1.5;

        const damageMinimo = Math.max(1, Math.round(vidaMaxDefensor * 0.01));
        return {
            damage: Math.max(damageMinimo, Math.round(damageFinal)),
            critico,
        };
    };

    const verificarGameOver = (carta: IPersonaje, jugador: Jugador) => {
        if (carta.vida <= 0) {
            setGameOver(true);
            setAutoBattle(false);
            if (jugador === "p1") {
                setWinner("p2");
                setMensajeFlotante(seleccionarFrase("victoria"));
            } else {
                setWinner("p1");
                setMensajeFlotante(seleccionarFrase("victoria"));
            }
            setDraw(false);
            return true;
        }
        return false;
    };

    const realizarAtaque = (atacante: Jugador) => {
        if (!carta1 || !carta2 || gameOver || cartaAtacando) return;
        setCartaAtacando(atacante);

        const atacanteCarta: IPersonaje = JSON.parse(
            JSON.stringify(atacante === "p1" ? carta1 : carta2)
        );
        const defensorCarta: IPersonaje = JSON.parse(
            JSON.stringify(atacante === "p1" ? carta2 : carta1)
        );

        const tipoAtaque = seleccionarTipoAtaque();
        const { damage, critico } = calcularDamage(atacanteCarta, defensorCarta, tipoAtaque);
        defensorCarta.vida = Math.max(0, Number(defensorCarta.vida) - damage);

        const frase = critico
            ? `💥 ¡GOLPE CRÍTICO! ${seleccionarFrase("ataque")}`
            : seleccionarFrase("ataque");

        setAnimacionAtaque(atacante);
        setMensajeFlotante(frase);
        setTipoAtaqueActual(`${tipoAtaque.icono} ${tipoAtaque.nombre}`);

        setTimeout(() => {
            setAnimacionAtaque("");
            setMensajeFlotante("");
        }, 2000);

        const nuevoLog: LogEntry = {
            turno,
            atacante: atacanteCarta.nombre,
            defensor: defensorCarta.nombre,
            damage,
            vidaRestante: defensorCarta.vida,
            mensaje: frase,
            tipoAtaque: critico
                ? `${tipoAtaque.nombre} (Crítico)`
                : tipoAtaque.nombre,
        };
        setLogs((prev) => [...prev, nuevoLog]);

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
            setTurno((prev) => prev + 1);
            setCartaAtacando(null);
        }, 800);
    };

    const toggleAutoBattle = () => {
        if (!gameOver) setAutoBattle((prev) => !prev);
    };

    const reiniciarBatalla = async () => {
        setGameOver(false);
        setWinner(null);
        setDraw(false);
        setTurno(1);
        setLogs([]);
        setCartaAtacando(null);
        setAutoBattle(false);
        setMensajeFlotante("");
        setAnimacionAtaque("");
        if (carta1Original && carta2Original) {
            setCarta1({ ...carta1Original });
            setCarta2({ ...carta2Original });
        } else await cargarCartas();
    };

    const getPorcentajeVida = (carta: IPersonaje) => {
        const actual = Number(carta.vida) || 0;
        const max = Number(carta.vidaMaxima) || 100;
        if (actual <= 0 || max <= 0) return 0;
        return (actual / max) * 100;
    };

    // Componente de carta pirata
    const TarjetaPirata = ({
        carta,
        jugador,
        turnoActual,
    }: {
        carta: IPersonaje;
        jugador: Jugador;
        turnoActual: number;
    }) => {
        const esTurno =
            (jugador === "p1" && turnoActual % 2 === 1) ||
            (jugador === "p2" && turnoActual % 2 === 0);
        const vidaPorcentaje = getPorcentajeVida(carta);
        const colorVida =
            vidaPorcentaje > 50
                ? "bg-green-500"
                : vidaPorcentaje > 20
                    ? "bg-yellow-500"
                    : "bg-red-500";
        const [imgError, setImgError] = useState(false);

        return (
            <div
                className={`relative w-64 sm:w-72 transform transition-all duration-500 ${esTurno && !gameOver ? "scale-105 z-10" : ""
                    } ${animacionAtaque === jugador ? "animate-shake" : ""}`}
            >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div
                        className={`px-3 py-1 rounded-full border-2 text-sm font-bold shadow-lg ${esTurno && !gameOver
                                ? "bg-red-800/90 text-amber-300 border-red-500/50"
                                : "bg-gray-800/80 text-gray-400 border-gray-600"
                            }`}
                    >
                        {esTurno && !gameOver ? "⚔️ ATACANDO" : "🛡️ DEFENDIENDO"}
                    </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-gradient-to-b from-amber-900/80 to-yellow-900/80 backdrop-blur-sm">
                    <div className="h-40 sm:h-48 overflow-hidden relative bg-gray-800">
                        {!imgError && carta.imagen ? (
                            <img
                                src={carta.imagen}
                                alt={carta.nombre}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-b from-amber-800 to-yellow-900">
                                <GiPirateFlag className="text-6xl text-amber-400 opacity-50" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <h3 className="text-white font-bold text-lg truncate">
                                {carta.nombre}
                            </h3>
                        </div>
                    </div>

                    <div className="p-3 space-y-2">
                        <div className="flex justify-between items-center text-xs text-amber-200">
                            <span className="flex items-center gap-1">
                                <GiSwordWound className="text-red-400" /> Ataque
                            </span>
                            <span className="font-bold text-white">{carta.ataque}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-amber-200">
                            <span className="flex items-center gap-1">
                                <GiShieldBash className="text-blue-400" /> Defensa
                            </span>
                            <span className="font-bold text-white">{carta.defensa}</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="flex items-center gap-1 text-xs text-amber-200">
                                    <GiHeartBeats className="text-red-400" /> Vida
                                </span>
                                <span className="font-bold text-white text-xs">
                                    {carta.vida}/{carta.vidaMaxima ?? 100}
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2.5 border border-gray-600 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${colorVida}`}
                                    style={{ width: `${vidaPorcentaje}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // === RENDERIZADO PRINCIPAL ===
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a] flex items-center justify-center">
                <div className="text-center">
                    <GiShipWheel
                        className="text-8xl text-amber-400 animate-spin mx-auto mb-6"
                        style={{ animationDuration: "3s" }}
                    />
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
            <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a] flex items-center justify-center p-4">
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
                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 w-full font-bold text-lg shadow-lg border-2 border-amber-400/50"
                        >
                            <GiShipWheel className="inline mr-2" /> ¡Zarpar de Nuevo!
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 w-full font-bold border border-gray-500"
                        >
                            <GiAnchor className="inline mr-2" /> Volver al Puerto
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0520] via-[#1a1040] to-[#0c2b4a] relative overflow-x-hidden">
            {/* Fondo decorativo */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-400 to-transparent"></div>
                    <div className="absolute bottom-8 left-0 right-0 h-8 bg-gradient-to-t from-blue-400 to-transparent"></div>
                </div>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
            </div>

            <div className="relative z-10">
                {/* Banner superior con botón Menú */}
                <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-900/95 via-yellow-900/90 to-amber-900/95 backdrop-blur-md border-b-2 border-amber-500/50 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center gap-1 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-amber-300 rounded-lg border border-amber-500/30 transition-all duration-200 text-sm font-bold"
                                title="Volver al menú principal"
                            >
                                <GiAnchor className="text-lg" />
                                <span className="hidden sm:inline">Menú</span>
                            </button>
                            <GiPirateFlag className="text-3xl text-amber-400" />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wider">
                                    BATALLA PIRATA
                                </h1>
                                <p className="text-amber-200/60 text-xs sm:text-sm">
                                    Grand Line • Nuevo Mundo
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-amber-400 font-bold text-lg">Turno {turno}</p>
                            <div className="flex items-center gap-2 bg-green-900/60 text-green-400 px-3 py-1 rounded-full text-xs sm:text-sm border border-green-500/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="hidden sm:inline">En el Grand Line</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensaje flotante */}
                {mensajeFlotante && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                        <div className="bg-gradient-to-r from-amber-900/95 to-yellow-900/95 backdrop-blur-md text-amber-200 px-6 py-3 rounded-2xl shadow-2xl border-2 border-amber-500/50 text-lg sm:text-xl font-bold text-center whitespace-nowrap">
                            <p className="text-xs sm:text-sm text-amber-400/80 mb-1">
                                {tipoAtaqueActual}
                            </p>
                            <p>{mensajeFlotante}</p>
                        </div>
                    </div>
                )}

                {/* Arena de batalla */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-8 py-3 border-2 border-amber-500/30 shadow-xl">
                            <div className="flex items-center gap-4">
                                <GiSkullCrossedBones className="text-3xl text-red-400" />
                                <span className="text-4xl sm:text-5xl font-black text-amber-300 tracking-widest">
                                    VS
                                </span>
                                <GiSkullCrossedBones className="text-3xl text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Cartas y controles */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                        {carta1 && (
                            <TarjetaPirata carta={carta1} jugador="p1" turnoActual={turno} />
                        )}

                        <div className="flex flex-col items-center gap-4 min-w-[160px]">
                            {!gameOver ? (
                                <>
                                    <button
                                        onClick={() => realizarAtaque("p1")}
                                        disabled={turno % 2 === 0 || cartaAtacando !== null}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 text-amber-200 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-sm sm:text-base border-2 border-red-500/50 shadow-xl transform hover:scale-105"
                                    >
                                        <GiCrossedSwords className="inline mr-2" /> ¡ATACAR!{" "}
                                        <span className="block text-xs text-amber-400/80">
                                            {carta1?.nombre}
                                        </span>
                                    </button>
                                    <GiTreasureMap className="text-5xl text-amber-400" />
                                    <button
                                        onClick={() => realizarAtaque("p2")}
                                        disabled={turno % 2 === 1 || cartaAtacando !== null}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-amber-200 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-sm sm:text-base border-2 border-blue-500/50 shadow-xl transform hover:scale-105"
                                    >
                                        <GiCrossedSwords className="inline mr-2" /> ¡ATACAR!{" "}
                                        <span className="block text-xs text-amber-400/80">
                                            {carta2?.nombre}
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <div className="text-center bg-black/50 backdrop-blur-md rounded-2xl p-6 border-2 border-amber-500/50 shadow-2xl w-full">
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
                                            <FaCrown className="text-5xl text-amber-400 mx-auto mb-2" />
                                            <p className="text-3xl font-black text-amber-300 mb-1">
                                                ¡VICTORIA!
                                            </p>
                                            <p className="text-xl font-bold text-white">
                                                {winner === "p1" ? carta1?.nombre : carta2?.nombre}
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
                                className={`w-full px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base border-2 ${autoBattle
                                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-black border-amber-400"
                                        : "bg-gray-800/80 text-amber-300 border-gray-600 hover:border-amber-500/50"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {autoBattle ? (
                                    <>
                                        <GiShipWheel className="inline mr-2 animate-spin" /> Detener
                                    </>
                                ) : (
                                    <>
                                        <GiShipWheel className="inline mr-2" /> Auto Batalla
                                    </>
                                )}
                            </button>

                            {gameOver && (
                                <button
                                    onClick={reiniciarBatalla}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-800 to-pink-800 text-amber-200 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-sm sm:text-base border-2 border-purple-500/50 shadow-xl transform hover:scale-105"
                                >
                                    <GiAnchor className="inline mr-2" /> ¡Nueva Batalla!
                                </button>
                            )}
                        </div>

                        {carta2 && (
                            <TarjetaPirata carta={carta2} jugador="p2" turnoActual={turno} />
                        )}
                    </div>
                </div>

                {/* Diario del Capitán */}
                <div className="max-w-2xl mx-auto px-4 pb-8">
                    <div className="bg-amber-950/40 backdrop-blur-md rounded-xl border-2 border-amber-700/50 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-900/80 to-yellow-900/80 px-6 py-3 border-b border-amber-700/50">
                            <h3 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
                                <GiTreasureMap className="text-xl sm:text-2xl" /> Diario del
                                Capitán
                            </h3>
                        </div>
                        <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="text-center py-8">
                                    <GiCompass
                                        className="text-4xl sm:text-5xl text-amber-600/50 mx-auto mb-3 animate-spin"
                                        style={{ animationDuration: "4s" }}
                                    />
                                    <p className="text-amber-300/60 text-base sm:text-lg">
                                        El diario está en blanco... ¡Que comience la aventura!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {logs
                                        .slice()
                                        .reverse()
                                        .map((log, index) => (
                                            <div
                                                key={index}
                                                className="bg-black/30 rounded-lg p-3 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-amber-400 font-bold text-sm">
                                                        🏴‍☠️ Turno {log.turno}
                                                    </span>
                                                    <span className="text-amber-300/60 text-xs">
                                                        {log.tipoAtaque}
                                                    </span>
                                                </div>
                                                <p className="text-amber-200 text-sm">
                                                    <span className="font-bold text-red-400">
                                                        {log.atacante}
                                                    </span>{" "}
                                                    ataca a{" "}
                                                    <span className="font-bold text-blue-400">
                                                        {log.defensor}
                                                    </span>
                                                </p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-red-400 font-bold">
                                                        -{log.damage} ❤️
                                                    </span>
                                                    <span
                                                        className={`text-sm font-bold ${log.vidaRestante <= 5
                                                                ? "text-red-500"
                                                                : "text-green-400"
                                                            }`}
                                                    >
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
            </div>

            <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #b45309, #d97706); border-radius: 3px; }
      `}</style>
        </div>
    );
}

export default CampoDeBatalla;