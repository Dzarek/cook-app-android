"use client";

import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";

type VoiceType = {
  newIngredients: string[];
  setNewIgredients: (newIgredients: string[]) => void;
  toastText: string;
  setActiveVoice: (activeVoice: string) => void;
};

const VoiceIngredient = ({
  newIngredients,
  setNewIgredients,
  toastText,
  setActiveVoice,
}: VoiceType) => {
  const [voiceOn, setVoiceOn] = useState(true);
  const [toastId, setToastId] = useState<string | null>(null);

  const commands = [
    {
      command: "*",
      callback: (item: string) => {
        addItemVoice(item);
      },
    },
  ];

  const { listening, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands,
  });

  const handleVoice = () => {
    setActiveVoice("ingredientVoice");
    setVoiceOn(!voiceOn);
    // let toastId = "";
    if (voiceOn) {
      const id = toast.loading(toastText, {
        icon: <FaMicrophone />,
        style: {
          borderRadius: "10px",
          background: "#0c3362",
          color: "#fff",
        },
      });
      setToastId(id);
      SpeechRecognition.startListening({ continuous: true });
    } else {
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (toastId) toast.dismiss(toastId);
    setToastId(null);
    toast("nagrywanie zakończone", {
      icon: <FaMicrophone />,
      style: {
        borderRadius: "10px",
        background: "#051528",
        color: "#fff",
      },
    });
    SpeechRecognition.stopListening();
    setActiveVoice("");
  };

  const addItemVoice = (item: string) => {
    if (item) {
      setNewIgredients([...newIngredients, item]);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop recording when the screen is locked or app goes to background
        if (listening) stopRecording();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [listening, toastId]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <button
        type="button"
        className={listening ? "submit-btn2 submit-btn3 " : "submit-btn2"}
      >
        <FaMicrophone />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={listening ? "submit-btn2 submit-btn3 " : "submit-btn2"}
      onClick={handleVoice}
    >
      <FaMicrophone />
    </button>
  );
};

export default VoiceIngredient;
