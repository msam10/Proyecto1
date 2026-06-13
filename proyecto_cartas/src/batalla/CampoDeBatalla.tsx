import { useParams } from "react-router";
import { useState } from "react-router";
import SeleccionarCartas from "./batalla/SeleccionarCartas";


function CampoDeBatalla () {
    const {id1, id2} = useParams();
     const [carta1, setCarta1] = useState<Carta  |null>(null);
    const [carta2, setCarta2] = useState<Carta | null>(null);
    const [loading, setLoading] = useState<boolean>(null);
    const [error, setError] = useState<string | null>(null);

    const getCarta = async (id:string) : Promise<Carta> => {
        const urlAPI = 'htt';




    }




 }










export default CampoDeBatalla;