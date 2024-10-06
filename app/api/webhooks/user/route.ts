import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, UserJSON, WebhookEvent } from "@clerk/nextjs/server";

import prisma from "@/app/_libs/prismadb";
import { userRecordCache } from "@/app/_config/cache";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data as UserJSON;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const user = await clerkClient.users.getUser(id!);

    const createdUser = await prisma.user.create({
      data: {
        authUserId: user.id,
      },
      select: {
        id: true,
      },
    });

    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        dbUserId: createdUser.id,
      },
    });
  }

  if (eventType === "user.updated") {
    const user = await clerkClient.users.getUser(id!);

    const dbUser = await prisma.user.update({
      where: {
        authUserId: user.id,
      },
      data: {
        authUserId: user.id,
      },
      select: {
        id: true,
      },
    });

    userRecordCache.revalidate(dbUser.id);
  }

  if (eventType === "user.deleted") {
    const dbUser = await prisma.user.delete({
      where: { authUserId: id! },
      select: { id: true },
    });
    userRecordCache.revalidate(dbUser.id);
  }

  return new Response("", { status: 200 });
}
