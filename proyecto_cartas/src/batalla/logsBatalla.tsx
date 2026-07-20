import type { IPersonaje } from "../Componentes/interfaces";

type Props = {
 turno: number;
 p1 : IPersonaje;
 p2 : IPersonaje;
 damage: number;
};

function LogBatalla ({ turno , p1,p2,damage }: Props) {
return (
 <div className="flex items-center gap-2 p-2 hover:bg-amber-500/30 transition-all ease-in">
 <p className="text-orange-400 font-bold text-xl">Turno {turno}</p>
 <p className="text-xl">
    P1 ({p1.nombre}) hizo {damage} de daño a P2 ({p2.nombre})
 </p>
 </div>
);
}

export default LogBatalla;