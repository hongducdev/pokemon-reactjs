import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

import PokemonCollection from "./components/PokemonCollection";
import { Pokemon, Detail } from "./interface";

interface Pokemons {
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [pokemon, setPokemons] = useState<Pokemon[]>([]);
  const [nextURL, setNextURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id:0,
    isOpened:false,
  })
  useEffect(() => {
    const getPokemons = async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20"
      );
      setNextURL(res.data.next);
      res.data.results.forEach(async(pokemon:Pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);

        setPokemons((p) => [...p, poke.data]);
        setLoading(false);
      })
    };
    getPokemons();
  }, []);

  const nextPage = async () => {
    let res = await axios.get(nextURL);
    setNextURL(res.data.next);
    res.data.results.forEach(async(pokemon:Pokemons) => {
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      setPokemons((p) => [...p, poke.data]);
      setLoading(false);
    })
  }

  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">Pokemon</header>
        <PokemonCollection pokemons={pokemon} viewDetail={viewDetail} setDetail={setDetail} />
        {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={nextPage}>
              {loading ? "Loading..." : "Load More"}{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
