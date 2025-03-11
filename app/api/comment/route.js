import webpush from "web-push";
import { query } from "../../../notification/db";

// Set up VAPID keys for web push
webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_WEB_PUSH_EMAIL,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY
);

// POST method for handling subscription data and storing notifications in the database
export const POST = async (request) => {
  try {
    const subscriptionMain = await request.json();
    if (!subscriptionMain) {
      console.error("No subscription was provided!");
      return new Response(
        JSON.stringify({ error: "No subscription provided!" }),
        { status: 400 }
      );
    }
    const { tag, title, body, subscription, recipeID } = subscriptionMain;
    const { endpoint, expirationTime, keys } = subscription;
    const { p256dh, auth } = keys;
    const addProduct = await query({
      query:
        "INSERT INTO comments (tag, title, body, endpoint, expirationTime, p256dh, auth, recipeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      values: [
        tag,
        title,
        body,
        endpoint,
        expirationTime,
        p256dh,
        auth,
        recipeID,
      ],
    });

    return new Response(JSON.stringify({ message: "success", addProduct }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add subscription." }),
      { status: 500 }
    );
  }
};

// GET method for sending notifications
export const GET = async () => {
  const notifyMsql = await query({
    query: "SELECT * FROM comments",
    values: [],
  });
  const subscriptions = notifyMsql;
  subscriptions.forEach(async (s) => {
    const oneSubscription = subscriptions[subscriptions.length - 1];
    const { endpoint, expirationTime, p256dh, auth } = s;
    const subscription = { endpoint, expirationTime, keys: { p256dh, auth } };
    const payload = JSON.stringify({
      title: oneSubscription.title,
      body: oneSubscription.body,
      tag: oneSubscription.tag,
      recipeID: oneSubscription.recipeID,
    });
    await webpush.sendNotification(subscription, payload);
  });

  const deleteProduct = await query({
    query:
      "DELETE t1 FROM comments t1 JOIN comments t2 ON t1.auth = t2.auth AND t1.id < t2.id",
    values: [],
  });

  return new Response(
    JSON.stringify({
      message: `${notifyMsql.length} messages sent!`,
      deleteProduct,
    }),
    { status: 200 }
  );
};
