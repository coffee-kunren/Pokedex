import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePokemonData, useAbilityData } from "@/contexts/DataContext";
import Link from "next/link";

const typeColors = {
  "ノーマル": "#A8A878", "ほのお": "#F08030", "みず": "#6890F0",
  "でんき": "#F8D030", "くさ": "#78C850", "こおり": "#98D8D8",
  "かくとう": "#C03028", "どく": "#A040A0", "じめん": "#E0C068",
  "ひこう": "#A890F0", "エスパー": "#F85888", "むし": "#A8B820",
  "いわ": "#B8A038", "ゴースト": "#705898", "ドラゴン": "#7038F8",
  "あく": "#705848", "はがね": "#B8B8D0", "フェアリー": "#EE99AC"
};
const statusColors = {
  "HP": "#22C55E", "こうげき": "#EF4444", "ぼうぎょ": "#3B82F6",
  "とくこう": "#A855F7", "とくぼう": "#14B8A6", "すばやさ": "#EAB308"
};


//メイン表示
export default function ImageDetail() {
  const { pokemonData } = usePokemonData();//ポケモンデータ取得
  const { abilityData } = useAbilityData();//特性データ取得
  const router = useRouter();
  const { id } = router.query;//URLの"id"パラメータを取得
  const currentId = Number(id);

  //フォルム違い用
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);

  const pokemon = pokemonData?.find((p) => p.id === currentId);

  useEffect(() => {
    //データがまだ準備できていない時用(エラーにならないように)
    if (!pokemon) return;

    //同ポケモンのフォーム一覧を作成
    const allForms = pokemonData
      .filter(p => p.name === pokemon.name)
      .sort((a, b) => Number(a.origin_id) - Number(b.origin_id));

    setForms(allForms);
    setCurrentForm(pokemon);
  }, [id, pokemonData, pokemon]);

  //idの読み込み待ち
  if (!pokemon || !currentForm) return;

  const maxId = Math.max(...pokemonData.map(p => p.id));
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < maxId ? currentId + 1 : null;

  return (
    <div className="min-h-screen flex justify-center p-4">
      <main className="flex flex-col w-full max-w-6xl">
        <div className="relative inline-block">
          <img
            src="images/img/title_frame.svg"
            className="w-70 h-auto object-contain"
          />
          <h1 className="absolute text-3xl font-bold left-13 top-2.5 bg-white">ポケモン詳細</h1>
        </div>
        <div className="inline-block">
          <Link href="/" className="inline-flex text-xs border border-gray-300 rounded-md p-2 m-4 shadow shadow-gray-400 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left mr-2 size-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            ポケモン図鑑に戻る
          </Link>
        </div>
        <div className="flex justify-between p-4">
          <div className="inline-block">
            {prevId && (
              <Link href={`/${prevId}`} className="inline-flex text-xs border border-gray-300 rounded-md p-2 shadow shadow-gray-400 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-left mr-1 size-4"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                前のポケモン
              </Link>
            )}
          </div>
          <div className="inline-block">
            {nextId && (
              <Link href={`/${nextId}`} className="inline-flex text-xs border border-gray-300 rounded-md p-2 shadow shadow-gray-400 hover:bg-gray-100">
                次のポケモン
                <svg xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-chevron-right ml-1 size-4"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </Link>
            )}
          </div>
        </div>
        <BaseData
          pokemon={currentForm}
          forms={forms}
          currentForm={currentForm}
          setCurrentForm={setCurrentForm}
        />
        <StatusData
          pokemon={currentForm}
        />
        <AbilityData
          pokemon={currentForm}
          abilityData={abilityData}
        />
      </main>
    </div>
  );
}

