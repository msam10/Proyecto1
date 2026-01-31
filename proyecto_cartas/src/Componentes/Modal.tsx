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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.83)] flex justify-center items-center p-8">
      <div className="relative w-[400px] h-[640px] bg-linear-to-br from-sky-100 via-amber-100 to-rose-100 
                      rounded-4xl p-8 shadow-2xl text-gray-800 font-['Cinzel'] max-w-full max-h-screen overflow-auto">
        
        <h3 className="text-center text-2xl font-bold mb-4 text-gray-800 tracking-wide drop-shadow-sm">
          {nombre}
        </h3>

     
        <div className="overflow-hidden rounded-2xl shadow-md h-[70%] mb-6">
          <img
            className="w-full h-full object-cover"
            src={imagen}
            alt={nombre}
          />
        </div>

        
        <div className="flex flex-col gap-3 mb-6 text-xl font-bold uppercase tracking-wide">
          <div className="bg-amber-200/90 px-6 py-3 rounded-xl shadow-inner text-center">
            Ataque: {ataque}
          </div>
          <div className="bg-sky-200/90 px-6 py-3 rounded-xl shadow-inner text-center">
            Defensa: {defensa}
          </div>
        </div>

        <div className="text-center space-y-2 text-lg">
          <p><span className="font-semibold">Tipo:</span> {tipo}</p>
          <p><span className="font-semibold">Descripción:</span> {descripcion}</p>
        </div>

       
        <button
          onClick={() => onClose && onClose()}
          className="w-full mt-8 p-3 bg-linear-to-r from-amber-500 to-sky-500 text-white font-bold 
                     rounded-xl shadow-lg hover:shadow-amber-500/50 hover:scale-[1.02] transition-all 
                     text-lg tracking-wide font-['Cinzel']"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
