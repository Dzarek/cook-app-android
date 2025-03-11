self.addEventListener("push", async (event) => {
  if (event.data) {
    const eventData = await event.data.json();
    showLocalNotification(
      eventData.title,
      eventData.body,
      eventData.tag,
      eventData.recipeID,
      self.registration
    );
  }
});

const showLocalNotification = (title, body, tag, recipeID, swRegistration) => {
  swRegistration.showNotification(title, {
    body,
    tag,
    icon: "/icon512_rounded.png",
    data: { recipeID },
  });
};

self.addEventListener("notificationclick", function (event) {
  const recipeID = event.notification.data.recipeID;
  // const url = `https://stepkigotuja.netlify.app/przepisy/${recipeID}`;
  const url = `https://dzarek-nextjs-mysql.xaa.pl/przepisy/${recipeID}`;
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
