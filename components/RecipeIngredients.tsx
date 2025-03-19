"use client";

import { useState } from "react";

type CategoryIngredients = {
  ingredients: {
    id: string;
    cate: string;
    names: string[];
  }[];
};

const RecipeIngredients = ({ ingredients }: CategoryIngredients) => {
  const [activeCategoryIngredientsBtn, setActiveCategoryIngredientsBtn] =
    useState("all");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center w-full py-3 rounded-md px-2 mb-6 bg-red-50">
        <button
          type="button"
          onClick={() => setActiveCategoryIngredientsBtn("all")}
          className={
            activeCategoryIngredientsBtn === "all"
              ? "bg-zinc-800 uppercase text-white transition-all border-zinc-800 border-2 p-2 mx-4 my-2 rounded-md cursor-pointer"
              : "border-zinc-800 uppercase bg-[#ffffff] border-2 p-2 mx-4 my-2 rounded-md cursor-pointer xl:hover:bg-zinc-800 xl:hover:text-white transition-all"
          }
        >
          wszystkie
        </button>
        {ingredients.map((item, index) => {
          return (
            <button
              type="button"
              key={index}
              onClick={() => setActiveCategoryIngredientsBtn(item.cate)}
              className={
                activeCategoryIngredientsBtn === item.cate
                  ? "bg-red-900 uppercase text-white transition-all border-red-900 border-2 p-2 mx-4 my-2 rounded-md cursor-pointer"
                  : "border-red-900 uppercase bg-[#ffffff] border-2 p-2 mx-4 my-2 rounded-md cursor-pointer xl:hover:bg-red-900 xl:hover:text-white transition-all"
              }
            >
              {item.cate}
            </button>
          );
        })}
      </div>
      {activeCategoryIngredientsBtn === "all" ? (
        <ul className="w-[98%] mx-auto xl:w-full">
          {ingredients.length > 0 &&
            ingredients.map((item, index) => {
              return (
                <div
                  key={`${activeCategoryIngredientsBtn}-${index}`}
                  className="ingredientAnim"
                >
                  {item.names.map((item2, index2) => {
                    return (
                      <li
                        className="text-base xl:text-lg font-bodyFont mb-4 border-b-2 pb-2"
                        key={index2}
                      >
                        {item2}
                      </li>
                    );
                  })}
                </div>
              );
            })}
        </ul>
      ) : (
        <ul className="w-[98%] mx-auto xl:w-full">
          {ingredients.length > 0 &&
            ingredients
              .filter((item) => item.cate === activeCategoryIngredientsBtn)
              .map((item, index) => {
                return (
                  <div
                    key={`${activeCategoryIngredientsBtn}-${index}`}
                    className="ingredientAnim"
                  >
                    {item.names.map((item2, index2) => {
                      return (
                        <li
                          className="text-base xl:text-lg font-bodyFont mb-4 border-b-2 pb-2"
                          key={index2}
                        >
                          {item2}
                        </li>
                      );
                    })}
                  </div>
                );
              })}
        </ul>
      )}
    </div>
  );
};

export default RecipeIngredients;
