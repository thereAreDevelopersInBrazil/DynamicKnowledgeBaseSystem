import { z } from "zod";
import { HTTPSTATUS } from "../constants/http";
import { AUser } from "../entities/users/AUser";
import { ExpectedError } from "../errors";
import { getAll, getByEmail, getById, insert, logicalDeletion, update, updateSingleProperty } from "../repositories/users";
import { PatchShape } from "../schemas/abstracts";
import { emailSchema, nameSchema, passwordSchema, roleSchema } from "../schemas/users";
import { encrypt } from "../utils/cryptography";

export async function retrieveAnUser(id: number): Promise<AUser> {
  const user = await getById(id);

  if (!user) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no users with id ${id}!`);
  }

  return user;
}

export async function retrieveUsers(): Promise<AUser[]> {
  const users = await getAll();
  return users ? users : [];
}

export async function createUser(user: AUser): Promise<AUser> {

  const sameEmailUser = await getByEmail(user.getEmail());

  if (sameEmailUser) {
    throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, "Email already in use, choose a different email!");
  }

  user.setPassword(encrypt(user.getPassword()));
  const id = await insert(user);
  if (!id || isNaN(Number(id))) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new user! Unable to detect the created user!");
  }

  const result = await getById(Number(id));

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Error while creating new user! Unable to detect the created user!");
  }

  return result;
}

export async function fullUpdateUser(id: number, user: AUser): Promise<AUser> {

  const sameEmailUser = await getByEmail(user.getEmail(), id);

  if (sameEmailUser) {
    throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, "Email already in use, choose a different email!");
  }

  user.setPassword(encrypt(user.getPassword()));
  const isUpdated = await update(id, user);

  if (!isUpdated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the user was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated user!");
  }

  return updated;
}

export async function partialUpdateUser(id: number, patch: PatchShape): Promise<AUser> {

  const user = await getById(id);

  if (!user) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no users with id ${id} to be patched!`);
  }

  const targetProp = String(patch.path);
  let targetPropNewValue = patch.value;

  if (targetProp == 'email') {
    const sameEmailUser = await getByEmail(String(targetPropNewValue), id);

    if (sameEmailUser) {
      throw new ExpectedError(HTTPSTATUS.UNPROCESSABLE, "Email already in use, choose a different email!");
    }
  }

  if (targetProp == 'password') {
    targetPropNewValue = encrypt(String(targetPropNewValue));
  }

  const validProps = ['name', 'email', 'password', 'role'];

  if (!validProps.includes(targetProp)) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid path: ${patch.path} - You can only patch the paths: ${validProps.join(", ")} of Users`);
  }

  // There are other ways to do it but i decided do it dynamically
  // so i can use a "strategy alike / similar" approach
  const possibleValidations: { [key: string]: z.ZodTypeAny } = {
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema
  };

  try {
    possibleValidations[targetProp].parse(targetPropNewValue);
  } catch (error) {
    throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, `Invalid value for ${targetProp} '${targetPropNewValue}'`, error);
  }

  const result = await updateSingleProperty(id, targetProp, String(targetPropNewValue));

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to detect if the user was updated!");
  }

  const updated = await getById(id);

  if (!updated) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to retrieve the updated user!");
  }

  return updated;
}

export async function deleteUser(id: number): Promise<boolean> {
  const user = await getById(id);

  if (!user) {
    throw new ExpectedError(HTTPSTATUS.NOT_FOUND, `There are no users with id ${id} to be deleted!`);
  }

  const result = await logicalDeletion(id);

  if (!result) {
    throw new ExpectedError(HTTPSTATUS.SERVER_ERROR, "Unable to delete user!");
  }

  return result;
}