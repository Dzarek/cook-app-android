import RecipesList from "@/components/RecipesList";
import { tags } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { getAllUsers, getAllRecipes } from "@/lib/actions";

const welcomeVideo = "/video/intro3.mp4";

export const revalidate = 60; // Regenerate the page every 60 seconds

export default async function Home() {
  const authors = await getAllUsers();
  const allRecipes = await getAllRecipes();

  const lastFiveRecipes = allRecipes
    .sort((a, b) => b.createdTime - a.createdTime)
    .slice(0, 5);

  const countCategoriesByTags = (recipes: Recipe[], tags: string[]) => {
    const categoryCount: { [key: string]: number } = {};
    tags.forEach((tag) => {
      categoryCount[tag] = 0;
    });
    recipes.forEach((recipe) => {
      recipe.category.forEach((cat) => {
        if (tags.includes(cat)) {
          categoryCount[cat]++;
        }
      });
    });
    const resultArray = Object.keys(categoryCount).map((tag) => ({
      tag,
      count: categoryCount[tag],
    }));

    return resultArray;
  };

  const categories = countCategoriesByTags(allRecipes, tags);

  return (
    <div className="main mx-auto w-screen">
      <header className="relative mx-auto flex justify-center items-center w-full  mt-[12vh] flex-col xl:flex-row xl:h-[65vh]">
        <div className="w-full xl:w-4/6 h-full relative">
          <video
            src={welcomeVideo}
            autoPlay
            muted
            loop
            playsInline
            // type="video/mp4"
            className="w-full h-full object-fill border-r-[1px] border-t-[1px] border-white"
          ></video>
        </div>

        <div className="tags w-full xl:w-2/6 h-full bg-zinc-900 text-white p-5 flex flex-col items-center justify-center">
          <h3 className="text-center mb-10 xl:mb-7 text-2xl font-bold uppercase font-headingFont">
            Kategorie:
          </h3>
          <ul className="flex flex-wrap items-center justify-around  text-white text-base capitalize text-center">
            {categories.map((item, index) => {
              return (
                <>
                  {item.tag === "śniadanie" ? (
                    <Link
                      className="text-sm md:text-sm mb-5 xl:mb-4 w-[35%] bg-red-950 p-2 rounded-md hover:bg-red-900 transition-colors"
                      key={index}
                      href={{
                        pathname: "/przepisy",
                        query: { kategoria: "sniadanie" },
                      }}
                    >
                      {item.tag} ({item.count})
                    </Link>
                  ) : (
                    <Link
                      className="text-sm md:text-sm mb-5 xl:mb-4 w-[35%] bg-red-950 p-2 rounded-md hover:bg-red-900 transition-colors"
                      key={index}
                      href={{
                        pathname: "/przepisy",
                        query: { kategoria: item.tag },
                      }}
                    >
                      {item.tag} ({item.count})
                    </Link>
                  )}
                </>
              );
            })}
          </ul>
        </div>
      </header>
      <main className="mt-[8vh] w-4/5 xl:w-3/4 mx-auto">
        <section>
          <p className="text-center text-lg">
            Szukasz nowych kulinarnych inspiracji? Nasza strona to kopalnia
            sprawdzonych przepisów rodzinnych, które pomogą Ci urozmaicić
            codzienne posiłki i zaskoczyć bliskich. Łatwe instrukcje i piękne
            zdjęcia sprawią, że gotowanie stanie się czystą przyjemnością.
          </p>
        </section>
        <h3 className="text-2xl font-bold text-center font-headingFont mt-[10vh]">
          Ostatnio dodane przepisy:
        </h3>
        <RecipesList recipes={lastFiveRecipes} />
        {authors && (
          <section className="my-[10vh] w-full xl:w-4/5 mx-auto">
            <div className="bg-red-950 w-[45vw] xl:w-[35vw] h-[2px] mb-10 mx-auto"></div>
            <h3 className="text-2xl font-bold text-center font-headingFont ">
              Członkowie:
            </h3>
            <ul className=" mt-5 flex flex-wrap justify-evenly xl:justify-center items-center w-full xl:w-auto">
              {authors.map((author) => {
                return (
                  <li
                    key={author.id}
                    className="flex flex-col items-center justify-center my-2 xl:m-2 w-1/3 xl:w-auto"
                  >
                    <Image
                      src={author.avatar.replace("assets/", "")}
                      width={100}
                      height={100}
                      alt="avatar"
                      className="rounded-full w-14 h-14 object-fill border-[2px] border-red-950"
                    />
                    <span className="px-2 py-1 text-sm text-red-900 rounded-md font-semibold font-bodyFont">
                      {author.userName}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
