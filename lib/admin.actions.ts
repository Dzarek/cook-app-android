"use client";

import { db, auth } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { getAllRecipes } from "./actions";

const getUser = getAuth();

export const createNewUser = async (
  email: string,
  password: string,
  newName: string
) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      toast("Utworzono nowego kucharza!", {
        icon: "✔",
        style: {
          borderRadius: "10px",
          background: "#052814",
          color: "#fff",
        },
      });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      toast("Coś poszło nie tak!", {
        icon: "✖",
        style: {
          borderRadius: "10px",
          background: "#280505",
          color: "#fff",
        },
      });
    });
  const userRef = doc(db, "usersList", getUser.currentUser!.uid);
  await setDoc(
    userRef,
    {
      userName: newName,
      activeUser: true,
      email: email,
      avatar: "/assets/images/avatars/avatar0.webp",
    },
    {
      merge: true,
    }
  );
};

export const disableUser = async (userID: string) => {
  const userRef = doc(db, "usersList", userID);
  await setDoc(
    userRef,
    {
      activeUser: false,
    },
    {
      merge: true,
    }
  );
  toast("Kucharz został usunięty!", {
    style: {
      borderRadius: "10px",
      background: "#280505",
      color: "#fff",
    },
  });
};

const getBackup = async () => {
  const allUsersCollectionRef = collection(db, "usersList");
  try {
    const data = await getDocs(allUsersCollectionRef);
    let items = data.docs
      .filter((doc) => doc.id !== "0")
      .map((doc) => ({ id: doc.id, ...doc.data() } as User));

    // items = items.filter((el) => el.activeUser === true);
    let backupArray: any[] = [];
    await Promise.all(
      items.map(async (el) => {
        const allUsersCollectionData = collection(
          db,
          `usersList/${el.id}/recipes`
        );
        const data = await getDocs(allUsersCollectionData);
        const itemsAllUsers = data.docs.map((doc) => {
          const recipeData = doc.data();
          const recipe: Recipe = {
            id: doc.id,
            createdTime: recipeData.createdTime,
            author: {
              authorName: el.userName,
              authorAvatar: el.avatar,
              authorID: el.id,
            },
            title: recipeData.title,
            image: recipeData.image,
            prepTime: recipeData.prepTime,
            level: recipeData.level,
            portion: recipeData.portion,
            category: recipeData.category,
            shortInfo: recipeData.shortInfo,
            ingredients: recipeData.ingredients,
            steps: recipeData.steps,
            description: recipeData.description || "",
            source: recipeData.source || "",
            likes: recipeData.likes,
            comments: recipeData.comments,
          };

          return recipe;
        });
        const itemsArray: any[] = [];
        itemsAllUsers.map((item) => {
          itemsArray.push(item);
        });
        backupArray.push({
          id: el.id,
          activeUser: el.activeUser,
          avatar: el.avatar,
          email: el.email,
          userName: el.userName,
          itemsArray,
        });
      })
    );

    return backupArray;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const exportData = async () => {
  const wb = XLSX.utils.book_new();
  const downloadData = await getBackup();

  downloadData.map((item) => {
    const { name, itemsArray } = item;
    if (itemsArray.length > 0) {
      const newItemsArray = itemsArray.map((ob: Recipe) => {
        const objectOrder = {
          id: null,
          createdTime: null,
          authorName: null,
          authorAvatar: null,
          authorID: null,
          title: null,
          image: null,
          prepTime: null,
          level: null,
          portion: null,
          category: null,
          shortInfo: null,
          ingredients: null,
          steps: null,
          description: null,
          source: null,
          likes: null,
          comments: null,
        };

        // Flatten the object
        const flattenedObject = {
          ...objectOrder,
          id: ob.id || null,
          createdTime: ob.createdTime || null,
          authorName: ob.author?.authorName || null,
          authorAvatar: ob.author?.authorAvatar || null,
          authorID: ob.author?.authorID || null,
          title: ob.title || null,
          image: ob.image || null,
          prepTime: ob.prepTime || null,
          level: ob.level || null,
          portion: ob.portion || null,
          category: ob.category?.join(", ") || null, // Convert array to string
          shortInfo: ob.shortInfo || null,
          ingredients: ob.ingredients?.join(", ") || null,
          steps: ob.steps?.join(", ") || null, // Convert array to multiline string
          description: ob.description || null,
          source: ob.source || null,
          likes: ob.likes?.join(", ") || null,
          comments: null,
        };

        return flattenedObject;
      });

      // Append the sheet to workbook
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(newItemsArray),
        name
      );
    }
  });

  // Write the workbook
  XLSX.writeFile(wb, "RecipesBackup.xlsx");

  // Export JSON
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(downloadData)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "RecipesBackup.json";
  link.click();
};

let file = null;

// DELETE DATA TO UPDATE
export const deleteData = async (file: any) => {
  const allUsersTransfers = await getAllRecipes();
  file.map(async (el: any) => {
    allUsersTransfers.map(async (item) => {
      const productDoc = doc(db, `usersList/${el.id}/recipes`, item.id);
      await deleteDoc(productDoc);
    });
  });
};
// END DELETE DATA TO UPDATE

export const uploadData = async (file: any) => {
  file.map(async (el: any) => {
    const userRef = doc(db, "usersList", el.id);
    await setDoc(userRef, {
      activeUser: el.activeUser,
      avatar: el.avatar,
      email: el.email,
      userName: el.userName,
    });
    el.itemsArray.map(async (item: Recipe) => {
      const backupDocument = doc(db, `usersList/${el.id}/recipes`, item.id);
      await setDoc(backupDocument, {
        createdTime: item.createdTime,
        title: item.title,
        image: item.image,
        prepTime: item.prepTime,
        level: item.level,
        portion: item.portion,
        category: item.category,
        shortInfo: item.shortInfo,
        ingredients: item.ingredients,
        steps: item.steps,
        description: item.description || "",
        source: item.source || "",
        likes: item.likes,
        comments: item.comments,
      });
    });
  });
  toast("Baza danych została uaktualniona!", {
    icon: "✔",
    style: {
      borderRadius: "10px",
      background: "#052814",
      color: "#fff",
    },
  });
  window.location.href = "/admin";
};
