"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "@/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

const defaultValues: ContextTypes = {
  activeUser: null,
  name: "",
  isLogin: false,
  loading: true,
  email: "",
  avatar: "",
  modalName: false,
  setIsLogin: () => false,
  setName: () => "",
  setModalName: () => false,
  setAvatar: () => "",
  setLoading: () => true,
  editRecipe: null,
  setEditRecipe: () => {},
  file: null,
  setFile: () => {},
};

const AppContext = createContext<ContextTypes>(defaultValues);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeUser, setActiveUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/images/avatars/avatar0.webp");
  const [modalName, setModalName] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setActiveUser(user);
        setIsLogin(true);
        if (user.displayName) {
          setName(user.displayName);
        }
        if (user.email) {
          setEmail(user.email);
        }
        if (user.photoURL) {
          setAvatar(user.photoURL.replace("assets/", ""));
        }
        if (user.displayName === null) {
          setModalName(true);
        }
      } else {
        setActiveUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // NOTIFICATION
  useEffect(() => {
    if (activeUser) {
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
  }, [activeUser]);

  // END NOTIFICATION

  return (
    <AppContext.Provider
      value={{
        activeUser,
        name,
        isLogin,
        loading,
        email,
        avatar,
        modalName,
        editRecipe,
        file,
        setFile,
        setEditRecipe,
        setIsLogin,
        setName,
        setModalName,
        setAvatar,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
