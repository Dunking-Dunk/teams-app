import "../styles/globals.css";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { getAuthClient, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
    <div>
      <Header user={user} signOutHandler={signOutHandler} />
      <Component {...pageProps} user={user} />
    </div>
  );
}

export default MyApp;
