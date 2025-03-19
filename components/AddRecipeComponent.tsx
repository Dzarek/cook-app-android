"use client";

import { levels, tags } from "@/constants";
import Image from "next/image";
import { Link, Element } from "react-scroll";
import { useState, useEffect, useRef } from "react";
import { BsBarChart, BsClockHistory } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import {
  MdClose,
  MdDeleteForever,
  MdOutlineRemoveCircle,
} from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { postRecipe } from "@/lib/user.actions";
import toast from "react-hot-toast";
import UploadImage from "./cloudinary/UploadImage";
import { useGlobalContext } from "./authContext";
import VoiceIngredient from "./voice/VoiceIngredient";
import VoiceLongText from "./voice/VoiceLongText";
import ConfirmBtn from "./uiverse/ConfirmBtn";
import { subscribe } from "@/notification/Notification";
import { v4 as uuidv4 } from "uuid";

type CategoryIngredients = {
  id: string;
  cate: string;
  names: string[];
};

const AddRecipeComponent = ({
  edycja,
  userID,
  userName,
}: {
  edycja: string;
  userID: string;
  userName: string;
}) => {
  // Load data from localStorage if it exists
  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue; // Ensure it's running on the client

    try {
      const savedValue = localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      localStorage.removeItem(key); // Clear corrupted data
      return defaultValue;
    }
  };

  const [newTitle, setNewTitle] = useState(
    loadFromLocalStorage("newTitle", "")
  );
  const [newShortInfo, setNewShortInfo] = useState(
    loadFromLocalStorage("newShortInfo", "")
  );
  const [newCategory, setNewCategory] = useState<string[]>(
    loadFromLocalStorage("newCategory", [])
  );
  const [newPrepTime, setNewPrepTime] = useState(
    loadFromLocalStorage("newPrepTime", 0)
  );
  const [newLevel, setNewLevel] = useState(
    loadFromLocalStorage("newLevel", levels[0])
  );
  const [newPortion, setNewPortion] = useState(
    loadFromLocalStorage("newPortion", 0)
  );

  const [newIngredients, setNewIngredients] = useState<CategoryIngredients[]>(
    []
  );
  const [editingIngredient, setEditingIngredient] = useState<number>(-1);
  const [newIngredient, setNewIgredient] = useState("");
  const [newSteps, setNewSteps] = useState<string[]>(
    loadFromLocalStorage("newSteps", [])
  );
  const [editingStep, setEditingStep] = useState<number>(-1);
  const [newStep, setNewStep] = useState("");
  const [newDescription, setNewDescription] = useState(
    loadFromLocalStorage("newDescription", "")
  );
  const [newSource, setNewSource] = useState(
    loadFromLocalStorage("newSource", "")
  );
  const [newImage, setNewImage] = useState(
    loadFromLocalStorage("newImage", "")
  );
  const [activeVoice, setActiveVoice] = useState("");
  const [disableBtn, setDisableBtn] = useState(true);

  const [newCategoryIngredients, setNewCategoryIngredients] = useState("");
  const [activeCategoryIngredients, setActiveCategoryIngredients] =
    useState(false);
  const [deleteCategoryIngredients, setDeleteCategoryIngredients] =
    useState(false);

  const [activeCategoryIngredientsBtn, setActiveCategoryIngredientsBtn] =
    useState(newIngredients.length > 0 ? newIngredients[0].cate : "");

  const { editRecipe, setEditRecipe, name } = useGlobalContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save data to localStorage whenever any field changes
  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  // useEffect to handle saving to localStorage on change for each field
  useEffect(() => {
    saveToLocalStorage("newImage", newImage);
  }, [newImage]);

  useEffect(() => {
    saveToLocalStorage("newTitle", newTitle);
  }, [newTitle]);

  useEffect(() => {
    saveToLocalStorage("newShortInfo", newShortInfo);
  }, [newShortInfo]);

  useEffect(() => {
    saveToLocalStorage("newCategory", newCategory);
  }, [newCategory]);

  useEffect(() => {
    saveToLocalStorage("newPrepTime", newPrepTime);
  }, [newPrepTime]);

  useEffect(() => {
    saveToLocalStorage("newLevel", newLevel);
  }, [newLevel]);

  useEffect(() => {
    saveToLocalStorage("newPortion", newPortion);
  }, [newPortion]);

  useEffect(() => {
    const storedIngredients = loadFromLocalStorage("newIngredients", []);
    setNewIngredients(storedIngredients);
  }, []);

  useEffect(() => {
    if (newIngredients.length > 0) {
      saveToLocalStorage("newIngredients", newIngredients);
    }
  }, [newIngredients]);

  useEffect(() => {
    saveToLocalStorage("newSteps", newSteps);
  }, [newSteps]);

  useEffect(() => {
    saveToLocalStorage("newDescription", newDescription);
  }, [newDescription]);

  useEffect(() => {
    saveToLocalStorage("newSource", newSource);
  }, [newSource]);

  useEffect(() => {
    if (edycja) {
      setNewImage(editRecipe.image);
      setNewTitle(editRecipe.title);
      setNewShortInfo(editRecipe.shortInfo);
      setNewCategory(editRecipe.category);
      setNewPrepTime(editRecipe.prepTime);
      setNewLevel(editRecipe.level);
      setNewPortion(editRecipe.portion);
      setNewIngredients(editRecipe.ingredients);
      setNewSteps(editRecipe.steps);
      setNewDescription(editRecipe.description);
      setNewSource(editRecipe.source);
    }
  }, []);

  useEffect(() => {
    if (newTitle === "") {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  }, [newTitle]);

  const handleNewCategory = (tag: string) => {
    if (newCategory.includes(tag)) {
      setNewCategory(newCategory.filter((category) => category !== tag));
    } else {
      setNewCategory([...newCategory, tag]);
    }
  };

  const handleLevel = (option: string) => {
    setNewLevel(option);
  };

  const handleAddIngredient = () => {
    if (newIngredient === "") {
      toast("wpisz składnik!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
      return;
    }
    if (newIngredients.length < 1) {
      const newCategoryI = {
        id: Date.now().toString(),
        cate: "inne",
        names: [newIngredient],
      };
      setNewIngredients([newCategoryI]);
      setActiveCategoryIngredientsBtn("inne");
      setNewIgredient("");
    }

    if (
      activeCategoryIngredientsBtn === "" &&
      !newIngredients.find((item) => item.cate === "inne")
    ) {
      setActiveCategoryIngredientsBtn("inne");

      const newCategoryI = {
        id: Date.now().toString(),
        cate: "inne",
        names: [newIngredient],
      };
      setNewIngredients([...newIngredients, newCategoryI]);
      setNewIgredient("");
      return;
    }
    if (
      activeCategoryIngredientsBtn === "" &&
      newIngredients.find((item) => item.cate === "inne")
    ) {
      setActiveCategoryIngredientsBtn("inne");
      const updatedItems = newIngredients.map((ingredient) =>
        ingredient.cate === "inne"
          ? { ...ingredient, names: [...ingredient.names, newIngredient] }
          : ingredient
      );

      setNewIngredients(updatedItems);
      setNewIgredient("");
    } else {
      const updatedItems = newIngredients.map((ingredient) =>
        ingredient.cate === activeCategoryIngredientsBtn
          ? { ...ingredient, names: [...ingredient.names, newIngredient] }
          : ingredient
      );

      setNewIngredients(updatedItems);
      setNewIgredient("");
    }
  };
  const handleAddStep = () => {
    const updatedItems = [...newSteps];
    if (newStep === "") {
      toast("wpisz nową instrukcje!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
    } else {
      setNewSteps([...updatedItems, newStep]);
      setNewStep("");
    }
  };

  const handleEditIngredient = (index: number) => {
    const updatedItems = [...newIngredients];
    const updatedItems2 = updatedItems.filter(
      (item) => item.cate === activeCategoryIngredientsBtn
    );

    updatedItems2[0].names[index] = newIngredient;
    setNewIngredients(updatedItems);
    setNewIgredient("");
    setEditingIngredient(-1);
  };
  const handleEditStep = (index: number) => {
    const updatedItems = [...newSteps];
    updatedItems[index] = newStep;
    setNewSteps(updatedItems);
    setNewStep("");
    setEditingStep(-1);
  };

  const handleDeleteIngedient = (index: number) => {
    const updatedItems = [...newIngredients];
    const updatedItems2 = updatedItems.filter(
      (item) => item.cate === activeCategoryIngredientsBtn
    );
    const deletedItem = updatedItems2[0].names.splice(index, 1);
    const updatedItems3 = updatedItems.filter(
      (item) => item.cate !== activeCategoryIngredientsBtn
    );
    setNewIngredients([...updatedItems3, ...updatedItems2]);
  };
  const handleDeleteStep = (index: number) => {
    const updatedItems = [...newSteps];
    updatedItems.splice(index, 1);
    setNewSteps(updatedItems);
  };

  const handleAddCategoryIngredient = () => {
    if (newCategoryIngredients === "") {
      setActiveCategoryIngredients(false);
    } else {
      setActiveCategoryIngredients(false);
      const newCategoryI = {
        id: new Date().toString(),
        cate: newCategoryIngredients,
        names: [],
      };
      setNewIngredients([...newIngredients, newCategoryI]);
      setNewCategoryIngredients("");
      setActiveCategoryIngredientsBtn(newCategoryIngredients);
    }
  };

  const handleDeleteCategoryIgredient = (category: string) => {
    setNewIngredients(
      newIngredients.filter((igredients) => igredients.cate !== category)
    );
    setActiveCategoryIngredientsBtn("");
  };

  const resetForm = () => {
    setNewImage("");
    setNewTitle("");
    setNewShortInfo("");
    setNewCategory([]);
    setNewPrepTime(0);
    setNewLevel(levels[0]);
    setNewPortion(0);
    setNewIngredients([]);
    setEditingIngredient(-1);
    setNewIgredient("");
    setNewSteps([]);
    setEditingStep(-1);
    setNewStep("");
    setNewDescription("");
    setNewSource("");
    setEditRecipe(null);
    localStorage.clear();
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let editing = edycja ? true : false;
    let recipeID = edycja;

    if (
      userID !== "" &&
      newImage !== "" &&
      newTitle !== "" &&
      newShortInfo !== "" &&
      newCategory.length > 0 &&
      newPrepTime > 0 &&
      // newLevel > "" &&
      newPortion > 0 &&
      newIngredients.length > 0 &&
      newSteps.length > 0
      // newDescription !== ""
    ) {
      await postRecipe(
        editing,
        recipeID,
        userID,
        newImage,
        newTitle,
        newShortInfo,
        newCategory,
        newPrepTime,
        newLevel,
        newPortion,
        newIngredients,
        newSteps,
        newDescription,
        newSource
      );
      if (!editing) {
        const uuid = uuidv4();
        await handleSub(newTitle, uuid);
      }
      resetForm();
      localStorage.clear();
      if (editing) {
        window.location.href = "/profil";
      } else {
        window.location.href = "/przepisy";
      }
    } else {
      toast("Uzupełnij wszystkie pola!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (userID && userID !== undefined) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then(function (registration) {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch(function (error) {
            console.error("Service Worker registration failed:", error);
          });
      }
      if ("Notification" in window && "PushManager" in window) {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            console.log("Notification permission granted.");
          }
        });
      }
    }
  }, [userID]);

  const handleSub = async (newTitle: string, uuid: any) => {
    // const cookerName = userName.toUpperCase();
    const cookerName = name.toUpperCase();
    const title = `Kucharz ${cookerName} dodał(a) nowy przepis!`;
    const body = newTitle;
    const tag = uuid;
    const recipeID = "";
    await subscribe(title, body, tag, userID, recipeID);
  };

  return (
    <form
      onSubmit={submitForm}
      className="flex flex-col w-[95%] xl:w-4/5 mx-auto mb-[10vh]"
    >
      <section className="flex flex-col xl:flex-row justify-between w-full">
        {newImage === "" ? (
          <UploadImage setNewImage={setNewImage} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full xl:w-2/5">
            <div className="flex flex-col items-center justify-center w-full h-[40vh] xl:h-[50vh] border-red-900 border-dashed border-2 rounded-md relative">
              <Image
                src={newImage}
                width={500}
                height={500}
                alt="recipeImg"
                className="w-full h-full object-cover rounded-md "
              />
            </div>
            <button
              type="button"
              className="p-2 bg-red-900 text-white uppercase text-md font-semibold rounded-md hover:bg-red-950 duration-500 mt-2"
              onClick={() => setNewImage("")}
            >
              Zmień obraz
            </button>
          </div>
        )}
        <div className="w-full xl:w-[55%] flex flex-col mt-10 xl:mt-0">
          <div className="w-full flex flex-col xl:flex-row justify-center items-center ">
            <label
              className="font-semibold uppercase text-xl mb-3 xl:mb-0 xl:mr-3 "
              htmlFor="title"
            >
              Tytuł:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="wpisz tytuł"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="newRecipeInput font-semibold text-center w-[90%] xl:w-auto"
            />
          </div>
          {activeVoice !== "ingredientVoice" &&
            activeVoice !== "stepsVoice" &&
            activeVoice !== "descriptionVoice" &&
            activeVoice !== "shortInfoVoice" && (
              <VoiceLongText
                setNewText={setNewTitle}
                newText={newTitle}
                toastText="nagrywanie tytułu..."
                setActiveVoice={setActiveVoice}
              />
            )}
          <div className="w-full flex flex-col xl:flex-row justify-center items-center mt-10 xl:mt-0">
            <label
              className="font-semibold uppercase text-xl mb-3 xl:mb-0 xl:mr-3"
              htmlFor="shortInfo"
            >
              Krótki opis:
            </label>
            <textarea
              name="shortInfo"
              id="shortInfo"
              placeholder="wpisz krótki opis"
              required
              value={newShortInfo}
              onChange={(e) => setNewShortInfo(e.target.value)}
              className="newRecipeInput xl:mt-10 min-h-[30vh] xl:min-h-[20vh] w-[90%] xl:w-auto"
            ></textarea>
          </div>
          {activeVoice !== "ingredientVoice" &&
            activeVoice !== "stepsVoice" &&
            activeVoice !== "descriptionVoice" &&
            activeVoice !== "titleVoice" && (
              <VoiceLongText
                setNewText={setNewShortInfo}
                newText={newShortInfo}
                toastText="nagrywanie krótkiego opisu..."
                setActiveVoice={setActiveVoice}
              />
            )}
        </div>
      </section>
      <div className="w-full flex flex-col justify-center items-center mt-16 bg-red-50 p-4 rounded-md">
        <label
          className="font-semibold uppercase text-xl mb-5"
          htmlFor="category"
        >
          Kategorie:
        </label>
        <ul className="flex-grow flex items-center justify-center flex-wrap">
          {tags.map((tag, index) => {
            return (
              <li
                onClick={() => handleNewCategory(tag)}
                key={index}
                className={
                  newCategory.includes(tag)
                    ? "bg-red-900 text-white transition-all border-red-900 border-2 p-2 m-4 rounded-md cursor-pointer"
                    : "border-red-900 bg-[#ffffff] border-2 p-2 m-4 rounded-md cursor-pointer xl:hover:bg-red-900 xl:hover:text-white transition-all"
                }
              >
                {tag}
              </li>
            );
          })}
        </ul>
      </div>
      <section className="w-full xl:w-2/3 mx-auto flex flex-wrap items-center justify-center xl:justify-between my-[8vh]">
        <div className="flex flex-col w-1/2 xl:w-auto items-center justify-center">
          <label
            htmlFor="prepTime"
            className=" uppercase font-semibold text-base xl:text-lg  mt-5 text-gray-800"
          >
            przygotowanie
          </label>
          <div className="flex flex-col xl:flex-row items-center mt-4">
            <BsClockHistory className="text-3xl xl:text-4xl mb-4 xl:mb-0 text-red-900" />
            <input
              type="number"
              name="prepTime"
              id="prepTime"
              className="newRecipeInput w-20 mx-3 text-center"
              required
              min={0}
              value={newPrepTime === 0 ? "" : newPrepTime}
              onChange={(e) => setNewPrepTime(Number(e.target.value))}
            />
            <p>min.</p>
          </div>
        </div>

        <div className="flex flex-col w-1/2 xl:w-auto items-center justify-center">
          <label
            htmlFor="portion"
            className=" uppercase font-semibold text-base xl:text-lg  mt-5 text-gray-800"
          >
            ilość porcji
          </label>
          <div className="flex flex-col xl:flex-row items-center mt-4">
            <BsPeople className="text-3xl xl:text-4xl mb-4 xl:mb-0 text-red-900" />
            <input
              type="number"
              name="portion"
              id="portion"
              className="newRecipeInput w-20 mx-3 text-center"
              required
              min={0}
              value={newPortion === 0 ? "" : newPortion}
              onChange={(e) => setNewPortion(Number(e.target.value))}
            />
            <p>szt.</p>
          </div>
        </div>
        <div className="flex flex-col w-1/2 xl:w-auto items-center justify-center">
          <label
            id="sort"
            className=" uppercase font-semibold text-base xl:text-lg  mt-5 text-gray-800"
          >
            Poziom trudności:
          </label>
          <div className="flex flex-col xl:flex-row items-center mt-4">
            <BsBarChart className="text-3xl xl:text-4xl mb-4 xl:mb-0 text-red-900" />
            <select
              name="level"
              id="level"
              className="newRecipeInput w-auto mx-3 text-center"
              onChange={(e) => handleLevel(e.target.value)}
              value={newLevel}
            >
              {levels.map((option, index) => {
                return (
                  <option value={option} key={index}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </section>
      <section className="w-full my-[5vh] flex flex-col xl:flex-row justify-between items-start">
        <div className="w-full xl:w-1/3 flex flex-col">
          <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
            Składniki:
          </h2>
          {activeCategoryIngredients && (
            <div className="w-[95%] p-4 relative mx-auto xl:w-full min-h-[25vh] flex flex-col justify-center items-center bg-red-50 ">
              <button
                type="button"
                className="absolute top-2 right-5 "
                onClick={() => setActiveCategoryIngredients(false)}
              >
                <MdClose className="text-3xl text-red-900" />
              </button>
              <input
                type="text"
                value={newCategoryIngredients}
                onChange={(e) => setNewCategoryIngredients(e.target.value)}
                placeholder="wpisz nazwę kategorii składników"
                className="p-2 border-2 rounded mt-10 w-4/5 border-red-900 text-center uppercase"
              />
              <button type="button" onClick={handleAddCategoryIngredient}>
                <MdOutlineAddCircle className="text-3xl mt-5 text-green-900" />
              </button>
            </div>
          )}
          {deleteCategoryIngredients && (
            <div className="w-[95%] p-4 relative mx-auto xl:w-full min-h-[25vh] flex flex-col justify-center items-center bg-red-50 ">
              <button
                type="button"
                className="absolute top-2 right-5 "
                onClick={() => setDeleteCategoryIngredients(false)}
              >
                <MdClose className="text-3xl text-red-900" />
              </button>
              <h4 className="mb-3 text-center mt-10">
                wybierz kategorię którą chcesz usunąć wraz z jej składnikami
              </h4>
              <div className="w-full mx-auto flex flex-wrap justify-around items-center">
                {newIngredients.map((item, index) => {
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleDeleteCategoryIgredient(item.cate)}
                      className="border-red-900 uppercase bg-[#ffffff] border-2 p-2 mx-4 my-2 rounded-md cursor-pointer xl:hover:bg-red-900 xl:hover:text-white transition-all"
                    >
                      {item.cate}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!activeCategoryIngredients && !deleteCategoryIngredients && (
            <>
              <div className="w-[95%] mx-auto xl:w-full flex flex-col justify-center items-center">
                <div className="w-full mx-auto flex justify-around items-center mb-4">
                  <button
                    type="button"
                    className="flex items-center text-gray-600 border-2 p-1 rounded-md"
                    onClick={() => setActiveCategoryIngredients(true)}
                  >
                    dodaj kategorie <MdOutlineAddCircle className="ml-2" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center text-gray-600 border-2 p-1 rounded-md"
                    onClick={() => setDeleteCategoryIngredients(true)}
                  >
                    usuń kategorie <MdOutlineRemoveCircle className="ml-2" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-around w-full">
                  {newIngredients.map((item, index) => {
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() =>
                          setActiveCategoryIngredientsBtn(item.cate)
                        }
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
              </div>
              <ul className="w-[95%] mx-auto xl:w-full">
                {newIngredients.length > 0 &&
                  newIngredients
                    .filter(
                      (item) => item.cate === activeCategoryIngredientsBtn
                    )
                    .map((item, index) => {
                      return (
                        <div
                          key={`${activeCategoryIngredientsBtn}-${index}`}
                          className="ingredientAnim"
                        >
                          {item.names.map((item2, index2) => {
                            return (
                              <li
                                className={
                                  index2 === editingIngredient
                                    ? "text-base xl:text-lg font-bodyFont mb-2 border-b-2 py-2 flex items-center justify-between editAddRecipeItem rounded-md"
                                    : "text-base xl:text-lg font-bodyFont mb-2 border-b-2 py-2 flex items-center justify-between"
                                }
                                key={index2}
                              >
                                {item2}
                                <div className="flex items-center text-2xl">
                                  <Link
                                    to="editIgredient"
                                    spy={true}
                                    smooth={true}
                                    duration={1000}
                                    offset={-300}
                                  >
                                    <BiEdit
                                      className="mr-3 text-green-900 cursor-pointer"
                                      onClick={() => {
                                        setEditingIngredient(index2);
                                        setNewIgredient(item2);
                                      }}
                                    />
                                  </Link>

                                  <MdDeleteForever
                                    onClick={() =>
                                      handleDeleteIngedient(index2)
                                    }
                                    className="text-red-900 cursor-pointer"
                                  />
                                </div>
                              </li>
                            );
                          })}
                        </div>
                      );
                    })}

                {editingIngredient >= 0 ? (
                  <Element name="editIgredient">
                    <h3 className="text-center w-full uppercase text-xl mt-8 font-semibold">
                      Edycja:
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <input
                        type="text"
                        value={newIngredient}
                        onChange={(e) => setNewIgredient(e.target.value)}
                        className="newRecipeInput flex-grow text-left "
                      />
                      <GiConfirmed
                        className="ml-3 text-green-900 cursor-pointer text-2xl"
                        onClick={() => handleEditIngredient(editingIngredient)}
                      />
                    </div>
                  </Element>
                ) : (
                  <Element name="editIgredient">
                    <div>
                      <div className="flex items-center justify-between mt-8">
                        <input
                          type="text"
                          placeholder="dodaj nowy składnik"
                          value={newIngredient}
                          onChange={(e) => setNewIgredient(e.target.value)}
                          className="newRecipeInput flex-grow text-left text-base"
                        />
                        <MdOutlineAddCircle
                          className="ml-3 text-green-900 cursor-pointer text-4xl"
                          onClick={handleAddIngredient}
                        />
                      </div>

                      {activeVoice !== "stepsVoice" &&
                        activeVoice !== "descriptionVoice" &&
                        activeVoice !== "shortInfoVoice" &&
                        activeVoice !== "titleVoice" && (
                          <VoiceIngredient
                            newIngredients={newIngredients}
                            setNewIngredients={setNewIngredients}
                            toastText="powiedz nazwę składnika"
                            setActiveVoice={setActiveVoice}
                            activeCategoryIngredientsBtn={
                              activeCategoryIngredientsBtn
                            }
                            setActiveCategoryIngredientsBtn={
                              setActiveCategoryIngredientsBtn
                            }
                          />
                        )}
                    </div>
                  </Element>
                )}
              </ul>
            </>
          )}
        </div>
        <div className="xl:ml-[10vw] mt-20 xl:mt-0 w-full xl:w-auto  flex-grow flex flex-col">
          <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
            Instrukcje:
          </h2>
          <ul className="w-[95%] mx-auto xl:w-full">
            {newSteps.length > 0 &&
              newSteps.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      index === editingStep
                        ? "flex flex-col w-full mb-6 editAddRecipeItem"
                        : "flex flex-col w-full mb-6"
                    }
                  >
                    <div className="flex flex-nowrap items-center justify-between mb-2">
                      <p className="uppercase text-red-900 text-xl xl:text-2xl font-semibold font-headingFont mr-4">
                        krok {index + 1}
                      </p>
                      <span className="flex-grow h-[2px] bg-zinc-300 mr-5"></span>
                      <div className="flex items-center text-2xl mt-2">
                        <Link
                          to="editStep"
                          spy={true}
                          smooth={true}
                          duration={1000}
                          offset={-300}
                        >
                          <BiEdit
                            className="mr-3 text-green-900 cursor-pointer"
                            onClick={() => {
                              setEditingStep(index);
                              setNewStep(item);
                            }}
                          />
                        </Link>

                        <MdDeleteForever
                          onClick={() => handleDeleteStep(index)}
                          className="text-red-900 cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-lg font-bodyFont">{item}</p>
                  </div>
                );
              })}
            {editingStep >= 0 ? (
              <Element name="editStep">
                <h3 className="text-center w-full uppercase text-xl mt-8 font-semibold">
                  Edycja:
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <textarea
                    ref={textareaRef}
                    placeholder="dodaj nowy krok"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    className="newRecipeInput pl-10 flex-grow text-left min-h-[22vh] xl:min-h-[18vh]"
                  />
                  <GiConfirmed
                    className="ml-3 text-green-900 cursor-pointer text-2xl"
                    onClick={() => handleEditStep(editingStep)}
                  />
                </div>
              </Element>
            ) : (
              <Element name="editStep">
                <div>
                  <div className="flex items-center justify-between mt-8">
                    <textarea
                      ref={textareaRef}
                      placeholder="dodaj nowy krok"
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      className="newRecipeInput pl-10 flex-grow text-left min-h-[22vh] xl:min-h-[18vh]"
                    />
                    <MdOutlineAddCircle
                      className="ml-3 text-green-900 cursor-pointer text-4xl"
                      onClick={handleAddStep}
                    />
                  </div>
                  {activeVoice !== "ingredientVoice" &&
                    activeVoice !== "descriptionVoice" &&
                    activeVoice !== "shortInfoVoice" &&
                    activeVoice !== "titleVoice" && (
                      <VoiceLongText
                        setNewText={setNewStep}
                        newText={newStep}
                        toastText="powiedz nowy krok instrukcji"
                        setActiveVoice={setActiveVoice}
                      />
                    )}
                </div>
              </Element>
            )}
          </ul>
        </div>
      </section>
      <div className="w-full xl:w-[90%] flex justify-start items-start mx-auto my-[5vh] flex-col">
        <h2 className="flex items-center justify-between text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
          Opis: <span>(opcjonalne)</span>
        </h2>
        <textarea
          name="newDesription"
          id="newDesription"
          placeholder="Opis przepisu..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="newRecipeInput  min-h-[20vh] w-[98%] mx-auto xl:w-full"
        ></textarea>
        {activeVoice !== "ingredientVoice" &&
          activeVoice !== "stepsVoice" &&
          activeVoice !== "shortInfoVoice" &&
          activeVoice !== "titleVoice" && (
            <VoiceLongText
              setNewText={setNewDescription}
              newText={newDescription}
              toastText="nagrywanie..."
              setActiveVoice={setActiveVoice}
            />
          )}
      </div>
      <div className="w-full xl:w-[90%] flex justify-start items-start mx-auto mt-[5vh] mb-[10vh] flex-col">
        <h2 className="flex items-center justify-between text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
          Źródło: <span>(opcjonalne)</span>
        </h2>
        <textarea
          name="newSource"
          id="newSource"
          placeholder="Źródło przepisu..."
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          className="newRecipeInput  min-h-[15vh] w-[98%] mx-auto xl:w-full"
        ></textarea>
      </div>
      <div className="mx-auto">
        {disableBtn ? (
          <button
            disabled={true}
            type="button"
            className="bg-red-800 opacity-50 saturate-0 rounded-full font-medium py-2 px-6 text-lg text-white"
          >
            Zapisz
          </button>
        ) : (
          <ConfirmBtn text="Zapisz" />
        )}
      </div>
    </form>
  );
};

export default AddRecipeComponent;
