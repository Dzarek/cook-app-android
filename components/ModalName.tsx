"use client";

import { updateUser } from "@/lib/user.actions";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmBtn from "./uiverse/ConfirmBtn";
import Image from "next/image";
import AvatarModal from "./AvatarModal";

type ModalType = {
  name: string;
  setName: (name: string) => void;
  setModalName: (modalName: boolean) => void;
  email: string;
  avatar: string;
  setAvatar: (avatar: string) => void;
};

const ModalName = ({
  name,
  setName,
  setModalName,
  email,
  avatar,
  setAvatar,
}: ModalType) => {
  const [openAvatarModal, setOpenAvatarModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && name !== "") {
      updateUser(name, avatar);
      setModalName(false);
    } else {
      toast("Proszę uzupełnić nazwę użytkownika", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.8)] w-screen h-screen z-30 fixed top-0 left-0 flex items-center justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white py-10 px-3 xl:p-3 w-[95vw] xl:w-[50vw] min-h-[75vh] rounded-md flex flex-col items-center justify-center"
      >
        <h3 className="text-xl xl:text-2xl font-normal mb-5 xl:mb-10">
          Witaj w aplikacji{" "}
          <span className="text-2xl xl:text-3xl mr-1 text-red-900 font-bold font-logoFont">
            Stępki Gotują
          </span>
          !
        </h3>
        <div className="flex flex-col items-center justify-around w-full">
          <section className="flex flex-col items-center justify-center">
            <label className="text-lg mb-3" htmlFor="name">
              Wprowadź swój nick:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="nazwa użytkownika"
              required
              minLength={3}
              className="adminInput"
            />
          </section>
          <section className="flex flex-col items-center justify-center">
            <label className="text-lg mb-3 mt-3" htmlFor="name">
              Wybierz avatara:
            </label>
            <div className="flex items-center justify-center">
              <Image
                src={avatar}
                width={70}
                height={70}
                alt="avatar"
                className="rounded-full h-[70px] w-[70px] border-2 border-red-900 "
              />
              <button
                type="button"
                onClick={() => setOpenAvatarModal(true)}
                className="p-2 ml-3 bg-red-900 text-white font-semibold uppercase rounded-md hover:bg-red-950 transition-all duration-500"
              >
                zmień
              </button>
            </div>
          </section>
        </div>
        <p className="mt-10 mb-10 xl:mb-5 text-center xl:text-lg">
          Na adres <span className="text-red-900 font-medium">{email}</span>{" "}
          zostanie przesłany link do zmiany hasła. <br /> (sprawdź również spam)
        </p>
        <ConfirmBtn text="Potwierdź" />
      </form>
      {openAvatarModal && (
        <AvatarModal
          setOpenAvatarModal={setOpenAvatarModal}
          activeAvatar={avatar}
          setActiveAvatar={setAvatar}
        />
      )}
    </div>
  );
};

export default ModalName;
