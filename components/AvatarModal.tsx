"use client";

import { avatars } from "@/constants";
import { getAllUsers } from "@/lib/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

interface ModalProps {
  setOpenAvatarModal: (open: boolean) => void;
  activeAvatar: string;
  setActiveAvatar: (avatar: string) => void;
}

const AvatarModal = ({
  setOpenAvatarModal,
  activeAvatar,
  setActiveAvatar,
}: ModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [category, setCategory] = useState("wszystkie");

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();
      if (allUsers) {
        setUsers(allUsers);
      }
    };
    getUsers();
  }, []);

  const userAvatars = users.map((user) => user.avatar);

  const notAvailableAvatars = avatars.map((category) => {
    return category.images.filter((img) => userAvatars.includes(img));
  });
  const availableAvatars = avatars.map((category) => {
    return category.images.filter((img) => !userAvatars.includes(img));
  });

  const notAvailableAvatars2 = avatars
    .filter((item) => item.name === category)
    .map((c) => {
      return c.images.filter((img) => userAvatars.includes(img));
    });
  const availableAvatars2 = avatars
    .filter((item) => item.name === category)
    .map((c) => {
      return c.images.filter((img) => !userAvatars.includes(img));
    });

  return (
    <div className="z-30 fixed w-screen h-screen bg-[rgba(0,0,0,0.8)] top-0 left-0">
      <div className="overflow-auto xl:overflow-hidden w-full xl:w-[70vw] h-full xl:h-[80vh] bg-white rounded-md border-2 border-red-900 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-30">
        <MdClose
          onClick={() => setOpenAvatarModal(false)}
          className="absolute top-5 right-5 cursor-pointer text-4xl hover:text-red-600 hover:rotate-180 duration-[0.4s]"
        />

        <main className="flex flex-col xl:flex-row justify-between items-center">
          <ul className="w-full xl:w-1/5 xl:pr-1  xl:mr-1 xl:ml-[5%] border-r-2 border-red-900 flex items-center justify-around text-center xl:text-left flex-wrap xl:block">
            {activeAvatar && (
              <Image
                src={activeAvatar}
                width={300}
                height={300}
                alt="avatar"
                className={`rounded-full xl:-ml-[5%] w-[60vw] xl:w-[12vw] h-[60vw] mx-auto xl:h-[12vw] mt-10 xl:mt-0 mb-10 xl:mb-0  object-fill xl:m-3 border-2 border-red-900 xl:border-b-0 `}
              />
            )}

            {avatars.map((avatar) => {
              return (
                <li
                  key={avatar.id}
                  onClick={() => setCategory(avatar.name)}
                  className={`border-2 rounded-lg py-2 xl:border-0 xl:py-0 uppercase text-base xl:text-xl w-[42%] xl:w-auto font-semibold my-5 xl:my-10 xl:hover:text-red-700 cursor-pointer duration-[0.5s] ${
                    category === avatar.name &&
                    "text-white xl:text-red-700 bg-red-900 xl:bg-transparent xl:ml-[20%]"
                  }`}
                >
                  {avatar.name}
                </li>
              );
            })}
            <li
              onClick={() => setCategory("wszystkie")}
              className={`border-2 rounded-lg py-2 xl:border-0 xl:py-0 uppercase text-base xl:text-xl w-[42%] xl:w-auto font-semibold my-5 xl:my-10 xl:hover:text-red-700 cursor-pointer duration-[0.5s] ${
                category === "wszystkie" &&
                "text-white xl:text-red-700 bg-red-900 xl:bg-transparent xl:ml-[20%]"
              }`}
            >
              wszystkie
            </li>
          </ul>
          <section className="xl:pr-[2%] xl:pb-[5%] xl:overflow-auto w-4/5 xl:w-4/6 xl:h-[80vh] flex flex-wrap items-center justify-center">
            <h2 className="mx-auto w-full text-center mt-3 xl:mt-10 text-2xl font-bold  mb-10">
              Wybierz Avatara
            </h2>
            {category === "wszystkie" ? (
              <>
                {availableAvatars.map((item) => {
                  return item.map((img, index) => {
                    return (
                      <Image
                        key={index}
                        src={img}
                        width={150}
                        height={150}
                        alt="avatar"
                        onClick={() => setActiveAvatar(img)}
                        className={`rounded-full cursor-pointer border-2 w-[20vw] h-[20vw] xl:w-[9vw] xl:h-[9vw] border-red-900 object-fill m-3
                            ${activeAvatar === img && "border-4"}
                            `}
                      />
                    );
                  });
                })}
                {notAvailableAvatars.map((item) => {
                  return item.map((img, index) => {
                    return (
                      <Image
                        key={index}
                        src={img}
                        width={150}
                        height={150}
                        alt="avatar"
                        className={`rounded-full border-2 w-[20vw] h-[20vw] xl:w-[9vw] xl:h-[9vw] border-red-900 object-fill m-3 saturate-[0] opacity-50 brightness-[0.8]
                            ${activeAvatar === img && "border-4"}
                            `}
                      />
                    );
                  });
                })}
              </>
            ) : (
              <>
                {availableAvatars2.map((item) => {
                  return item.map((img, index) => {
                    return (
                      <Image
                        key={index}
                        src={img}
                        width={150}
                        height={150}
                        alt="avatar"
                        onClick={() => setActiveAvatar(img)}
                        className={`rounded-full cursor-pointer border-2 w-[20vw] h-[20vw] xl:w-[9vw] xl:h-[9vw] border-red-900 object-fill m-3 ${
                          activeAvatar === img && "border-4"
                        } `}
                      />
                    );
                  });
                })}
                {notAvailableAvatars2.map((item) => {
                  return item.map((img, index) => {
                    return (
                      <Image
                        key={index}
                        src={img}
                        width={150}
                        height={150}
                        alt="avatar"
                        className={`rounded-full border-2 w-[20vw] h-[20vw] xl:w-[9vw] xl:h-[9vw] border-red-900 object-fill m-3 saturate-[0] opacity-50 brightness-[0.8]
                            ${activeAvatar === img && "border-4"}
                            `}
                      />
                    );
                  });
                })}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AvatarModal;
