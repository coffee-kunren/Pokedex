"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//import Papa from "papaparse";//csvから読込む時に使う
import { usePokemonData, useAbilityData } from "@/contexts/DataContext";
import { Range, getTrackBackground } from "react-range";

//メイン画面
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("includes");
  const [viewMode, setViewMode] = useState({ region: false, official: true, shiny: false });

  const [detailSearchTrigger, setDetailSearchTrigger] = useState(0);

  /* sessionStorageから検索条件を持ってくる */
  const [conditionList, setConditionList] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("searchCondition");
      if (stored) setConditionList(JSON.parse(stored));
    }
  }, [detailSearchTrigger]);

  /* 並び替えで使うデータ */
  const sortTypes = [
    "図鑑番号", "なまえ", "高さ", "重さ",
    "ＨＰ種族値", "こうげき種族値", "ぼうぎょ種族値",
    "とくこう種族値", "とくぼう種族値", "すばやさ種族値",
    "合計種族値"
  ];
  const [currentSort, setCurrentSort] = useState({ key: "0", order: "0" });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = sessionStorage.getItem("sortKey") || "0";
      const order = sessionStorage.getItem("sortOrder") || "0";
      console.log("key == ", key);
      console.log("order == ", order);
      setCurrentSort({ key, order });
      sessionStorage.setItem("sortKey", key);
      sessionStorage.setItem("sortOrder", order);
      //if (!sessionStorage.getItem("sortOrder"))
      console.log(currentSort);
    }
  }, [detailSearchTrigger]);

  return (
    <div className="min-h-screen flex justify-center px-4">
      <main className="flex flex-col gap-8 w-full max-w-6xl">
        <header className="fixed w-full h-24 z-50 bg-white flex justify-between items-center">
          <div className="relative inline-block">
            <img
              src="images/img/title_frame.svg"
              className="w-70 h-auto object-contain"
            />
            <h1 className="absolute text-3xl font-bold left-13 top-2.5 bg-white">ポケモン図鑑</h1>
          </div>
          <div className="flex gap-2 mr-4">
            <AdvancedSearch
              conditionList={conditionList}
              setDetailSearchTrigger={setDetailSearchTrigger}
            />
            <SortBtn
              sortTypes={sortTypes}
              currentSort={currentSort}
              setDetailSearchTrigger={setDetailSearchTrigger}
            />
          </div>
        </header>
        <div className="self-end mt-24">
          <div className="flex items-center">
            <div className="w-53 grid grid-cols-2 gap-y-0.5 p-0.5 bg-gray-200 rounded-md border border-gray-300 shadow shadow-gray-400">
              {/* 「通常形態のみ・別形態を含む」の切り替え */}
              <button
                onClick={() => setViewMode(prev => ({ ...prev, region: false }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${!viewMode.region
                    ? "bg-gradient-to-r from-blue-400 to-violet-600 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                通常形態のみ
              </button>
              <button
                onClick={() => setViewMode(prev => ({ ...prev, region: true }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${viewMode.region
                    ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                別形態を含む
              </button>
              <hr className="border-t border-dashed border-gray-400" />
              <hr className="border-t border-dashed border-gray-400 ml-0.5" />
              {/* 「公式画像・他の画像」の切り替え */}
              <button
                onClick={() => setViewMode(prev => ({ ...prev, official: true }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${viewMode.official
                    ? "bg-gradient-to-r from-blue-400 to-violet-600 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                公式イラスト
              </button>
              <button
                onClick={() => setViewMode(prev => ({ ...prev, official: false }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${!viewMode.official
                    ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                ゲームイラスト
              </button>
              <hr className="border-t border-dashed border-gray-400" />
              <hr className="border-t border-dashed border-gray-400 ml-0.5" />
              {/* 「通常・色違い」の切り替え */}
              <button
                onClick={() => setViewMode(prev => ({ ...prev, shiny: false }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${!viewMode.shiny
                    ? "bg-gradient-to-r from-blue-400 to-violet-600 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                通常
              </button>
              <button
                onClick={() => setViewMode(prev => ({ ...prev, shiny: true }))}
                className={`w-26 py-1 text-xs text-gray-600 rounded-md border-none
                  ${viewMode.shiny
                    ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white"
                    : "bg-inhelit text-blue-600 hover:bg-gray-300"}`
                }
              >
                ✨色違い
              </button>
            </div>

            <div>
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
                  className="border border-gray-300 rounded-md px-8 py-1.5 mx-4 text-sm shadow shadow-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
                  placeholder="名前や番号で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* 「～を含む」「～から始まる」の切り替え */}
              <div className="flex items-center gap-1 text-sm mx-5 mt-1">
                ※検索文字
                <button
                  onClick={() => setFilterMode("includes")}
                  className={`px-2 py-0.5 text-xs rounded ${filterMode === "includes" ? "bg-blue-600 text-white" : "border border-gray-400 shadow shadow-gray-400 bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  を含む
                </button>
                <button
                  onClick={() => setFilterMode("startsWith")}
                  className={`px-2 py-0.5 text-xs rounded border ${filterMode === "startsWith" ? "bg-blue-600 text-white" : "border border-gray-400 shadow shadow-gray-400 bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  から始まる
                </button>
              </div>
            </div>
          </div>
        </div>

        <Gallery
          searchTerm={searchTerm}
          filterMode={filterMode}
          viewMode={viewMode}
          conditionList={conditionList}
          currentSort={currentSort}
          detailSearchTrigger={detailSearchTrigger}
        />

      </main>
    </div>
  );
}

//★検索条件にマッチしたポケモンたちのリストを表示する
function Gallery({ searchTerm, filterMode, viewMode, conditionList, currentSort, detailSearchTrigger }) {
  const { pokemonData } = usePokemonData();//全ポケモンデータ取得
  const imagesPerPage = 60;//1ページの最大表示ポケモン数
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!pokemonData || pokemonData.length === 0) return;
    let initialData = [...pokemonData];

    if (!viewMode.region) {
      initialData = initialData.filter(p => p.id >= 1 && p.id <= 1025);
    }

    /* 詳細検索による絞り込み */
    if (conditionList) {
      conditionList.forEach(cond => {
        if (!cond || cond.length === 0) return;
        /* 番号の範囲 */
        if (cond.range) {
          initialData = initialData.filter(p => p.origin_id >= cond.range[0] && p.origin_id <= cond.range[1]);
        }

        /* タイプ */
        if (cond.type && cond.type.length > 0) {
          const typeList = [
            "ノーマル", "ほのお", "みず", "くさ", "でんき", "こおり",
            "かくとう", "どく", "じめん", "ひこう", "エスパー", "むし",
            "いわ", "ゴースト", "ドラゴン", "あく", "はがね", "フェアリー"
          ];
          initialData = initialData.filter(p => {
            const types = [p["タイプ1"], p["タイプ2"]].filter(Boolean);
            return cond.type.every(i => types.includes(typeList[i]));
          });
        }

        /* 特性 */
        if (cond.ability && cond.ability !== "") {
          initialData = initialData.filter(p => {
            const abilities = [p["特性1"], p["特性2"], p["夢特性"]].filter(Boolean);
            return abilities.includes(cond.ability);
          });
        }

        /* ワード */
        if (cond.word && cond.word.trim() !== "") {
          const num = parseInt(cond.word) || 0;
          if (num !== 0) {
            initialData = initialData.filter(p => Number(p.origin_id) === num);
          } else {
            const toLower = cond.word.toLowerCase();
            initialData = initialData.filter(p => {
              const name = p.name?.toLowerCase() || "";
              const hira = p.hiragana?.toLowerCase() || "";
              const roma = p.romaji?.toLowerCase() || "";
              const formName = p.form_name?.toLowerCase() || "";
              return name.includes(toLower) || hira.includes(toLower) || roma.includes(toLower) || formName.includes(toLower);
            });
          }
        }
      });
    }

    /* 標準のワード検索による絞り込み */
    const baseFilter = initialData.filter(p => {
      const idNum = Number(p.origin_id);

      const num = parseInt(searchTerm) || 0;//番号検索の場合
      if (num != 0) return idNum === num;

      const name = p.name?.toLowerCase() || "";//名前(カタカナ表記)
      const hira = p.hiragana?.toLowerCase() || "";//ひらがな表記
      const roma = p.romaji?.toLowerCase() || "";//ローマ字表記
      const toLower = searchTerm.toLowerCase();
      const formName = p.form_name || "";

      const matches = (str) => {
        return filterMode === "startsWith" ? str.startsWith(toLower) : str.includes(toLower);
      };

      return (
        (matches(name) || matches(hira) || matches(roma) || formName?.includes(searchTerm))
      );
    });

    /* リストの並べ替え */
    const sortedData = baseFilter;
    switch (currentSort.key) {
      case "0"://図鑑番号
        sortedData.sort((a, b) => a.origin_id - b.origin_id);
        break;
      case "1"://なまえ
        //sortedData.sort((a, b) => a.name - b.name);
        sortedData.sort((a, b) => a.name.localeCompare(b.name, "ja"));
        break;
      case "2"://高さ
        sortedData.sort((a, b) => a["高さ"] - b["高さ"]);
        break;
      case "3"://重さ
        sortedData.sort((a, b) => {
          const A = a["重さ"] === "" ? Infinity : a["重さ"];
          const B = b["重さ"] === "" ? Infinity : b["重さ"];
          return A - B;
        });
        break;
      case "4"://種族値 －ＨＰ－
        sortedData.sort((a, b) => a["HP"] - b["HP"]);
        break;
      case "5"://種族値 －こうげき－
        sortedData.sort((a, b) => a["こうげき"] - b["こうげき"]);
        break;
      case "6"://種族値 －ぼうぎょ－
        sortedData.sort((a, b) => a["ぼうぎょ"] - b["ぼうぎょ"]);
        break;
      case "7"://種族値 －とくこう－
        sortedData.sort((a, b) => a["とくこう"] - b["とくこう"]);
        break;
      case "8"://種族値 －とくぼう－
        sortedData.sort((a, b) => a["とくぼう"] - b["とくぼう"]);
        break;
      case "9"://種族値 －すばやさ－
        sortedData.sort((a, b) => a["すばやさ"] - b["すばやさ"]);
        break;
      case "10"://種族値 －合計－
        sortedData.sort((a, b) => a["合計"] - b["合計"]);
        break;
    }
    if (currentSort.order === "1") sortedData.reverse();
    setFilteredData(sortedData);

    const totalPages = Math.ceil(baseFilter.length / imagesPerPage);
    setCurrentPage(prevPage => Math.min(prevPage, totalPages) || 1);
  }, [pokemonData, searchTerm, filterMode, conditionList, currentSort, viewMode, detailSearchTrigger]);

  const totalPages = Math.ceil(filteredData.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentPageData = filteredData.slice(startIndex, startIndex + imagesPerPage);

  return (
    <div className="p-4">
      {/* ページネーション */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
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

      {/* グリッド画像表示 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
        {currentPageData.map(pokemon => {
          const imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${viewMode.official ? "other/official-artwork/" : ""}${viewMode.shiny ? "shiny/" : ""}${pokemon.id}.png`;
          return (
            <Link href={`/${pokemon.id}`} key={pokemon.id}>
              <div className="relative space-y-2 border border-gray-300 rounded-2xl p-4 shadow shadow-gray-400 hover:bg-gray-100 hover:scale-105 duration-200">
                {/* 身長・体重・種族値の並べ替えではその数値を表示(図鑑番号・名前の時は✖) */}
                {Number(currentSort.key) >= 2 && Number(currentSort.key) <= 10 && (() => {
                  const key = Number(currentSort.key);
                  const sKey = ["図鑑番号", "名前", "高さ", "重さ", "HP", "こうげき", "ぼうぎょ", "とくこう", "とくぼう", "すばやさ", "合計"];
                  const baseList = ["H", "A", "B", "C", "D", "S", "合計"];

                  let value;
                  if (key === 2) value = Number(pokemon["高さ"]).toFixed(1);
                  else if (key === 3) value = Number(pokemon["重さ"]).toFixed(1);
                  else value = pokemon[sKey[key]];

                  const base = (key >= 4 && key <= 10) ? baseList[key - 4] + ": " : "";
                  const unit = key === 2 ? "m" : (key === 3 ? "kg" : "");
                  const tilde = (key === 2 && pokemon.form_name.includes("キョダイマックス")) ? "～" : "";

                  return (
                    <h4 className="absolute inset-x-5 inset-y-0.5  text-xs text-gray-500 font-bold">
                      {base}{value}{unit}{tilde}
                    </h4>
                  );
                })()}
                {/* 画像 */}
                <div className="flex justify-center items-center h-32">
                  <img
                    src={imageSrc}
                    alt={`${pokemon.name} ${pokemon.form_name || ""}`}
                    onError={(e) => { e.currentTarget.src = '/images/noimage.png'; }}
                    className="size-32 object-cover"
                    loading="lazy"
                  />
                </div>
                {/* No、名前、フォーム名(通常形態以外) */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">{`No.${pokemon.origin_id}`}</p>
                  <h3>{pokemon.name}</h3>
                  {viewMode.region && pokemon.form_name !== "通常" && (
                    <h4 className="h-0 text-[8px] font-bold">({pokemon.form_name})</h4>
                  )}
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

//★詳細検索ボタン
function AdvancedSearch({ conditionList, setDetailSearchTrigger }) {
  const { abilityData } = useAbilityData();//特性データ取得
  const [open, setOpen] = useState(false);
  const [openAc, setOpenAc] = useState(false);
  const [selectedType, setSelectedType] = useState([]);
  const types = [
    "ノーマル", "ほのお", "みず", "くさ", "でんき", "こおり", "かくとう", "どく", "じめん",
    "ひこう", "エスパー", "むし", "いわ", "ゴースト", "ドラゴン", "あく", "はがね", "フェアリー"
  ];
  const toggleSelect = (index) => {//タイプの条件指定
    setSelectedType((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  const [values, setValues] = useState([1, 1025]);//図鑑番号の範囲検索
  const router = useRouter();//リダイレクト用

  /* 絞り込み条件のform送信 */
  const searchSubmit = (e) => {
    e.preventDefault();

    const oldData = JSON.parse(sessionStorage.getItem("searchCondition") || "[]");
    //フリーワード入力
    const wordSelect = e.target.querySelector('input[type="text"]').value;
    //タイプ選択
    const typeSelect = [];
    selectedType.forEach(i => {
      typeSelect.push(i);
    });
    //特性選択
    const abilitySelect = e.target.querySelector('#searchAbility').value;
    //図鑑番号の範囲
    const rangeSelect = [values[0], values[1]];

    const newCondition = {
      word: wordSelect,
      type: typeSelect,
      ability: abilitySelect,
      range: rangeSelect
    };

    const isDefault =
      wordSelect === "" &&
      typeSelect.length === 0 &&
      abilitySelect === "" &&
      rangeSelect[0] === 1 &&
      rangeSelect[1] === 1025;

    if (!isDefault) {
      const newData = [...oldData, newCondition];
      sessionStorage.setItem("searchCondition", JSON.stringify(newData));
      setDetailSearchTrigger(prev => prev + 1);//再レンダリング用
      setSelectedType([]);//タイプ選択のリセット
      setValues([1, 1025]);//番号の範囲選択のリセット
      setOpen(!open);//ボタンを閉じる
      router.push('/');//自身にリダイレクト
    }
  };

  /* 絞り込み条件の削除ボタン */
  const searchDelete = (index) => {
    //e.preventDefault();
    const deletedList = conditionList.filter((_, i) => i !== index);
    sessionStorage.setItem("searchCondition", JSON.stringify(deletedList));
    setDetailSearchTrigger(prev => prev + 1);//再レンダリング用
    setOpenAc(!openAc);//アコーディオンを閉じる
    router.push('/');//自身にリダイレクト
  };

  /* アコーディオンメニュー外タッチで閉じる */
  const panelRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpenAc(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [panelRef]);

  return (
    <div className="flex items-center gap-1">
      {/* 適用中の条件一覧(アコーディオンメニュー) */}
      {conditionList.length !== 0 && (
        <div className="relative" ref={panelRef}>
          {/* ボタン */}
          <button
            className="p-2 text-xs text-white bg-red-500 border border-gray-400 rounded-3xl shadow shadow-gray-400 hover:bg-red-600"
            onClick={() => setOpenAc(!openAc)}
          >
            絞り込み中
            <span className="pl-1">{openAc ? "▲" : "▼"}</span>
          </button>

          {/* 条件リスト(パネル) */}
          <div
            className={`
              absolute right-0 w-76 p-1 z-20
              bg-green-100 border border-gray-400 rounded-md shadow
              transition-all duration-300
              ${openAc ? "block max-h-100 opacity-100" : "hidden max-h-0 opacity-0"}`}
          >
            {conditionList.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center p-1">
                  <div className="space-y-3 text-sm">
                    <h2 className="text-[18px] text-purple-600 font-bold mb-1.5">
                      条件{index + 1}
                    </h2>
                    {item.word && (
                      <p>検索ワード：{item.word}</p>
                    )}
                    {item.type.length > 0 && (
                      <p className="flex items-baseline gap-2">
                        タイプ：
                        {item.type.map((t, i) => (
                          <>
                            <div className="flex flex-col items-center">
                              <img
                                src={`images/img/icon_type_${t + 1}.svg`}
                                className="size-4.5 object-cover"
                              />
                              <span className="text-[10px]">{types[t]}</span>
                            </div>
                            {i < (item.type.length - 1) && (
                              <div>/</div>
                            )}
                          </>
                        ))}
                      </p>
                    )}
                    {item.ability && (
                      <p>特性：{item.ability}</p>
                    )}
                    {!(item.range[0] === 1 && item.range[1] === 1025) && (
                      <p>番号：{item.range[0]} ～ {item.range[1]}</p>
                    )}

                  </div>
                  <button
                    className="w-18 px-3 py-2 border border-gray-400 rounded-3xl bg-yellow-300 shadow shadow-gray-400 hover:bg-yellow-400"
                    onClick={() => searchDelete(index)}
                  >
                    消去
                  </button>
                </div>
                {index < conditionList.length - 1 && (
                  <hr className="border-t border-dashed border-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 絞り込みボタン(デフォルトで表示) */}
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-2 font-bold text-sm text-gray-100 bg-gradient-to-t from-red-500 to-violet-600 rounded-3xl shadow shadow-gray-600 hover:brightness-80 transition"
        >
          絞り込み<br />（and検索）
        </button>

        {/* 検索条件(メニュー)を開いている時の背景 */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-300 rounded-xl shadow-2xl px-12 py-6 w-132 transform transition-all duration-300 scale-100 opacity-100"
            >
              <h2 className="flex items-center gap-1 text-lg font-bold mb-4">
                <img src="images/img/icon_search.svg" className="size-7" />
                タイプや条件で探す
              </h2>
              <form className="space-y-2" onSubmit={searchSubmit} method="post" action={"/index.js"}>
                {/* フリーワード入力 */}
                <div className="flex items-center gap-2 text-sm font-bold">
                  <img src="images/img/ball.svg" className="size-4" />
                  フリーワード
                </div>
                <input
                  type="text"
                  placeholder="名前や図鑑番号で探す"
                  className="w-full p-1.5 px-3 text-xs border rounded"
                />
                {/* タイプ選択 */}
                <div className="flex items-center gap-2 text-sm font-bold mt-3">
                  <img src="images/img/ball.svg" className="size-4" />
                  タイプ
                </div>
                <div className="grid grid-cols-9 border rounded pt-1">
                  {types.map((t, i) => (
                    <div
                      key={t}
                      className="flex flex-col items-center mb-2"
                    >
                      <div
                        onClick={() => toggleSelect(i)}
                        className={`p-1 mb-1 border border-2 rounded-md ${selectedType.includes(i) ? "border-red-700" : "border-transparent"}`}
                      >
                        <img
                          src={`images/img/icon_type_${i + 1}.svg`}
                          alt={i + 1}
                          className="size-6 object-cover"
                        />
                      </div>
                      <span className="text-[8px] font-bold">{t}</span>
                    </div>
                  ))}
                </div>
                {/* 特性選択(ドロップダウンメニュー) */}
                <div className="flex items-center gap-2 text-sm font-bold mt-5">
                  <img src="images/img/ball.svg" className="size-4" />
                  特性
                </div>
                <select
                  id="searchAbility"
                  className="w-full p-2 text-xs border rounded hover:bg-gray-100"
                >
                  <option className="bg-white" value="">特性を選ぶ</option>
                  {abilityData.map(a => (
                    <option className="bg-white" value={a["特性"]}>
                      {a["特性"]}
                    </option>
                  ))}
                </select>
                {/* 図鑑番号(範囲選択) */}
                <div className="flex items-center gap-2 text-sm font-bold mt-3 mb-0">
                  <img src="images/img/ball.svg" className="size-4" />
                  番号
                </div>
                <div className="text-center text-sm">
                  <span className="border-b border-gray-400">{values[0]}</span>
                  <span> 〜 </span>
                  <span className="border-b border-gray-400">{values[1]}</span>
                </div>
                <Range
                  step={1}
                  min={1}
                  max={1025}
                  values={values}
                  onChange={setValues}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-11/12 h-2 rounded mx-auto"
                      style={{
                        background: getTrackBackground({
                          values,
                          colors: ['#d1d5db', '#5ba2ff', '#d1d5db'],
                          min: 1,
                          max: 1025
                        })
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '16px',
                        width: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                      }}
                    />
                  )}
                />
                {/* 
              <div className="flex items-center gap-2 text-sm font-bold mt-3 mb-0">
                <img src="images/img/ball.svg" className="size-4" />
                地方
              </div>
              */}
                {/* 後から追加予定...？ */}

                {/* フォームボタン */}
                <div className="flex justify-end gap-2 mt-10">
                  <button
                    type="reset"
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => {
                      setSelectedType([]);//タイプ選択
                      setValues([1, 1025]);//番号の範囲選択
                    }}
                  >
                    リセット
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    検索
                  </button>
                </div>
              </form >
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//★並べ替えボタン
function SortBtn({ sortTypes, currentSort, setDetailSearchTrigger }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();//リダイレクト用

  /* 絞り込み条件のform送信 */
  const sortSubmit = (e) => {
    e.preventDefault();

    const sortKey = e.target.querySelector('#sortKey').value;
    const sortOrder = e.target.querySelector('#sortOrder').value;
    sessionStorage.setItem("sortKey", sortKey);
    sessionStorage.setItem("sortOrder", sortOrder);
    setDetailSearchTrigger(prev => prev + 1);//再レンダリング用
    setOpen(!open);//ボタンを閉じる
    router.push('/');//自身にリダイレクト
  };

  return (
    <div className="flex items-center gap-1">
      {/* 並べ替えボタン */}
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 font-bold text-sm text-white bg-gradient-to-t from-green-500 to-blue-500 rounded-3xl shadow shadow-gray-600 hover:brightness-80 transition"
        >
          並び替え<br />
          <span className="text-orange-500 bg-white p-0.5 pb-1 rounded">
            {sortTypes[currentSort.key]}
            〈{currentSort.order === "0" ? "昇順" : "降順"}〉
          </span>
        </button>

        {/* 検索条件(メニュー)を開いている時の背景 */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-gray-300 rounded-xl shadow-2xl px-8 py-6 w-100 transform transition-all duration-300 scale-100 opacity-100"
            >
              <h2 className="flex items-center gap-1 text-lg font-bold mb-6">
                <img src="images/img/icon_search.svg" className="size-7" />
                表示順を変更する
              </h2>
              <form onSubmit={sortSubmit} method="post" action={"/index.js"}>
                <div className="grid grid-cols-2 gap-y-4">
                  {/* 並べ替える項目を選択(ドロップダウンメニュー) */}
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <img src="images/img/ball.svg" className="size-4" />
                    項目
                  </div>
                  <select
                    id="sortKey"
                    className="w-full p-2 text-sm border rounded hover:bg-gray-100"
                  >
                    {sortTypes.map((t, index) => (
                      <option className="bg-white" value={index}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {/* 昇順・降順の選択(ドロップダウンメニュー) */}
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <img src="images/img/ball.svg" className="size-4" />
                    昇順・降順
                  </div>
                  <select
                    id="sortOrder"
                    className="w-full p-2 text-sm border rounded hover:bg-gray-100"
                  >
                    <option className="text-red-500 bg-white" value="0">昇順</option>
                    <option className="text-blue-700 bg-white" value="1">降順</option>
                  </select>
                </div>
                {/* フォームボタン */}
                <div className="flex justify-end gap-2 mt-8">
                  <button
                    type="reset"
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    リセット
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    変更
                  </button>
                </div>
              </form >
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
