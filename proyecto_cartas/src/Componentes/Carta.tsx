
type Props = {
  numero: number;
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  onClick?: () => void;
};

function Cartadetalle({
  ataque,
  defensa,
  imagen,
  nombre,
  numero,
  onClick,
}: Props) {
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      <h3 className="text-3xl">
        {nombre} (#{numero})
      </h3>
      <img
        className="w-120 h-125 border-3 border-double rounded-lg border-blue-400"
        src={imagen}
        alt={nombre}
      />

        

      <p className="pl-2 pr-2 pt-5 text-center text-4xl">Ataque:{ataque}</p>
      <p className="pl-2 pr-2 pt-2 text-center text-4xl">Defensa:{defensa}</p>
    </div>
  );
}

export default Cartadetalle;