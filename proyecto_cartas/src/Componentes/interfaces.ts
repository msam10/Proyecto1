export interface IPersonaje {
    nombre: string;
    ataque: number;
    defensa: number;
    imagen: string;
    numero: number;
    descripcion: string;
    tipo: string;
    vida: number;
    vidaMaxima?: number;

}


export interface iApiCarta {
    "idCard": string,
    "name": string,
    "description": string,
    "attack": number,
    "defense": number,
    "lifePoints": number,
    "pictureUrl": string,
    "attributes": {
        tipo?: string
    },
    "userSecret": string,
    "createdAt": string,
    "updatedAt": string | null
}

export const toApiCartaMap = (personaje: IPersonaje): iApiCarta => ({
    idCard: personaje.numero.toString(),
    name: personaje.nombre,
    description: personaje.descripcion,
    attack: personaje.ataque,
    defense: personaje.defensa,
    lifePoints: personaje.vida,
    pictureUrl: personaje.imagen,
    attributes: {
        tipo: personaje.tipo
    },
    userSecret: "Sama477355EZ",
    createdAt: new Date().toISOString(),
    updatedAt: null,


})

export const toApiUpdateCartaMap = (personaje: IPersonaje): Omit<iApiCarta, "idCard"> => ({
    name: personaje.nombre,
    description: personaje.descripcion,
    attack: personaje.ataque,
    defense: personaje.defensa,
    lifePoints: personaje.vida,
    pictureUrl: personaje.imagen,
    attributes: {
        tipo: personaje.tipo
    },
    userSecret: "Sama477355EZ",
    createdAt: new Date().toISOString(),
    updatedAt: null,


})

export const toCartaMap = (apiCard: iApiCarta): IPersonaje => ({

    numero: parseInt(apiCard.idCard),
    nombre: apiCard.name,
    descripcion: apiCard.description,
    ataque: apiCard.attack,
    defensa: apiCard.defense,
    vida: apiCard.lifePoints,
    imagen: apiCard.pictureUrl,
    tipo: apiCard.attributes.tipo || "",

}
)