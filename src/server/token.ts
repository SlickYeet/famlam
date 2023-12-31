"use server";

import { v4 } from "uuid";
import jwt from "jsonwebtoken";

import { getSelf } from "@/lib/auth-service";
import { getUserById } from "@/lib/user-service";

export const createUserToken = async (ownerIdentity: string) => {
  let self;

  try {
    self = await getSelf();
  } catch {
    const id = v4();
    const username = `guest-${Math.floor(Math.random() * 1000000)}`;
    self = { id, username };
  }

  const owner = await getUserById(ownerIdentity);

  if (!owner) {
    throw new Error("User not found");
  }

  const isOwner = self.id === owner.id;

  const payload = {
    identity: isOwner ? `owner-${self.id}` : self.id,
  };

  const token = jwt.sign(payload, "en8Q6TLAdn55gDG3GD7Pj0Z3L6iyH6E6");

  return await Promise.resolve(token);
};
