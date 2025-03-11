"use client";

import { FaRegShareFromSquare } from "react-icons/fa6";

import toast from "react-hot-toast";

const NativeShareButton = ({ url, title }: { url: string; title: string }) => {
  const shareData = {
    title: "Sprawdź ten przepis!",
    text: title,
    url: url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // console.log("Udostępniono pomyślnie")
      } catch (error) {
        toast("Błąd udostępniania!", {
          icon: "✖",
          style: {
            borderRadius: "10px",
            background: "#280505",
            color: "#fff",
          },
        });
      }
    } else {
      toast("Udostępnianie nie jest obsługiwane w tej przeglądarce.", {
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
    <button
      className="absolute bottom-[10%] left-[10%] flex justify-center items-center"
      onClick={handleShare}
    >
      <FaRegShareFromSquare className="text-3xl xl:text-4xl text-red-900" />
    </button>
  );
};

export default NativeShareButton;
