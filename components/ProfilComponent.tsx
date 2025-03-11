"use client";

import Image from "next/image";
import { MdChangeCircle } from "react-icons/md";
import { FaStar, FaRegStar } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { useState, useEffect } from "react";

import AvatarModal from "@/components/AvatarModal";
import RecipesListProfile from "@/components/RecipeListProfile";

import {
  updateAvatar,
  updateName,
  changePassword,
  checkPassword,
} from "@/lib/user.actions";
import toast from "react-hot-toast";
import { useGlobalContext } from "./authContext";
import { ImCross } from "react-icons/im";

type ProfilTypes = {
  currentUser: {
    userName?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  userRecipes: Recipe[];
  userID: string;
};

const ProfilComponent = ({ currentUser, userRecipes, userID }: ProfilTypes) => {
  const [nick, setNick] = useState(currentUser.userName || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [avatar, setAvatar] = useState(
    currentUser.avatar
      ? currentUser.avatar.replace("assets/", "")
      : "/images/avatars/avatar0.webp"
  );
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [showLvl, setShowLvl] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  const { setName, setAvatar: setAvatarContext } = useGlobalContext();

  useEffect(() => {
    if (
      nick !== currentUser.userName ||
      email !== currentUser.email ||
      avatar !== currentUser.avatar
    ) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  }, [nick, email, avatar]);

  const totalLikes = userRecipes.reduce(
    (sum, recipe) => sum + recipe.likes.length,
    0
  );

  let level = 0;
  if (totalLikes > 24) {
    level = 5;
  } else if (totalLikes > 19) {
    level = 4;
  } else if (totalLikes > 14) {
    level = 3;
  } else if (totalLikes > 9) {
    level = 2;
  } else if (totalLikes > 2) {
    level = 1;
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nick !== currentUser.userName) {
      await updateName(nick);
      setName(nick);
    }
    if (avatar !== currentUser.avatar) {
      await updateAvatar(avatar);
      setAvatarContext(avatar);
    }
    if (email !== currentUser.email) {
      setOpenPasswordModal(true);
    }
  };

  const handleCheckPassword = async () => {
    await checkPassword(confirmPasswordInput, email);
    setOpenPasswordModal(false);
    setConfirmPasswordInput("");
  };

  const handleUpdatePassword = async () => {
    await changePassword();
    toast("Link do zmiany hasła został wysłany!", {
      icon: "✔",
      style: {
        borderRadius: "10px",
        background: "#052814",
        color: "#fff",
      },
    });
  };

  return (
    <>
      <main className="flex flex-col xl:flex-row justify-between items-strech w-full mx-auto">
        <section className="w-full xl:w-2/6 border-t-2 border-red-950 bg-red-100 ">
          <h3 className="uppercase text-xl font-semibold bg-red-950 text-white p-2 text-center ">
            Profil:
          </h3>
          <div className="pb-12 flex flex-col w-full xl:w-4/5 items-center justify-center mx-auto mt-10">
            <div className="rounded-full w-4/5 mb-10 mx-auto flex flex-col items-center justify-center ">
              <Image
                src={avatar}
                width={400}
                height={400}
                alt="avatar"
                className="rounded-full w-4/5  object-cover border-2 border-red-900 "
              />
              <button
                onClick={() => setOpenAvatarModal(true)}
                className="bg-white mt-3 text-md flex items-center justify-center  p-2 px-3 font-semibold rounded-md hover:bg-red-900 hover:text-white transition-all changeAvatarBtn"
              >
                zmień avatara{" "}
                <MdChangeCircle className="text-xl ml-3 text-red-800" />
              </button>
            </div>
            <form
              onSubmit={handleUpdateProfile}
              className="w-4/5 xl:w-full flex flex-col items-center justify-center"
            >
              <div className="w-full flex flex-col xl:flex-row justify-center items-center my-3">
                <label
                  htmlFor="nick"
                  className="font-bold uppercase text-lg mb-2 xl:mb-0 xl:mr-5 text-red-900"
                >
                  Nick:
                </label>
                <input
                  type="text"
                  name="nick"
                  id="nick"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  className="profilInput font-semibold text-center w-full xl:w-auto"
                />
              </div>
              <div className="w-full flex flex-col xl:flex-row justify-center items-center my-3">
                <label
                  htmlFor="nick"
                  className="font-bold uppercase text-lg  mb-2 xl:mb-0 xl:mr-5 text-red-900"
                >
                  Email:
                </label>
                <input
                  type="text"
                  name="nick"
                  id="nick"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="profilInput font-semibold text-center w-full xl:w-auto"
                />
              </div>

              <button
                type="submit"
                disabled={disabledBtn}
                className={
                  disabledBtn
                    ? "bg-zinc-500 mb-10 mt-5 text-zinc-300 opacity-45 w-1/2 xl:w-1/3  block lowercase p-2 xl:p-1 px-2 font-semibold rounded-md  transition-all"
                    : "bg-red-900 mb-10 mt-5 text-white w-1/2 xl:w-1/3  block lowercase p-2 xl:p-1 px-2 font-semibold rounded-md  transition-all duration-300 cursor-pointer hover:bg-red-950 profileBtnSaveChanges"
                }
              >
                zapisz zmiany
              </button>
            </form>
            <div className="w-full flex flex-col xl:flex-row justify-start items-center mb-10">
              <p className="font-bold uppercase text-lg  mb-2 xl:mb-0 xl:mr-3 text-red-900">
                Hasło:
              </p>
              <button
                onClick={handleUpdatePassword}
                type="button"
                className="bg-white uppercase p-2 px-5 xl:px-3 font-semibold rounded-md hover:bg-red-900 hover:text-white transition-all text-base"
              >
                Wyślij link do zmiany hasła
              </button>
            </div>
            <div className="w-full bg-white p-5 rounded-md">
              {showLvl && (
                <div className="rounded-md fixed p-4 z-10 top-[50%] left-[50%] w-4/5 xl:w-[30vw] h-[45vh] xl:h-[40vh] translate-x-[-50%] translate-y-[-50%] bg-zinc-100 border-2 border-red-900 flex flex-col justify-center items-center text-center">
                  <p className="mb-4 text-center font-semibold">
                    Poziom kucharza zależny jest <br /> od ilości polubionych
                    przepisów:
                  </p>
                  <ul>
                    <li className="flex items-center justify-start">
                      {">=3 ="} <FaStar className="ml-1" />
                    </li>
                    <li className="flex items-center justify-start">
                      {">=10 ="} <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                    </li>
                    <li className="flex items-center justify-start">
                      {">=15 ="} <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                    </li>
                    <li className="flex items-center justify-start">
                      {">=20 ="} <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                    </li>
                    <li className="flex items-center justify-start">
                      {">=25 ="} <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                      <FaStar className="ml-1" />
                    </li>
                  </ul>
                </div>
              )}
              <p className="text-zinc-900 w-full xl:text-base font-bold font-bodyFont flex items-center justify-center">
                Liczba dodanych przepisów:{" "}
                <span className="text-white font-bold text-xl bg-red-900 rounded-md py-1 px-3 ml-2">
                  {userRecipes.length}
                </span>
              </p>
              <p className="text-zinc-900 text-md font-bold font-bodyFont flex justify-center  mt-5">
                <BsQuestionCircleFill
                  onMouseEnter={() => setShowLvl(true)}
                  onMouseLeave={() => setShowLvl(false)}
                  className="lvlAsk mr-2 text-sm"
                />{" "}
                <span className="mr-2">Poziom Kucharza:</span>{" "}
                {[...Array(level)].map((item, index) => {
                  return <FaStar className="starIcon " key={index} />;
                })}
                {[...Array(5 - level)].map((item, index) => {
                  return (
                    <FaRegStar className="starIcon starRotate" key={index} />
                  );
                })}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full xl:w-4/6 border-t-2 border-red-950">
          <h3 className="uppercase text-xl font-semibold bg-red-900 text-white p-2 text-center ">
            Moje przepisy:
          </h3>
          <div className="px-[5vw] w-full xl:w-auto">
            <RecipesListProfile recipes={userRecipes} userID={userID} />
          </div>
        </section>
      </main>
      {openAvatarModal && (
        <AvatarModal
          setOpenAvatarModal={setOpenAvatarModal}
          activeAvatar={avatar}
          setActiveAvatar={setAvatar}
        />
      )}
      {openPasswordModal && (
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] xl:w-[40vw] h-[60vh] xl:h-[50vh] bg-white rounded-md border-2 border-red-900 flex flex-col items-center justify-center p-4 text-center">
          <ImCross
            className="absolute top-5 right-5 text-red-900 text-2xl cursor-pointer hover:text-red-950"
            onClick={() => setOpenPasswordModal(false)}
          />
          <h3 className="uppercase mb-10 font-semibold text-red-900 text-lg xl:text-2xl">
            Zmiana adresu email
          </h3>
          <p className="text-lg mb-5 xl:mb-0">
            Aby zmienić adres email wymagane jest potwierdzenie konta hasłem.
          </p>
          <input
            type="password"
            className=" text-black border-2 border-red-900 text-center rounded-md p-2 my-3 w-full xl:w-2/4"
            value={confirmPasswordInput}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
            required
            placeholder="wpisz hasło"
          />
          <button
            type="button"
            onClick={() => handleCheckPassword()}
            className="bg-red-900 mb-10 mt-5 text-white w-1/3  block p-2 px-2 font-semibold rounded-md  transition-all duration-300 cursor-pointer uppercase"
          >
            Potwierdź
          </button>
        </div>
      )}
    </>
  );
};

export default ProfilComponent;
