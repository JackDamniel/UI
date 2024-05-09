import axios from "axios";


interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  }
  
  interface Origin {
    name: string;
    url: string;
  }
  
  interface Location {
    name: string;
    url: string;
  }
  
 export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: Origin;
    location: Location;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }
  
 export interface RickAndMortyApiResponse {
    info: Info;
    results: Character[];
  }


export type Characters = Character[];

async function fetchData() {
    const {data} = await axios.get<RickAndMortyApiResponse>("https://rickandmortyapi.com/api/character");
    return data.results;
}

export default fetchData;
    
