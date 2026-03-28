import { Link } from "react-router";

interface IDetalle {
  nombre: string;
  ataque: number;
  defensa: number;
  imagen: string;
  numero: number;
  descripcion: string;
  tipo: string;
  vida: number;
  onClose?: () => void;
}

const Modal = ({ descripcion, numero, tipo, ataque, defensa, imagen, nombre, vida, onClose }: IDetalle) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.83)] flex justify-center items-center p-8 z-50">
      
      <div className="relative w-[400px] max-h-[90vh] h-[640px] bg-linear-to-br from-sky-100 via-amber-100 to-rose-100 
                      rounded-4xl p-8 shadow-2xl text-gray-800 font-['Cinzel'] 
                      overflow-y-auto flex flex-col
                      scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-transparent">
        
        <h3 className="text-center text-2xl font-black mb-4 text-gray-800 tracking-wide drop-shadow-sm uppercase">
          {nombre}
        </h3>
      
        <div className="overflow-hidden rounded-2xl shadow-md h-[45%] min-h-[250px] mb-4 border-2 border-white/50 shrink-0 bg-white/20 flex items-center justify-center">
          <img
            className="w-full h-full object-contain p-2"
            src={imagen}
            alt={nombre}
          />
        </div>

        <div className="flex flex-col gap-2 mb-4 shrink-0">
          <div className="flex gap-2 w-full">
            <div className="flex-1 bg-amber-200/90 py-2 rounded-xl shadow-inner text-center font-bold text-sm border border-amber-300">
              ATAQUE: {ataque}
            </div>
            <div className="flex-1 bg-sky-200/90 py-2 rounded-xl shadow-inner text-center font-bold text-sm border border-sky-300">
              DEFENSA: {defensa}
            </div>
          </div>
          <div className="w-full bg-emerald-200/90 py-2 rounded-xl shadow-inner text-center font-bold text-sm border border-emerald-300 uppercase">
              Vida: {vida} 
          </div>
        </div>

        <div className="flex-1 text-center space-y-2 mb-6 px-2">
          <p className="uppercase text-sm"><span className="font-black text-amber-700">Tipo:</span> {tipo}</p>
          <p className="leading-relaxed text-sm"><span className="font-black text-amber-700">Descripción:</span> {descripcion}</p>
        </div>

        <div className="flex flex-col gap-3 mt-auto shrink-0">
          <button
            onClick={() => onClose && onClose()}
            className="w-full p-2.5 bg-gray-800 text-white font-bold 
                       rounded-xl shadow-lg hover:bg-gray-700 transition-all 
                       cursor-pointer text-center uppercase tracking-widest text-xs"
          >
            Cerrar
          </button> 

          <Link 
            to={`/actualizar/${numero}`} 
            className="w-full p-2.5 bg-linear-to-r from-amber-500 to-rose-500 text-white font-bold 
                       rounded-xl shadow-lg hover:scale-[1.02] transition-all 
                       text-center uppercase tracking-widest text-xs inline-block"
          >
            Editar Personaje
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Modal;