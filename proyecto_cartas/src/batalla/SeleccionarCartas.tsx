
import Carta from "../Componentes/Carta";
import type { IPersonaje } from "../Componentes/interfaces.ts";
import { useState } from "react";
import { Link } from "react-router";
import { LuSwords } from "react-icons/lu";

type Props = {
    mazo: IPersonaje[];
    loading: boolean;
};


function SeleccionarCartas({ mazo, loading }: Props) {

    const [cartaSeleccionada1, setCartaSeleccionada1] =
        useState<IPersonaje | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] =
        useState<IPersonaje | null>(null);
    const [listoBatalla, setListoBatalla] = useState<Boolean>(false);

    const handleSeleccionarCarta = (carta : IPersonaje) => {
        const isSelected1 = cartaSeleccionada1?.numero === carta.numero;
        const isSelected2 = cartaSeleccionada2?.numero === carta.numero;

        if (isSelected1) {
            setCartaSeleccionada1(null);
            setListoBatalla(false);
            return;
        }

        if (isSelected2) {
            setCartaSeleccionada2(null);
            setListoBatalla(false);
            return;
        }

        if(!cartaSeleccionada1){
            setCartaSeleccionada1(carta);
            if (!cartaSeleccionada2) setListoBatalla(true);
            }else if (!cartaSeleccionada2) {
                setCartaSeleccionada2(carta);
                setListoBatalla(true);
        }
    };

 return (
<div>
    {!loading && 
      mazo && 
      mazo.map((carta) => {
        return (
            <div 
            onClick={() => {
                handleSeleccionarCarta(carta);
            }}
            key={carta.numero}
            >
            <Carta 
                nombre={carta.nombre}
                ataque={carta.ataque}
                defensa={carta.defensa}
                imagen={carta.imagen}
                numero={carta.numero}
                vida={carta.vida}
                tipo={carta.tipo}
                descripcion={carta.descripcion}
            seleccionada={
                cartaSeleccionada1?.numero === carta.numero ||
                cartaSeleccionada2?.numero === carta.numero
            }
            
            />
      <Link to={`/campo-de-batalla/${cartaSeleccionada1?.numero}/${cartaSeleccionada2?.numero}`}>
        <button
            className= 'rounded-full'
            onClick={() => {}}
            disabled={!listoBatalla}
        >
            <LuSwords size={28}/>

        </button>
      </Link>
            </div>
        );
      })}
      
</div>
)


    
}

export default SeleccionarCartas;

