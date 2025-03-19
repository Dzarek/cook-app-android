import Image from "next/image";
import { BsClockHistory } from "react-icons/bs";
import { BsBarChart } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { FaSpoon } from "react-icons/fa6";
import { BiFork } from "react-icons/bi";
import { getAllRecipes } from "@/lib/actions";
import LikeControl from "@/components/LikeControl";
import NativeShareButton from "@/components/ShareBtn";
import AddComent from "@/components/AddComment";
import RecipeIngredients from "@/components/RecipeIngredients";

const OneRecipePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const allRecipes = await getAllRecipes();

  const oneRecipe = allRecipes.find((recipe) => recipe.id === id);

  // const ingredients2 = [
  //   {
  //     id: "1",
  //     cate: "aaa",
  //     names: ["aaa", "bbb", "vvv"],
  //   },
  //   {
  //     id: "2",
  //     cate: "xxx",
  //     names: ["aaa2", "bbb2", "vvv"],
  //   },
  // ];

  if (oneRecipe) {
    const {
      id,
      title,
      image,
      prepTime,
      level,
      category,
      author,
      description,
      steps,
      ingredients,
      shortInfo,
      portion,
      likes,
      source,
      comments,
    } = oneRecipe;
    return (
      <div className="page w-full">
        <header className="border-b-4 border-red-100 xl:border-b-0 relative text-center bg-red-100  xl:mb-[10vh] w-full pt-[10vh] pb-[15vh] xl:pb-[10vh] flex justify-center items-center">
          <FaSpoon className="text-2xl xl:text-3xl text-red-900  mr-6 spoonRotate" />
          <h1 className="max-w-[65%] xl:max-w-auto text-lg text-center xl:text-2xl font-bold font-bodyFont uppercase">
            {title}
          </h1>
          <BiFork className="text-2xl xl:text-4xl text-red-900 ml-5 forkRotate" />
          <NativeShareButton
            url={`https://stepkigotuja.netlify.app/przepisy/${id}`}
            title={title}
          />
          <LikeControl likes={likes} userID={author.authorID} recipeID={id} />
        </header>
        <main className=" w-[100%] xl:w-4/5 mx-auto flex flex-col xl:flex-row justify-between items-center">
          <Image
            src={image}
            blurDataURL={image}
            width={500}
            height={500}
            alt={title}
            className="w-full bg-red-100 shadow-lg shadow-gray-500/50 border-y-2 md:border-2 border-red-900 lg:w-2/5 h-[40vh] md:h-[50vh] object-cover rounded-b-lg md:rounded-lg lg:mt-5 xl:mt-0"
          />
          <section className="w-[95%] mx-auto xl:mx-0 xl:w-[55%] mt-[5vh] xl:mt-0">
            <p className="w-[90%] xl:w-auto mx-auto text-lg text-center xl:text-left font-bodyFont mb-10 pb-10 xl:pb-5 border-b-2 ">
              {shortInfo}
            </p>
            <div className="w-full xl:w-4/5 mx-auto flex flex-wrap justify-around items-center xl:my-12">
              <div className="w-2/5 xl:w-auto flex flex-col items-center justify-center">
                <BsClockHistory className="text-3xl xl:text-4xl text-red-900" />
                <p className="uppercase font-semibold text-sm xl:text-base  mt-5 text-gray-800">
                  przygotowanie
                </p>
                <span className="text-gray-500 font-bold text-lg">
                  {prepTime} min.
                </span>
              </div>
              <div className="w-2/5 xl:w-auto flex flex-col items-center justify-center">
                <BsPeople className="text-3xl xl:text-4xl text-red-900" />
                <p className="uppercase font-semibold text-sm xl:text-base  mt-5 text-gray-800">
                  ilość porcji
                </p>
                <span className="text-gray-500 font-bold text-lg">
                  {portion} szt.
                </span>
              </div>

              <div className="w-full xl:w-auto mt-5 xl:mt-0 flex flex-col items-center justify-center">
                <BsBarChart className="text-3xl xl:text-4xl text-red-900" />
                <p className="uppercase font-semibold text-sm xl:text-base  mt-5 text-gray-800">
                  poziom trudności
                </p>
                <span className="text-gray-500 font-bold text-lg text-center">
                  {level}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center xl:justify-start flex-wrap mt-14">
              <h4 className="w-full xl:w-auto text-center font-semibold uppercase text-xl xl:mr-3 mb-5 xl:mb-0">
                Kategorie:
              </h4>
              {category.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="bg-red-900 px-2 py-1 text-white rounded-md mx-2 font-semibold"
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </section>
        </main>
        <div className="w-[90%] xl:w-4/5 flex flex-col xl:flex-row justify-between items-start mx-auto my-[10vh]">
          <section className="w-full xl:w-[30%] flex flex-col">
            <h2 className="text-xl xl:text-2xl font-medium font-bodyFont  w-full bg-red-900 text-white rounded-md px-2 py-1">
              Składniki:
            </h2>
            {/* <ul className="w-[98%] mx-auto xl:w-full">
              {ingredients.map((item, index) => {
                return (
                  <li
                    className="text-base xl:text-lg font-bodyFont mb-4 border-b-2 pb-2"
                    key={index}
                  >
                    {item}
                  </li>
                );
              })}
            </ul> */}
            <RecipeIngredients ingredients={ingredients} />
          </section>
          <section className="mt-10 xl:mt-0  w-full xl:w-[60%] flex-grow xl:flex-grow-0 flex flex-col">
            <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
              Instrukcje:
            </h2>
            <ul className="w-[98%] mx-auto xl:w-full">
              {steps.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col w-full mb-4 xl:mb-6"
                  >
                    <div className="flex flex-nowrap items-center justify-between mb-2">
                      <p className="uppercase text-red-900 text-xl xl:text-2xl font-semibold font-headingFont mr-4">
                        krok {index + 1}
                      </p>
                      <span className="flex-grow h-[2px] bg-zinc-300"></span>
                    </div>
                    <p className="text-base xl:text-lg font-bodyFont">{item}</p>
                  </div>
                );
              })}
            </ul>
          </section>
        </div>
        {description && description !== "" && (
          <div className="w-[90%] xl:w-4/5 flex justify-start items-start flex-nowrap mx-auto my-[5vh] xl:my-[10vh] flex-col">
            <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
              Opis:
            </h2>
            <p className="w-[98%] mx-auto ml-0 xl:w-full text-base xl:text-lg font-bodyFont text-justify break-words">
              {description}
            </p>
          </div>
        )}
        {source && source !== "" && (
          <div className="w-[90%] xl:w-4/5 flex justify-start items-start mx-auto my-[5vh] xl:my-[10vh] flex-col">
            <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
              Źródło:
            </h2>
            <p className="italic w-[98%] mx-auto xl:w-full text-base xl:text-lg font-bodyFont text-justify break-words">
              {source}
            </p>
          </div>
        )}
        <div className="w-full mx-auto flex items-center justify-center mt-20 mb-14">
          <h4 className="font-semibold uppercase text-lg xl:text-2xl mr-4 text-zinc-400">
            Kucharz:
          </h4>
          <Image
            src={author.authorAvatar.replace("assets/", "")}
            width={100}
            height={100}
            alt="avatar"
            className="rounded-full w-14 h-14 object-cover"
          />
          <span className="px-2 py-1 text-lg xl:text-xl text-red-900 rounded-md font-semibold font-bodyFont">
            {author.authorName}
          </span>
        </div>
        <AddComent
          comments={comments || []}
          userID={author.authorID}
          recipeID={id}
          recipeName={title}
        />
      </div>
    );
  } else {
    return (
      <div className="page w-screen">
        <header className="text-center w-full py-[10vh] flex justify-center items-center">
          <h1 className="text-3xl font-bold font-bodyFont">
            Nie znaleziono przepisu
          </h1>
        </header>
      </div>
    );
  }
};

export default OneRecipePage;
