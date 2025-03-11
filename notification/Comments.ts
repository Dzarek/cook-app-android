"use client";

const CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  PRIVATE_KEY: process.env.NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY,
};
export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register("/sw.js");
};

const saveSubscription = async (
  subscription: any,
  title: string,
  body: string,
  tag: string,
  recipeID: string
) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/comment`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription,
      title,
      body,
      tag,
      recipeID,
    }),
  });
  return response.json();
};

export const subscribe = async (
  title: string,
  body: string,
  tag: string,
  userID: string,
  recipeID: string
) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/comment`;

  const swRegistration = await registerServiceWorker();
  await Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const swRegistration = await registerServiceWorker();
    await Notification.requestPermission();
    const subscription = await swRegistration.pushManager.subscribe(options);
    await saveSubscription(subscription, title, body, tag, recipeID);
    if (!userID || userID === undefined) {
      await unregisterServiceWorkers();
    }
    await fetch(BACKEND_URL);
  } catch (err) {
    console.error("Error", err);
  }
};
