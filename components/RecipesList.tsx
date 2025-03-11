import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

const RecipesList = ({ recipes }: { recipes: Recipe[] }) => {
  return (
    <div className="mx-auto my-[5vh] flex flex-col xl:flex-row w-full items-center justify-center flex-wrap">
      {recipes.map((recipe) => {
        const { id, title, image, prepTime, portion, author, category, likes } =
          recipe;
        return (
          <Link
            href={`/przepisy/${id}`}
            className="recipe  bg-neutral-50 
            cursor-pointer overflow-hidden relative transition-all duration-300 hover:-translate-y-2  rounded-lg shadow-xl flex flex-row items-center justify-between  before:absolute before:w-full hover:before:top-0 before:duration-300 before:-top-1 before:h-1 before:bg-red-900 
            "
            key={id}
          >
            <Image
              src={image}
              blurDataURL={image}
              width={500}
              height={500}
              className="w-full h-1/2 2xl:h-[55%] object-cover recipe-img "
              alt={title}
            />
            <section className="h-1/2  2xl:h-[45%] w-full flex flex-col items-center justify-between pb-2">
              <h5 className="text-sm xl:text-base bg-zinc-800 text-white p-1 text-center font-bold mb-2 2xl:mb-4 w-full uppercase">
                {title}
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
                </span>{" "}
                <span className="hidden 2xl:inline">|</span>
                <span>
                  {" "}
                  Autor:{" "}
                  <strong className="text-red-800">{author.authorName}</strong>
                </span>
              </p>
              <p className="flex justify-center items-center">
                <FaHeart className="mr-2 text-gray-500" />{" "}
                <strong className="text-red-800">{likes.length}</strong>
              </p>
            </section>
          </Link>
        );
      })}
    </div>
  );
};

export default RecipesList;
