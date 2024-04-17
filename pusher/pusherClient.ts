import PusherClient from "pusher-js"

// Allows you to use Pusher inside Next.js "use client" components.
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.PUSHER_APP_CLUSTER!, // Change with your cluster region.
  authEndpoint: "/api/pusher-auth", // OPTIONAL: For secure web sockets.
  authTransport: "ajax",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
})