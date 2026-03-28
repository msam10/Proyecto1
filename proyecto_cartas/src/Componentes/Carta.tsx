
type Props = {
  
  numero: number;
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  vida:number;
  onClick?: () => void;
  eliminarCarta:(numero:number)=>void;

};

function Cartadetalle({
  
  ataque,
  defensa,
  imagen,
  nombre,
  numero,
  vida,
  onClick,
  eliminarCarta,
}: Props) {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <h3 className="text-3xl">
        {nombre} (#{numero})
         
      </h3>
      <button onClick={()=>eliminarCarta(numero)}  className="absolute top-5 right-5 z-10 bg-white/90 hover:bg-red-500 hover:text-white 
                           text-red-500 w-9 h-9 rounded-full flex items-center justify-center 
                           shadow-md border border-red-100 transition-all font-bold">X</button>
      <img
        className="w-120 h-125 border-3 border-double rounded-lg border-blue-400"
        src={imagen}
        alt={nombre}
       
      />
       

        

      <p className="pl-2 pr-2 pt-5 text-center text-4xl">Ataque:{ataque}</p>
      <p className="pl-2 pr-2 pt-2 text-center text-4xl">Defensa:{defensa}</p>
      <p className="pl-2 pr-2 pt-2 text-center text-4xl">Vida:{vida}</p>
     
    </div>
  );
}

export default Cartadetalle;