import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  getDocs,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0EBlYHhu6RYQANPu_SugdaGtetpD0b7g",
  authDomain: "react-app-1a87a.firebaseapp.com",
  projectId: "react-app-1a87a",
  storageBucket: "react-app-1a87a.appspot.com",
  messagingSenderId: "228033491283",
  appId: "1:228033491283:web:17d32c106d44ad027bf1a6",
  measurementId: "G-ZZWFGXMSCE",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );
    const documents = await getDocs(userQuery);
    if (documents && documents.docs && documents.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const loginWithEmailAndPassword = async (signInData) => {
  const { email, password } = signInData;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
};

// Function to register user with Firebase and store user data in firestore
export const registerUserWithEmailAndPassword = async (registerData) => {
  const { email, password, firstname, lastname, phone } = registerData;
  try {
    const createUserResult = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = createUserResult.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      firstname,
      lastname,
      phone,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => {
  signOut(auth);
};

//Function to get all the users
export const getAllUsers = async () => {
  try {
    const userQuery = query(collection(db, "users"));
    const documents = await getDocs(userQuery);
    const users = [];
    if (documents && documents.docs && documents.docs.length) {
      documents.docs.forEach((d) => {
        const { firstname, lastname, email, phone } = d && d.data();
        users.push({ firstname, lastname, email, phone });
      });
    }
    return users;
  } catch (err) {
    console.error(err);
  }
};

//Function to get user detail by uid
export const getUserDetail = async (uid) => {
  try {
    const userDetailQuery = query(
      collection(db, "users"),
      where("uid", "==", uid)
    );
    const documents = await getDocs(userDetailQuery);
    let userDetail = {};
    if (documents && documents.docs && documents.docs.length) {
      const { firstname, lastname, phone, email } = documents.docs[0].data();
      userDetail = {
        firstname,
        lastname,
        phone,
        email,
      };
      return userDetail;
    }
    return userDetail;
  } catch (err) {
    console.error(err);
  }
};
