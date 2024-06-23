import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase";
import { setStorageItem } from "../utils/local-storage";

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    setStorageItem("@user:accessToken", userCredential.user.accessToken);

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    setStorageItem("@user:accessToken", userCredential.user.accessToken);

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}
