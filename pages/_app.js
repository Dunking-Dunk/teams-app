import "../styles/globals.css";
import { useEffect, useState } from "react";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { getAuthClient, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const router = useRouter();

  const getUsers = async () => {
    const querySnapshot = await onSnapshot(collection(db, "users"), (user) => {
      const data = user.docs.map((doc) => doc.data());
      setUsers(data);
    });
  };

  useEffect(() => {
    getUsers();
    onAuthStateChanged(getAuthClient, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((user) => {
          setUser(user.data());
        });
      } else {
        router.push("/auth/signin");
      }
    });
  }, []);

  const signOutHandler = () => {
    signOut(getAuthClient).then(() => {
      setUser(null);
    });
  };

  return (
    <div className="root__container">
      <Header user={user} signOutHandler={signOutHandler} />
      <Component {...pageProps} user={user} allUsers={users} />
    </div>
  );
}

export default MyApp;
