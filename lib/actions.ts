"use server";

import { db } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

export const getAllUsers = async () => {
  const allUsersCollectionRef = collection(db, "usersList");
  try {
    const data = await getDocs(allUsersCollectionRef);
    let items = data.docs
      .filter((doc) => doc.id !== "0")
      .map((doc) => ({ id: doc.id, ...doc.data() } as User));

    items = items.filter((el) => el.activeUser === true);
    return items;
  } catch (error) {
    console.log(error);
  }
};
export const getOneUser = async (id: string) => {
  const docRef = doc(db, "usersList", id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
};
export const getRecipes = async (userID: string) => {
  const getProductsCollectionRefOneUser = collection(
    db,
    `usersList/${userID}/recipes`
  );
  const userRef = doc(db, "usersList", userID);
  try {
    const docSnap = await getDoc(userRef);
    const user = docSnap.data();
    const data = await getDocs(getProductsCollectionRefOneUser);
    const items = data.docs.map((doc) => {
      const recipeData = doc.data();
      const recipe: Recipe = {
        id: doc.id,
        createdTime: recipeData.createdTime,
        author: {
          authorName: user!.userName,
          authorAvatar: user!.avatar,
          authorID: userID,
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
    return items;
  } catch (error) {
    console.log(error);
  }
};

export const getAllRecipes = async () => {
  const allUsersCollectionRef = collection(db, "usersList");
  try {
    const data = await getDocs(allUsersCollectionRef);
    let items = data.docs
      .filter((doc) => doc.id !== "0")
      .map((doc) => ({ id: doc.id, ...doc.data() } as User));

    items = items.filter((el) => el.activeUser === true);

    let bigItemsArray: Recipe[] = [];

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

        bigItemsArray.push(...itemsAllUsers);
      })
    );

    return bigItemsArray;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRankingUsers = async () => {
  const allUsersCollectionRef = collection(db, "usersList");
  try {
    const data = await getDocs(allUsersCollectionRef);
    let users = data.docs
      .filter((doc) => doc.id !== "0")
      .map((doc) => ({ id: doc.id, ...doc.data() } as User))
      .filter((user) => user.activeUser === true);

    let backupArray = await Promise.all(
      users.map(async (user) => {
        const userRecipesRef = collection(db, `usersList/${user.id}/recipes`);
        const recipesSnapshot = await getDocs(userRecipesRef);
        const recipes = recipesSnapshot.docs.map((doc) => {
          const recipeData = doc.data();
          return {
            id: doc.id,
            createdTime: recipeData.createdTime,
            author: {
              authorName: user.userName,
              authorAvatar: user.avatar,
              authorID: user.id,
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
            likes: recipeData.likes, // Likes array
            comments: recipeData.comments,
          };
        });

        return {
          id: user.id,
          avatar: user.avatar,
          userName: user.userName,
          itemsArray: recipes,
        };
      })
    );

    // Sort backupArray by the total number of likes in the recipes
    backupArray.sort((a, b) => {
      // Calculate total likes for user A
      const totalLikesA = a.itemsArray.reduce(
        (sum, recipe) => sum + recipe.likes.length,
        0
      );
      // Calculate total likes for user B
      const totalLikesB = b.itemsArray.reduce(
        (sum, recipe) => sum + recipe.likes.length,
        0
      );
      // Sort in descending order (highest number of likes first)
      return totalLikesB - totalLikesA;
    });

    return backupArray;
  } catch (error) {
    console.log(error);
    return [];
  }
};