//基本(画像・タイプ等)の表示
function BaseData({ pokemon, forms, currentForm, setCurrentForm }) {
  const [viewMode, setViewMode] = useState("normal");

  return (
    <div className="p-6 m-4 space-y-2 border border-gray-300 rounded-2xl flex flex-col justify-center items-center text-center shadow shadow-gray-400">
      {/* No. */}
      <p className="text-sm text-gray-600 mb-0">No.{pokemon.origin_id}</p>
      {/* 名前 */}
      <h1 className="text-3xl font-bold mb-0">{pokemon.name}</h1>
      {/* 分類 */}
      <p className="text-sm text-gray-600 mb-2">{pokemon["分類"]}</p>
      {/* タイプ */}
      <div className="flex gap-2 text-xs">
        <span className="text-white px-3 py-1 rounded-xl"
          style={{ backgroundColor: typeColors[pokemon["タイプ1"]] }}>
          {pokemon["タイプ1"]}
        </span>
        {pokemon["タイプ2"] && (
          <span className="text-white px-3 py-1 rounded-xl"
            style={{ backgroundColor: typeColors[pokemon["タイプ2"]] }}>
            {pokemon["タイプ2"]}
          </span>
        )}
      </div>
      {/* 高さ・重さ */}
      <div className="flex gap-5 mb-8">
        <p className="text-sm text-gray-600 mb-0">
          高さ：
          {pokemon["高さ"] ? Number(pokemon["高さ"]).toFixed(1) : "??.?"}
          {pokemon["form_name"]?.includes("キョダイマックス") && "～"}
          m
        </p>
        <p className="text-sm text-gray-600 mb-0">
          重さ：
          {pokemon["重さ"] ? Number(pokemon["重さ"]).toFixed(1) : "???.?"}
          kg
        </p>
      </div>
      {/* フォルムの切り替え */}
      {forms.length > 1 && (
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {forms.map(f => (
            <button
              key={f.id}
              onClick={() => setCurrentForm(f)}
              className={`text-xs px-3 py-1.5 rounded-md border border-gray-300 ${currentForm.id === f.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 shadow shadow-gray-400"}`}
            >
              {f.form_name || "通常"}
            </button>
          ))}
        </div>
      )}
      {/* 「通常・色違い」の切り替え */}
      <div className="w-64 grid grid-cols-2 bg-gray-200 rounded-md p-1">
        <button
          onClick={() => setViewMode("normal")}
          className={`w-31 py-2 text-sm text-gray-600 rounded-md border-none
              ${viewMode === "normal"
              ? "bg-gradient-to-r from-blue-400 to-violet-600 text-white"
              : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
          }
        >
          通常
        </button>
        <button
          onClick={() => setViewMode("shiny")}
          className={`w-31 py-2 text-sm text-gray-600 rounded-md border-none
              ${viewMode === "shiny"
              ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
              : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
          }
        >
          ✨色違い
        </button>
      </div>
      {/* 画像の表示 */}
      <img
        //src={`/images/pokemon/${viewMode === "normal" ? "normal" : "shiny"}/${pokemon.id}.png`}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${viewMode === "normal" ? "" : "shiny/"}${pokemon.id}.png`}
        alt={`${pokemon.name} ${pokemon.form_name || ""}`}
        onError={(e) => { e.currentTarget.src = '/images/noimage.png'; }}
        className="size-64 object-cover mx-auto"
        loading="lazy"
      />
    </div>
  );
}

//種族値(ステータスバーの表示)
function StatusData({ pokemon }) {
  const status = ["HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ"];
  return (
    <div className="p-6 m-4 space-y-2 border border-gray-300 rounded-2xl flex flex-col justify-center items-center text-center shadow shadow-gray-400">
      <div className="flex flex-row items-center justify-between w-full mb-6">
        <h2 className="text-xl font-bold">種族値</h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">合計</div>
          <div className="text-2xl text-blue-600 font-bold text-primary">{pokemon["合計"]}</div>
        </div>
      </div>

      <div className="w-full">
        <div className="space-y-4">
          {status.map((stat) =>
            <div key={stat} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="">{stat}</span>
                <span className="text-gray-500">{pokemon[stat]}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full" style={{ backgroundColor: statusColors[stat], width: `${(Number(pokemon[stat]) / 255) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

//特性の表示
function AbilityData({ pokemon, abilityData }) {
  const ability = ["特性1", "特性2", "夢特性"];
  return (
    <div className="p-6 m-4 space-y-2 border border-gray-300 rounded-2xl flex flex-col justify-center items-center text-center shadow shadow-gray-400">
      <div className="flex flex-row items-center justify-between w-full mb-6">
        <h2 className="text-xl font-bold">特性</h2>
      </div>

      <div className="w-full">
        <div className="space-y-4">
          {ability.map((abi) => {
            const info = abilityData.find(a => a.特性 === pokemon[abi]);
            return info ? (
              <div key={abi} className="space-y-3 text-left p-4 border border-gray-300 rounded-xl bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg">{pokemon[abi]}</h3>
                  {abi === "夢特性" && (
                    <span className="text-xs text-blue-600 px-2.5 py-1 mx-1 rounded-full bg-gray-200">隠れ特性</span>
                  )}
                </div>
                <p className="text-gray-500">{info.効果}</p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
