import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import RankingDate from "@/components/uiverse/RankingDate";
import { getRankingUsers } from "@/lib/actions";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import AwardModal from "@/components/AwardModal";

const RankingModal = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="page flex flex-col items-center justify-center">
        <p className="text-2xl">Odmowa dostępu!</p>
        <Link
          href="/logowanie"
          className="mt-5 p-2 rounded-md bg-red-900 text-white"
        >
          zaloguj się
        </Link>
      </div>
    );
  }

  const allUsers = await getRankingUsers();
  const userID = session.uid;

  // Sortowanie użytkowników według liczby polubień
  const sortedUsers = allUsers.sort((a, b) => {
    const likesA = a.itemsArray.reduce(
      (sum, item) => sum + item.likes.length,
      0
    );
    const likesB = b.itemsArray.reduce(
      (sum, item) => sum + item.likes.length,
      0
    );
    return likesB - likesA; // Sortowanie malejące
  });

  let currentPosition = 1;
  let previousLikes: any = null;

  return (
    <div className="mt-[10vh] h-auto xl:h-[80vh] w-[90vw] xl:w-[80vw] mx-auto flex flex-col">
      <h2 className="flex justify-center items-center mx-auto text-red-900 w-full text-center mt-[10vh] text-xl xl:text-2xl font-bold  mb-[5vh]">
        <FaStar className="text-xl text-yellow-500 mx-2" />
        <FaStar className="text-xl text-yellow-500 mx-2" />
        <FaStar className="text-xl text-yellow-500 mx-2" />
        <span className="mx-3 xl:mx-5">Ranking Kucharzy</span>
        <FaStar className="text-xl text-yellow-500 mx-2" />
        <FaStar className="text-xl text-yellow-500 mx-2" />
        <FaStar className="text-xl text-yellow-500 mx-2" />
      </h2>
      <div className="flex justify-between w-full flex-col xl:flex-row xl:h-[55vh]">
        <div className="w-full xl:w-[45%] xl:pr-16 xl:border-r-2 border-red-900 h-full flex flex-col justify-center">
          <p className="my-[2vh] xl:my-[3vh] text-base xl:text-lg text-center xl:text-left">
            Dodawaj smaczne przepisy w aplikacji{" "}
            <span className="font-logoFont text-xl xl:text-2xl text-red-900 font-bold">
              Stępki Gotują
            </span>
            ! Im więcej zdobędzisz polubień od innych kucharzy, tym wyżej
            znajdziesz się w rankingu.
          </p>
          <p className="my-[2vh] xl:my-[3vh] text-base xl:text-lg text-center xl:text-left">
            Kucharz z największą liczbą smacznych przepisów, oprócz szacunku
            reszty kucharzy, zdobędzie (lub obroni) tytuł MISTRZA KUCHNI!{" "}
            <AwardModal />
          </p>
          <div className="my-[2vh] xl:my-[3vh] flex items-center justify-center xl:justify-start ">
            <p className="mr-5 text-base xl:text-lg">Podsumowanie sezonu: </p>
            <RankingDate />
          </div>
        </div>

        <ul className="my-10 xl:my-0 rankingList h-full w-full xl:w-[55%] overflow-y-auto flex flex-col items-center justify-start px-0 xl:pl-[2vw] bg-white">
          {sortedUsers.map((user, index) => {
            const numberOfLikes = user.itemsArray.reduce(
              (sum, item) => sum + item.likes.length,
              0
            );

            // Sprawdzenie czy obecny użytkownik ma tyle samo polubień co poprzedni
            if (previousLikes !== null && previousLikes !== numberOfLikes) {
              currentPosition = index + 1; // Ustawienie nowej pozycji
            }

            previousLikes = numberOfLikes; // Zapisanie liczby polubień obecnego użytkownika

            return (
              <li
                key={user.id}
                className={`flex items-center justify-start w-full xl:w-[90%] border-b-2 py-3 xl:py-4 rounded-md px-1 xl:px-4 ${
                  userID === user.id && "bg-red-50 "
                }`}
              >
                <span className="text-xl xl:text-3xl font-bold text-gray-500 mr-2 xl:mr-10">
                  {numberOfLikes === 0 ? sortedUsers.length : currentPosition}.
                </span>
                <Image
                  src={user.avatar.replace("assets/", "")}
                  height={60}
                  width={60}
                  alt="avatar"
                  className="rounded-full object-cover border-[1px] xl:border-[2px] border-red-900 mr-2 xl:mr-5 h-[40px] w-[40px] xl:h-[60px] xl:w-[60px]"
                />
                <h4 className="capitalize text-base xl:text-xl font-semibold mr-2 xl:mr-5">
                  {user.userName}
                </h4>
                <p className="ml-auto flex items-center text-base xl:text-xl border-l-2 border-red-950 pl-3 xl:pl-5">
                  smaczne przepisy:{" "}
                  <FaHeart className="text-red-900 ml-3 xl:ml-5" />
                  <span className="ml-1 text-xl xl:text-2xl font-bold">
                    {numberOfLikes}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RankingModal;
