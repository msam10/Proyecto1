


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
    <div className="flex flex-col items-center" onClick={() => mostrarDetalle()}>
    <h3 className="text-3xl">
        {nombre} (#{numero})
    </h3>
    <img className="w-90 h-90 border-3 border-dashed rounded-sm border-blue-500" src={imagen} alt={nombre} />
 
     <p className="pl-5 pr-5  text-center text-2xl" >Ataque:{ataque}</p>
      <p className="pl-5 pr-5 text-center text-2xl" >Defensa:{defensa}</p>
       <p className="pl-5 pr-5 text-center text-2xl" >Descripcion:{descripcion}</p>
      <p className="pl-5 pr-5 text-center text-2xl">Tipo:{tipo}</p>

    </div>
 )
}

export default Cartadetalle;