import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import AddRecipeComponent from "@/components/AddRecipeComponent";
import { GiNotebook } from "react-icons/gi";

const NewRecipePage = async ({
  searchParams,
}: {
  searchParams: { edycja: string };
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="page flex flex-col items-center justify-center">
        <p className="text-2xl">Odmowa dostępu!</p>
        <Link
          href="/logowanie"
          className="mt-5 p-2 rounded-md bg-red-900 text-white"
        >
          {" "}
          zaloguj się
        </Link>
      </div>
    );
  }

  const userID = session.uid;
  const userName = session.user.name;
  const { edycja } = searchParams;

  return (
    <div className="page w-screen">
      <header className="text-center w-full py-[10vh] flex justify-center items-center">
        <GiNotebook className="text-2xl xl:text-4xl text-red-900  mr-5 recipeRotate" />
        <h1 className="max-w-[70%] xl:max-w-auto text-lg text-center xl:text-3xl font-bold font-bodyFont">
          {edycja
            ? "Edycja Istniejącego Przepisu"
            : "Tworzenie Nowego Przepisu"}
        </h1>
        <GiNotebook className="text-2xl xl:text-4xl text-red-900 ml-5 recipeRotate2" />
      </header>
      <AddRecipeComponent
        edycja={edycja}
        userID={userID}
        userName={userName ? userName : ""}
      />
    </div>
  );
};

export default NewRecipePage;
