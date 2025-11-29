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
    <div className="flex flex-col items-center">
    <h3>
        {nombre} (#{numero})
    </h3>
    <img className="w-80 h-80 border-3 border-dashed rounded-sm border-blue-500" src={imagen} alt={nombre} />
 
     <p className="pl-5 pr-5  text-center" >ataque:{ataque}</p>
      <p className="pl-5 pr-5 text-center" >defensa:{defensa}</p>
      <p  className="pl-5 pr-5 text-center" >descripcion:{descripcion}</p>
      <p className="pl-5 pr-5 text-center">tipo:{tipo}</p>

    </div>
 )
}

export default Cartadetalle;