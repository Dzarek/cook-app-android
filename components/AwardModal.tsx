"use client";

import Image from "next/image";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const AwardModal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)} className="text-red-900">
        [zobacz trofeum]
      </button>
      {showModal && (
        <div className="fixed z-30 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] xl:w-[40vw] h-[65vh] xl:h-[60vh] bg-white border-2 border-red-900 rounded-md flex justify-center items-center">
          <MdClose
            onClick={() => setShowModal(false)}
            className="absolute top-5 right-5 cursor-pointer text-4xl hover:text-red-600 hover:rotate-180 duration-[0.4s]"
          />
          <Image
            src="/images/rankingAward.png"
            width={500}
            height={500}
            alt="award"
            className="h-3/4 object-contain awardAnim"
          />
        </div>
      )}
    </>
  );
};

export default AwardModal;
