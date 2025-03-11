"use client";

import Image from "next/image";
import { MdAddCircle, MdDeleteForever } from "react-icons/md";
import { useGlobalContext } from "./authContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { addCommentF, deleteCommentF } from "@/lib/user.actions";
import { v4 as uuidv4 } from "uuid";
import { subscribe } from "@/notification/Comments";

type CommentProps = {
  comments: {
    id: string;
    user: {
      uid: string;
      name: string;
      avatar: string;
    };
    text: string;
  }[];
  userID: string;
  recipeID: string;
  recipeName: string;
};

const AddComment = ({
  comments,
  userID,
  recipeID,
  recipeName,
}: CommentProps) => {
  const { activeUser, name } = useGlobalContext();
  const [activeComments, setActiveComments] = useState(comments);
  const [commentText, setCommentText] = useState("");

  // const handleComment = async () => {
  //   if (!activeUser) {
  //     toast("Musisz być zalogowany aby dodać komentarz!", {
  //       icon: "✖",
  //       style: {
  //         borderRadius: "10px",
  //         background: "#280505",
  //         color: "#fff",
  //         textAlign: "center",
  //       },
  //     });
  //     return;
  //   }
  //   if (commentText === "") {
  //     toast("Napisz komentarz przed dodaniem!", {
  //       icon: "✖",
  //       style: {
  //         borderRadius: "10px",
  //         background: "#280505",
  //         color: "#fff",
  //         textAlign: "center",
  //       },
  //     });
  //   } else {
  //     let currentComments = [...activeComments];
  //     const uuid = uuidv4();
  //     currentComments = [
  //       ...currentComments,
  //       {
  //         id: uuid,
  //         user: {
  //           uid: activeUser.uid,
  //           name: activeUser.displayName,
  //           avatar: activeUser.photoURL,
  //         },
  //         text: commentText,
  //       },
  //     ];
  //     const toastId = toast.loading("Dodawanie komentarza...", {
  //       style: {
  //         borderRadius: "10px",
  //         background: "#0c3362",
  //         color: "#fff",
  //       },
  //     });
  //     setActiveComments(currentComments);
  //     await editComment(userID, recipeID, currentComments);
  //     await handleSub(commentText, uuid);
  //     setCommentText("");
  //     toast.dismiss(toastId);
  //     toast("Komentarz został dodany!", {
  //       icon: "✔",
  //       style: {
  //         borderRadius: "10px",
  //         background: "#052814",
  //         color: "#fff",
  //       },
  //     });
  //   }
  // };

  const handleComment = async () => {
    if (!activeUser) {
      toast("Musisz być zalogowany aby dodać komentarz!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
          textAlign: "center",
        },
      });
      return;
    }
    if (commentText === "") {
      toast("Napisz komentarz przed dodaniem!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
          textAlign: "center",
        },
      });
      return;
    }

    let currentComments = [...activeComments];
    const uuid = uuidv4();
    const newComment = {
      id: uuid,
      user: {
        uid: activeUser.uid,
        name: activeUser.displayName,
        avatar: activeUser.photoURL,
      },
      text: commentText,
    };
    currentComments = [...currentComments, newComment];

    const toastId = toast.loading("Dodawanie komentarza...", {
      style: {
        borderRadius: "10px",
        background: "#0c3362",
        color: "#fff",
      },
    });

    try {
      setActiveComments(currentComments);
      await addCommentF(userID, recipeID, newComment);
      await handleSub(commentText, uuid); // Tylko jeśli editComment zakończy się sukcesem
      setCommentText("");
      toast.dismiss(toastId);
      toast("Komentarz został dodany!", {
        icon: "✔",
        style: {
          borderRadius: "10px",
          background: "#052814",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Błąd przy dodawaniu komentarza:", error);
      toast.dismiss(toastId);
      toast("Wystąpił błąd przy dodawaniu komentarza!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
          textAlign: "center",
        },
      });
    }
  };

  const deleteComment = async (id: string) => {
    let currentComments = [...activeComments];
    currentComments = currentComments.filter((comment) => comment.id !== id);
    setActiveComments(currentComments);
    const commentToRemove = currentComments.find(
      (comment) => comment.id === id
    );
    if (commentToRemove) {
      await deleteCommentF(userID, recipeID, commentToRemove);
      toast("Komentarz został usunięty!", {
        icon: "✔",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
    } else {
      toast("Coś poszło nie tak!", {
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
    const cookerName = name.toUpperCase();
    const recipeNameBig = recipeName.toUpperCase();
    const title = `${cookerName} komentuje ${recipeNameBig}.`;
    const body = newTitle;
    const tag = uuid;
    await subscribe(title, body, tag, userID, recipeID);
  };

  return (
    <div className="w-[90%] xl:w-4/6 flex justify-start items-start flex-nowrap mx-auto my-[5vh] xl:my-[15vh] flex-col">
      <h2 className="text-xl xl:text-2xl font-medium font-bodyFont mb-5 w-full bg-red-900 text-white rounded-md px-2 py-1">
        Komentarze:
      </h2>
      {activeUser && (
        <div className="w-full">
          <article className="flex flex-wrap xl:flex-nowrap mx-auto w-[98%] justify-between xl:justify-start items-center bg-red-100 py-4 xl:py-2 px-5 rounded-md mb-2">
            <div className="text-lg order-1 xl:order-1 w-1/2 xl:w-[100px] text-zinc-500 flex flex-row xl:flex-col justify-start xl:justify-center items-center xl:mr-2">
              <Image
                src={activeUser.photoURL.replace("assets/", "")}
                width={50}
                height={50}
                alt={""}
                className="rounded-full border-2 border-red-900 mr-2 xl:mr-0 xl:mb-1"
              />
              <span className="text-red-800 ">{activeUser.displayName}</span>
            </div>
            <p className="text-2xl xl:order-2 text-red-800 mr-5 font-bold hidden xl:block">
              :
            </p>

            <textarea
              name="newComment"
              id="newComment"
              placeholder="Dodaj swój komentarz tutaj..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="order-3 xl:order-3 mt-5 xl:mt-0 w-[98%] mx-auto p-2 xl:w-full rounded-sm text-base xl:text-lg font-bodyFont break-words min-h-[20vh] xl:min-h-0"
            ></textarea>
            <MdAddCircle
              onClick={handleComment}
              className="order-2 xl:order-4 xl:ml-5 text-4xl text-zinc-700 hover:text-red-950 cursor-pointer transition-all"
            />
          </article>
        </div>
      )}
      {activeComments.length > 0 &&
        activeComments.map((comment) => {
          return (
            <article
              key={comment.id}
              className="flex flex-row flex-wrap xl:flex-nowrap mx-auto w-[98%] justify-between xl:justify-start items-center bg-zinc-100 py-4 xl:py-2 px-5 rounded-md mb-2"
            >
              <div className="text-lg order-1 xl:order-1 w-1/2 xl:w-[100px] text-zinc-500 flex flex-row xl:flex-col justify-start xl:justify-center items-center xl:mr-2">
                <Image
                  src={comment.user.avatar.replace("assets/", "")}
                  width={50}
                  height={50}
                  alt={comment.user.name}
                  className="rounded-full border-2 border-red-900 mr-2 xl:mr-0 xl:mb-1"
                />
                <span>{comment.user.name}</span>
              </div>
              <p className="text-2xl xl:order-2 text-red-800 mr-5 font-bold hidden xl:block">
                :
              </p>
              <p className="order-3 xl:order-3 mt-5 xl:mt-0 w-[98%] mx-auto ml-0 xl:w-full text-base xl:text-lg font-bodyFont text-center xl:text-left break-words">
                {comment.text}
              </p>
              {activeUser && activeUser.uid === comment.user.uid && (
                <MdDeleteForever
                  onClick={() => deleteComment(comment.id)}
                  className="order-2 xl:order-4 xl:ml-5 text-red-800 hover:text-red-900 transition-all text-3xl cursor-pointer"
                />
              )}
            </article>
          );
        })}
    </div>
  );
};

export default AddComment;
