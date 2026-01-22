interface IDetalle {
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  numero: number;
  descripcion: string;
  tipo: string;
  onClose?: () => void;
}

const Modal = ({ descripcion, tipo, ataque, defensa, imagen, nombre, onClose }: IDetalle) => {
  return (
    <div className="fixed inset-0  bg-[rgba(0,0,0,0.83)] flex justify-center items-center">
      <div className="bg-green-700 p-8 rounded-lg">
        <p>Nombre: {nombre}</p>
        <img
          className="w-100 h-100 border-3 border-dashed rounded-sm border-blue-500"
          src={imagen}
          alt={nombre}
        />
        <p>ataque: {ataque}</p>
        <p>defensa: {defensa}</p>

        <p>descripcion: {descripcion}</p>
        <p>tipo: {tipo}</p>
        <button
          onClick={() => onClose && onClose()}
          className="text-2xl font-bold bg-fuchsia-900 text-white hover:text-blue-600 px-4 py-2 rounded mx-auto place-self-center flex mt-5"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;




