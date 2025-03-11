"use client";

import { createContext, useEffect, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";

declare global {
  interface Window {
    cloudinary: any;
  }
}

type CloudinaryWidgetTypes = {
  uwConfig: {
    cloudName: string | undefined;
    uploadPreset: string | undefined;
    sources: string[];
    multiple: boolean;
    folder: string;
    maxImageFileSize: number;
    maxImageWidth: number;
    // theme: "purple", //change to a purple theme
  };
  setPublicId: (publicId: string) => void;
  setNewImage: (newImage: string) => void;
};

// Create a context to manage the script loading state
const defaultValues: CloudinaryContextTypes = {
  loaded: false,
};

const CloudinaryScriptContext =
  createContext<CloudinaryContextTypes>(defaultValues);

function CloudinaryUploadWidget({
  uwConfig,
  setPublicId,
  setNewImage,
}: CloudinaryWidgetTypes) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            // console.log("Done! Here is the image info: ", result.info);
            setPublicId(result.info.public_id);
            setNewImage(result.info.secure_url);
          }
        }
      );
      myWidget.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        onClick={initializeCloudinaryWidget}
        className="flex flex-col items-center justify-center w-full xl:w-2/5 h-[40vh] xl:h-[50vh] border-red-900 border-dashed border-2 rounded-md"
      >
        <RiImageAddLine className="text-6xl text-zinc-400" />
        <p className="mt-5 text-xl">dodaj zdjęcie</p>
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
