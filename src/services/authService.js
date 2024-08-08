import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { setStorageItem } from "../utils/local-storage";
import { auth } from "./firebase";

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    setStorageItem("accessToken", userCredential.user.accessToken);

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

    setStorageItem("accessToken", userCredential.user.accessToken);

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);

    return;
  } catch (error) {
    throw error;
  }
}
