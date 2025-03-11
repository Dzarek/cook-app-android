"use client";

import RecipesList from "@/components/RecipesList";
import { options, tags } from "@/constants";
import { BiFork } from "react-icons/bi";
import { GiCook } from "react-icons/gi";
import { BiSearchAlt2 } from "react-icons/bi";
import { useState, useEffect } from "react";
import { RiArrowDownCircleFill2 } from "react-icons/ri";

type RecipeSearchType = {
  allRecipes: Recipe[];
  kategoria: string | undefined;
  authors: User[] | undefined;
};

const RecipesSearch = ({
  allRecipes,
  kategoria,
  authors,
}: RecipeSearchType) => {
  const [activeRecipes, setActiveRecipes] = useState(allRecipes);
  const [activeCategory, setActiveKategory] = useState("wszystkie");
  const [activeAuthor, setActiveAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [visibleRecipesCount, setVisibleRecipesCount] = useState(5);

  useEffect(() => {
    if (kategoria) {
      handleCategory(kategoria);
    }
  }, []);

  const handleCategory = (tag: string) => {
    setActiveAuthor("");
    if (tag === "wszystkie") {
      setActiveRecipes(allRecipes);
      setActiveKategory("wszystkie");
    } else {
      const newTag = tag === "sniadanie" ? "śniadanie" : tag;
      setActiveKategory(newTag);
      setActiveRecipes(
        allRecipes.filter((recipe) => recipe.category.includes(newTag))
      );
    }
    setVisibleRecipesCount(5);
  };
  const handleAuthor = (name: string) => {
    setActiveKategory("");
    if (name === "wszyscy") {
      setActiveRecipes(allRecipes);
      setActiveAuthor("wszyscy");
    } else {
      setActiveAuthor(name);
      setActiveRecipes(
        allRecipes.filter((recipe) => recipe.author.authorName === name)
      );
    }
    setVisibleRecipesCount(5);
  };

  const handleSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setActiveKategory("");
    setActiveAuthor("");
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setActiveRecipes(allRecipes);
    } else {
      const filteredRecipes = allRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setActiveRecipes(filteredRecipes);
    }
    setVisibleRecipesCount(5);
  };

  const handleSort = (option: string) => {
    const sortedRecipes = [...activeRecipes];

    if (option === "najnowsze") {
      setActiveRecipes(
        sortedRecipes.sort((a, b) => b.createdTime - a.createdTime)
      );
    } else if (option === "najstarsze") {
      setActiveRecipes(
        sortedRecipes.sort((a, b) => a.createdTime - b.createdTime)
      );
    } else if (option === "nazwa: a-z") {
      setActiveRecipes(
        sortedRecipes.sort((a, b) => a.title.localeCompare(b.title))
      );
    } else if (option === "nazwa: z-a") {
      setActiveRecipes(
        sortedRecipes.sort((a, b) => b.title.localeCompare(a.title))
      );
    } else if (option === "czas przygotowania: rosnąco") {
      setActiveRecipes(sortedRecipes.sort((a, b) => a.prepTime - b.prepTime));
    } else if (option === "czas przygotowania: malejąco") {
      setActiveRecipes(sortedRecipes.sort((a, b) => b.prepTime - a.prepTime));
    }
    setVisibleRecipesCount(5);
  };

  const loadMoreRecipes = () => {
    setVisibleRecipesCount((prevCount) => prevCount + 5);
  };

  return (
    <main className="flex items-start w-[100vw]  xl:my-[5vh] justify-between flex-col xl:flex-row">
      <div className="bg-red-900 border-red-950  w-[10vw] h-[45px] border-t-2 hidden xl:block"></div>
      <section
        className={`${
          showFilter ? "h-auto " : "h-12 xl:h-auto mb-5"
        } xl:h-auto overflow-hidden w-full xl:w-1/5 duration-300 border-2 border-red-950 rounded-b-md rounded-br-md bg-white`}
      >
        <h3
          onClick={() => setShowFilter(!showFilter)}
          className="uppercase h-12 xl:h-auto text-lg xl:text-xl flex items-center justify-center font-semibold bg-red-900 text-white p-2 text-center"
        >
          Filtruj
          <RiArrowDownCircleFill2 className="ml-5 text-2xl xl:hidden" />
        </h3>
        <div className="filterBy bg-red-200 xl:bg-white">
          <h4 className="w-full bg-zinc-800 text-white p-1 px-8 xl:px-4 text-md font-semibold font-bodyFont uppercase tracking-wider">
            Kategorie:
          </h4>
          <ul className="py-2  overflow-hidden flex flex-wrap w-4/5 mx-auto xl:w-full justify-between items-center xl:items-start xl:flex-col">
            <>
              <li
                className={`xl:ml-4 my-2 w-[45%] xl:w-full cursor-pointer xl:hover:translate-x-4 transition-all capitalize tracking-wider font-medium flex items-center 
                 ${
                   activeCategory === "wszystkie" &&
                   "bg-red-900 rounded-lg xl:rounded-none xl:rounded-l-lg text-white py-1 xl:ml-16 hover:translate-x-0 transition-all"
                 }
                  `}
                onClick={() => handleCategory("wszystkie")}
              >
                <BiFork
                  className={`mr-2 rotate-45 text-red-900 text-xl  ${
                    activeCategory === "wszystkie" && " text-white"
                  }`}
                />
                wszystkie
              </li>
              {tags.map((tag, index) => {
                return (
                  <li
                    className={`xl:ml-4 my-2 w-[45%] xl:w-full cursor-pointer xl:hover:translate-x-4 transition-all capitalize tracking-wider font-medium flex items-center 
                 ${
                   activeCategory === tag &&
                   "bg-red-900 rounded-lg xl:rounded-none xl:rounded-l-lg text-white py-1 xl:ml-16 hover:translate-x-0 transition-all"
                 }
                  `}
                    key={index}
                    onClick={() => handleCategory(tag)}
                  >
                    <BiFork
                      className={`mr-2 rotate-45 text-red-900 text-xl  ${
                        activeCategory === tag && " text-white"
                      }`}
                    />
                    {tag}
                  </li>
                );
              })}
            </>
          </ul>
        </div>
        <div className="filterBy bg-red-200 xl:bg-white">
          <h4 className="w-full bg-zinc-800 text-white p-1 px-8 xl:px-4 text-md font-semibold font-bodyFont uppercase tracking-wider">
            Autor:
          </h4>
          {authors && (
            <ul className="py-2  overflow-hidden flex flex-wrap w-4/5 mx-auto xl:w-full justify-between items-center xl:items-start xl:flex-col">
              <>
                <li
                  className={`xl:ml-4 my-2 w-[45%] xl:w-full cursor-pointer xl:hover:translate-x-4 transition-all capitalize tracking-wider font-medium flex items-center pl-2 xl:pl-0 
                 ${
                   activeAuthor === "wszyscy" &&
                   "bg-red-900 rounded-lg xl:rounded-none xl:rounded-l-lg text-white py-1 xl:ml-16 hover:translate-x-0 transition-all"
                 }
                  `}
                  onClick={() => handleAuthor("wszyscy")}
                >
                  <GiCook
                    className={`mr-2 text-red-900 text-xl  ${
                      activeAuthor === "wszyscy" && " text-white"
                    }`}
                  />
                  wszyscy
                </li>
                {authors.map((author) => {
                  return (
                    <li
                      className={`xl:ml-4 my-2 w-[45%] xl:w-full cursor-pointer xl:hover:translate-x-4 transition-all capitalize tracking-wider font-medium flex items-center pl-2 xl:pl-0 
                    ${
                      activeAuthor === author.userName &&
                      "bg-red-900 rounded-lg xl:rounded-none xl:rounded-l-lg text-white py-1 xl:ml-16 hover:translate-x-0 transition-all"
                    }
                     `}
                      key={author.id}
                      onClick={() => handleAuthor(author.userName)}
                    >
                      <GiCook
                        className={`mr-2 text-red-900 text-xl  ${
                          activeAuthor === author.userName && " text-white"
                        }`}
                      />
                      {author.userName}
                    </li>
                  );
                })}
              </>
            </ul>
          )}
        </div>
      </section>
      <section className="w-full xl:w-4/5 border-t-2 border-red-950">
        <h3 className="uppercase text-lg xl:text-xl font-semibold bg-red-900 text-white p-2 text-center ">
          Lista przepisów:
        </h3>
        <div className="sort mx-auto w-full flex flex-col xl:flex-row items-center justify-center mt-10 -mb-5">
          <section className="flex flex-col w-full xl:w-auto justify-center items-center mb-5 xl:mb-0 xl:flex-row xl:mr-10">
            <label
              id="sort"
              className="mb-2 xl:mb-0 xl:mr-3 text-xl font-bold text-red-900"
            >
              Sortuj według:
            </label>
            <select
              name="sort"
              id="sort"
              className="text-lg p-2 px-3 w-4/5 xl:w-auto lowercase text-center xl:text-left rounded-md bg-zinc-700 text-white"
              onChange={(e) => handleSort(e.target.value)}
            >
              {options.map((option, index) => {
                return (
                  <option value={option} key={index}>
                    {option}
                  </option>
                );
              })}
            </select>
          </section>
          <section className="flex flex-col xl:flex-row w-full xl:w-auto mb-10 xl:mb-0 items-center justify-center">
            <label
              id="search"
              className="mb-2 xl:mb-0 xl:mr-3 text-xl font-bold text-red-900"
            >
              Szukaj:
            </label>
            <div className="relative w-4/5 xl:w-auto">
              <input
                type="text"
                id="search"
                name="search"
                className="bg-zinc-700 w-full text-center xl:text-left xl:w-[16vw] text-white rounded-md lowercase p-2 px-3 text-lg "
                placeholder="wpisz nazwę"
                value={searchTerm}
                onChange={(e) => handleSearchTitle(e)}
              />
              <div className="text-xl text-white absolute top-[50%] right-2 translate-y-[-50%] ">
                <BiSearchAlt2 />
              </div>
            </div>
          </section>
        </div>
        {allRecipes && (
          <div className="px-[10vw] xl:px-[5vw] pb-[10vh]">
            <RecipesList
              recipes={activeRecipes.slice(0, visibleRecipesCount)}
            />
            {visibleRecipesCount < activeRecipes.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreRecipes}
                  className="px-4 py-2 bg-red-900 text-white rounded-md xl:hover:bg-red-700 transition-all"
                >
                  Załaduj więcej
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default RecipesSearch;
