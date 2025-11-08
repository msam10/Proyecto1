

type Props = {
numero : number;
nombre : string;
tipo : string;
ataque :number;
defensa : number;
descripcion : string;
imagen : string;
};

function Cartadetalle ({
ataque,
defensa,
descripcion,
imagen,
nombre,
numero,
tipo,
}: Props 
) {
 return (
    <div>
    <h3>
        {nombre} (#{numero})
    </h3>
    <img src={imagen} alt={nombre} />
     <p>ataque:{ataque}</p>
      <p>defensa:{defensa}</p>
      <p>descripcion:{descripcion}</p>
      <p>tipo:{tipo}</p>

    </div>
 )
}

export default Cartadetalle;