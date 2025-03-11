"use client";

import Link from "next/link";
import Image from "next/image";
import { IoEnter } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { deleteRecipe } from "@/lib/user.actions";
import { useGlobalContext } from "./authContext";

const RecipesListProfile = ({
  recipes,
  userID,
}: {
  recipes: Recipe[];
  userID: string;
}) => {
  const [confirmDelete, setConfirmDelete] = useState<RecipeTypeList | null>(
    null
  );
  const [recipesList, setRecipesList] = useState(recipes);
  const [visibleRecipesCount, setVisibleRecipesCount] = useState(5);
  const { setEditRecipe } = useGlobalContext();

  const handleDelete = (id: string) => {
    const updateProducts = recipesList.filter((item) => item.id !== id);
    deleteRecipe(userID, id);
    setRecipesList(updateProducts);
    setConfirmDelete(null);
  };

  const loadMoreRecipes = () => {
    setVisibleRecipesCount((prevCount) => prevCount + 5);
  };

  return (
    <>
      {confirmDelete && (
        <div className="z-20 rounded-md border-2 border-white flex flex-col fixed w-[95%] xl:w-[40vw] h-[50vh] bg-red-900 text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 items-center justify-center">
          <span className="mb-8 w-full text-center text-base xl:text-xl px-4 py-2 bg-white text-black uppercase font-semibold">
            {confirmDelete.title}
          </span>
          <MdDeleteForever className="text-5xl mb-2" />
          <h2 className="text-xl xl:text-2xl text-center">
            Czy napewo chcesz usunąć ten przepis?
          </h2>
          <div className="flex items-center justify-center mt-10">
            <button
              onClick={() => setConfirmDelete(null)}
              className="p-3 xl:p-5 bg-white text-red-900 uppercase rounded-md text-xl xl:text-2xl mx-4 transition-all border-2 border-white hover:bg-black hover:text-white"
            >
              NIE
            </button>
            <button
              onClick={() => handleDelete(confirmDelete.id)}
              className="p-3 xl:p-5 bg-white text-red-900 uppercase rounded-md text-xl xl:text-2xl mx-4 transition-all border-2 border-white hover:bg-black hover:text-white"
            >
              TAK
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto my-[5vh] flex w-full items-center justify-center flex-wrap">
        {recipesList.slice(0, visibleRecipesCount).map((recipe) => {
          const {
            id,
            title,
            image,
            prepTime,
            portion,
            author,
            category,
            likes,
          } = recipe;

          return (
            <div
              key={id}
              className="recipeProfileAnimation flex items-strech w-full xl:w-[25vw] justify-between border-2 border-gray-600 shadow-xl rounded-md my-5  xl:m-[1.5vw]"
            >
              <div className="flex flex-col w-1/5 xl:w-[4vw]  bg-neutral-50 items-center  justify-around ">
                <Link href={`/przepisy/${id}`}>
                  {" "}
                  <IoEnter className="cursor-pointer text-2xl text-cyan-950 transition-all hover:text-blue-700" />
                </Link>
                <Link
                  href={{
                    pathname: "/dodaj",
                    query: { edycja: id },
                  }}
                  onClick={() => setEditRecipe(recipe)}
                >
                  {" "}
                  <BiEdit className="cursor-pointer text-2xl text-green-900 transition-all hover:text-green-700" />
                </Link>
                <MdDeleteForever
                  onClick={() => setConfirmDelete(recipe)}
                  className="cursor-pointer text-2xl text-red-900 transition-all hover:text-red-700"
                />
              </div>

              <div className="recipeProfile bg-neutral-50 transition-transform">
                <Image
                  src={image}
                  width={500}
                  height={500}
                  className="w-full h-2/4 2xl:h-3/5 object-cover recipe-imgProfile"
                  alt={title}
                />
                <section className="h-1/2 2xl:h-2/6 flex flex-col items-center justify-around xl:justify-center p-2 xl:my-2 recipe-sectionProfile">
                  <h5 className="text-base text-center font-bold mb-2 w-full">
                    {title.toUpperCase()}
                  </h5>
                  <p className="text-gray-600 text-sm mb-2 text-center flex flex-col  2xl:inline">
                    <span>
                      Przygotowanie:{" "}
                      <strong className="text-red-800">{prepTime} min</strong>
                    </span>{" "}
                    <span className="hidden 2xl:inline">|</span>
                    <span>
                      {" "}
                      Ilość porcji:{" "}
                      <strong className="text-red-800">{portion}</strong>
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-2 text-center flex flex-col  2xl:inline">
                    <span>
                      {" "}
                      Kategorie:{" "}
                      <strong className="text-red-800 capitalize">
                        {category.length > 1
                          ? category[0] + ", inne..."
                          : category[0]}
                      </strong>{" "}
                    </span>

                    <span className="hidden 2xl:inline">|</span>
                    <span>
                      Autor:{" "}
                      <strong className="text-red-800">
                        {author.authorName}
                      </strong>
                    </span>
                  </p>
                  <p className="flex justify-center items-center">
                    <FaHeart className="mr-2 text-gray-500" />{" "}
                    <strong className="text-red-800">{likes.length}</strong>
                  </p>
                </section>
              </div>
            </div>
          );
        })}
        {visibleRecipesCount < recipesList.length && (
          <div className="flex w-full justify-center my-6">
            <button
              onClick={loadMoreRecipes}
              className="px-4 py-2 bg-red-900 text-white rounded-md xl:hover:bg-red-700 transition-all"
            >
              Załaduj więcej
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipesListProfile;
