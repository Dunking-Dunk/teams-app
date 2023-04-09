import styles from "../../styles/SignIn.module.css";
import { getAuthClient, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter();
  const [state, setState] = useState({
    email: "",
    password: "",
    errorMessage: null,
  });

  const handleChange = (e, type) => {
    setState((state) => ({ ...state, [type]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(getAuthClient, state.email, state.password)
      .then(async (userCredential) => {
        const userId = userCredential.user.uid;
        const user = await getDoc(doc(db, "users", userId));
        if (user.data().access) router.push("/");
        else {
          setState((data) => ({ ...data, errorMessage: "access denied" }));
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage) {
          setState((state) => ({ ...state, errorMessage: errorMessage }));
        }
      });
  };

  useEffect(() => {
    if (state.errorMessage) {
      setTimeout(() => {
        setState((data) => ({ ...data, errorMessage: null }));
      }, 3000);
    }
  }, [state.errorMessage]);

  return (
    <div className={styles.container}>
      <div className={styles.sub__container}>
        <h1 className={styles.title}>SIGN IN</h1>
        {state.errorMessage && (
          <p className={styles.error}>{state.errorMessage}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles.form}
          autoComplete="off"
        >
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => handleChange(e, "email")}
            className={styles.input}
            value={state.email}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => handleChange(e, "password")}
            className={styles.input}
            value={state.password}
          />
          <button className={styles.create__btn}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
