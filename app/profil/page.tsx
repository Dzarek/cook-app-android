import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import ProfilComponent from "@/components/ProfilComponent";
import { GiChefToque } from "react-icons/gi";
import { getOneUser, getRecipes } from "@/lib/actions";

const Profil = async () => {
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

  const currentUser = await getOneUser(session.uid);
  const userRecipes = await getRecipes(session.uid);
  const sortedRecipes = userRecipes?.sort(
    (a, b) => b.createdTime - a.createdTime
  );

  const userID = session.uid;

  return (
    <div className="page w-screen">
      <header className="text-center w-full py-[10vh] flex justify-center items-center">
        <GiChefToque className="text-3xl xl:text-5xl text-red-900  mr-5 recipeRotate4" />
        <h1 className="max-w-[70%] xl:max-w-auto text-lg text-center xl:text-3xl font-bold font-bodyFont">
          Kucharz - {currentUser && currentUser.userName}
        </h1>
        <GiChefToque className="text-3xl xl:text-5xl text-red-900 ml-5 recipeRotate2" />
      </header>
      {currentUser && sortedRecipes && (
        <ProfilComponent
          userID={userID}
          currentUser={currentUser}
          userRecipes={sortedRecipes}
        />
      )}
    </div>
  );
};

export default Profil;
