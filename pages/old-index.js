"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
//import Papa from "papaparse";//csvから読込む時に使う
import { usePokemonData } from "@/contexts/DataContext";

//メイン画面
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("includes");

  return (
    <div className="min-h-screen flex justify-center p-4">
      <main className="flex flex-col gap-8 w-full max-w-6xl">
        <h1 className="text-3xl font-bold pt-4 pl-4">ポケモン図鑑</h1>
        <div className="self-end">
          <AdvancedSearch />
          {/* 検索ボックス */}
          <div className="relative w-full max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-6 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="text"
              className="border border-gray-300 rounded-md px-8 py-1.5 mx-4 text-sm shadow shadow-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              placeholder="ポケモン名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 mx-6 my-1">
            ※検索文字
            <button
              onClick={() => setFilterMode("includes")}
              className={`px-2 py-0.5 text-sm rounded ${filterMode === "includes" ? "bg-blue-600 text-white" : "border border-gray-400 shadow shadow-gray-400 bg-white text-gray-500 hover:bg-gray-100"
                }`}
            >
              を含む
            </button>
            <button
              onClick={() => setFilterMode("startsWith")}
              className={`px-2 py-0.5 text-sm rounded border ${filterMode === "startsWith" ? "bg-blue-600 text-white" : "border border-gray-400 shadow shadow-gray-400 bg-white text-gray-500 hover:bg-gray-100"
                }`}
            >
              から始まる
            </button>
          </div>
        </div>

        <Gallery searchTerm={searchTerm} filterMode={filterMode} />

      </main>
    </div>
  );
}

//検索条件にマッチしたポケモンたちのリストを表示する
function Gallery({ searchTerm, filterMode }) {
  const { pokemonData } = usePokemonData();//全ポケモンデータ取得
  const imagesPerPage = 60;
  //const [pokemonData, setPokemonData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = pokemonData.filter(p => {
    const idNum = Number(p.id);
    if (isNaN(idNum)) return false;
    if (searchTerm.trim() === "") return idNum >= 1 && idNum <= 1025;

    const name = p.name?.toLowerCase() || "";//名前(カタカナ表記)
    const hiragana = p.hiragana?.toLowerCase() || "";//ひらがな表記
    const romaji = p.romaji?.toLowerCase() || "";//ローマ字表記
    const toLower = searchTerm.toLowerCase();

    const matches = (str) => {
      if (filterMode === "startsWith") return str.startsWith(toLower);
      return str.includes(toLower); // default：includes
    };

    return (
      idNum >= 1 &&
      idNum <= 1025 &&
      (matches(name) || matches(hiragana) || matches(romaji))
    );
  });

  const totalPages = Math.ceil(filteredData.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + imagesPerPage);


  useEffect(() => {
    //csvファイルからデータを取得
    /*
    fetch("/data/PokemonDataList.csv")
      .then(res => res.text())
      .then(csv => {
        const result = Papa.parse(csv, { header: true });
        const processedData = result.data.map(p => ({
          ...p,
          id: Number(p.id)
        }));
        setPokemonData(processedData);
      });
      */

    //JSONファイルからデータを取得
    /*
    fetch("/data/PokemonDataList.json")
      .then(res => res.json())
      .then(data => {
        const processedData = data.map(p => ({ ...p, id: Number(p.id) }));
        setPokemonData(processedData);
      })
      .catch(err => console.error("JSON読み込みエラー:", err));
      */
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  return (
    <div className="p-4">
      {/* グリッド画像表示 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {currentPageData.map((pokemon, index) => {
          const imageSrc = `/images/pokemon/normal/${pokemon.id}.png`;
          return (
            <Link href={`/${pokemon.id}`} key={pokemon.id}>
              <div className="space-y-2 border border-gray-300 rounded-2xl p-4 shadow shadow-gray-400 hover:bg-gray-100 hover:scale-105 duration-200">
                <div className="flex justify-center items-center h-32">
                  <img
                    src={imageSrc}
                    alt={`${pokemon.name} ${pokemon.form_name || ""}`}
                    onError={(e) => { e.currentTarget.src = '/images/noimage.png'; }}
                    className="size-32 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">{`No.${pokemon.id}`}</p>
                  <h3>{pokemon.name}</h3>
                </div>
              </div>
            </Link>

          );
        })}
      </div>

      {/* 検索結果0件の場合 */}
      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 border rounded-xl py-25 mt-4">該当するポケモンが見つかりませんでした。</p>
      )}

      {/* ページネーション */}
      <div className="flex justify-center flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`size-9 text-lg rounded ${currentPage === i + 1
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 border border-gray-300 shadow shadow-gray-400 bg-white hover:bg-gray-100'
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}







function AdvancedSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative p-4 max-w-md mx-auto">
      {/* トグルボタン */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow shadow-gray-400 hover:bg-blue-700 transition"
      >
        検索
      </button>

      {/* 検索条件を開いている時の背景 */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      ></div>

      {/* フローティングフォーム（ふわっと拡大） */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white/90 border border-gray-300 rounded-xl shadow-2xl p-6 w-80
          backdrop-blur-md z-50 transition-all duration-300 ease-out origin-center
          ${open ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"}`}
      >
        <h2 className="text-lg font-bold mb-4">🔍 タイプや条件で探す</h2>
        <form className="space-y-3">
          <p>フリーワード</p>
          <input
            type="text"
            placeholder="名前や図鑑番号で探す"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="図鑑番号で検索"
            className="w-full p-2 border rounded"
          />
          <select className="w-full p-2 border rounded">
            <option>タイプを選択</option>
            <option>ほのお</option>
            <option>みず</option>
            <option>でんき</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              閉じる
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              検索
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




function SearchToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative p-6 max-w-md mx-auto">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        詳細検索
      </button>

      {/* アニメーション付きで表示 */}
      <div
        className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 border rounded shadow bg-gray-50">
          <h2 className="font-bold mb-2">詳細検索フォーム</h2>
          <form className="space-y-2">
            <input
              type="text"
              placeholder="名前で検索"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="IDで検索"
              className="w-full p-2 border rounded"
            />
            <select className="w-full p-2 border rounded">
              <option>タイプを選択</option>
              <option>ほのお</option>
              <option>みず</option>
              <option>でんき</option>
            </select>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
              検索
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
