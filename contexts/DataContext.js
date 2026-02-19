import { createContext, useContext, useEffect, useState } from "react";

//ポケモンのデータリスト
const PokemonContext = createContext();
//特性のデータリスト
const AbilityContext = createContext();

export function DataProvider({ children }) {
  const [pokemonData, setPokemonData] = useState([]);
  const [abilityData, setAbilityData] = useState([]);

  useEffect(() => {
    fetch("/data/PokemonDataList.json")
      .then(res => res.json())
      .then(data => setPokemonData(data.map(p => ({ ...p, id: Number(p.id) }))))
      .catch(err => console.error(err));

    fetch("/data/AbilityDataList.json")
      .then(res => res.json())
      .then(setAbilityData)
      .catch(err => console.error(err));
  }, []);

  return (
    <PokemonContext.Provider value={{ pokemonData }}>
      <AbilityContext.Provider value={{ abilityData }}>
        {children}
      </AbilityContext.Provider>
    </PokemonContext.Provider>
  );
}

export function usePokemonData() {
  return useContext(PokemonContext);
}
export function useAbilityData() {
  return useContext(AbilityContext);
}

//※ここを変更した際は_app.jsも確認すること!