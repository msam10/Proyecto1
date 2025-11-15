

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
    <div className="flex flex-col items-center bg-red-700 border-4 rounded-lg w-90 font-mono text-orange-100">
    <h3>
        {nombre} (#{numero})
    </h3>
    <img className="w-80 h-80 border-3 border-dashed rounded-sm border-blue-500" src={imagen} alt={nombre} />
 
     <p className="pl-5 pr-5 " >ataque:{ataque}</p>
      <p className="pl-5 pr-5" >defensa:{defensa}</p>
      <p  className="pl-5 pr-5" >descripcion:{descripcion}</p>
      <p className="pl-5 pr-5">tipo:{tipo}</p>

    </div>
 )
}

export default Cartadetalle;