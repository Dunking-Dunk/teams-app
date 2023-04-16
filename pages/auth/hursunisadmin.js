import styles from "../../styles/HursunIsAdmin.module.css";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuthClient, db, getClientStorage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const HursunIsAdmin = ({ allUsers }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    username: "",
    errorMessage: "",
    image: "",
    imgUrl: "",
  });
  const [adminAccess, setAdminAccess] = useState(false);

  const metadata = {
    contentType: "image/jpeg",
  };

  useEffect(() => {
    onAuthStateChanged(getAuthClient, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then((user) => {
          if (user.data()?.admin) {
            setAdminAccess(true);
          } else {
            setAdminAccess(false);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (state.errorMessage) {
      setTimeout(() => {
        setState((data) => ({ ...data, errorMessage: null }));
      }, 3000);
    }
  }, [state.errorMessage]);

  const handleChange = (e, type) => {
    setState((state) => ({ ...state, [type]: e.target.value }));
  };
  const updateState = (data) => {
    setState((state) => ({ ...state, ...data }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(getAuthClient, state.email, state.password)
      .then(async (userCredential) => {
        const storageRef = ref(getClientStorage, "images/" + state.image.name);
        const uploadTask = uploadBytesResumable(
          storageRef,
          state.image,
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                updateState({
                  errorMessage:
                    "User doesn't have permission to access the object",
                });
                break;
              case "storage/canceled":
                updateState({ errorMessage: "Cancelled" });
                break;
              case "storage/unknown":
                updateState({ errorMessage: "Unknown error occured" });
                break;
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                updateProfile(getAuthClient.currentUser, {
                  displayName: state.username,
                  photoURL: downloadURL,
                });
                console.log(downloadURL);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                  userName: state.username,
                  email: userCredential.user.email,
                  id: userCredential.user.uid,
                  access: true,
                  photoURL: downloadURL,
                });
                setState({
                  username: "",
                  password: "",
                  email: "",
                  image: "",
                });
              }
            );
          }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage) {
          updateState({ errorMessage: errorMessage });
        }
      });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    allUsers.filter((user) => user.id !== id);
  };

  const handleAccess = async (access, id) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, {
      access: access,
    });
    getUsers();
  };

  if (adminAccess) {
    return (
      <div className={styles.container}>
        <div className={styles.sub__container}>
          <h1 className={styles.title}>Create User</h1>
          {state.errorMessage && (
            <p style={{ color: "red" }}>{state.errorMessage}</p>
          )}
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            autoComplete="false"
          >
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => handleChange(e, "username")}
              className={styles.input}
              value={state.username}
            />
            <input
              type="file"
              onChange={(e) =>
                setState((data) => ({ ...data, image: e.target.files[0] }))
              }
              className={styles.input}
            />
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
            <button className={styles.create__btn}>Create</button>
          </form>
        </div>
        <div className={styles.user__container}>
          <h1 className={styles.title}>manage users</h1>
          {allUsers?.map((user) => {
            return (
              <div className={styles.user__card} key={user.id}>
                <div>
                  <h3 className={styles.user__card__text}>{user.userName}</h3>
                  <h3 className={styles.user__card__text}>{user.email}</h3>
                </div>
                <div className={styles.user__btns}>
                  <button
                    className={styles.delete__btn}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                  {user.access ? (
                    <button
                      className={styles.delete__btn}
                      onClick={() => handleAccess(false, user.id)}
                    >
                      Deny access
                    </button>
                  ) : (
                    <button
                      className={styles.allow__btn}
                      onClick={() => handleAccess(true, user.id)}
                    >
                      Allow
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <p className={styles.error}>Access Denied</p>;
  }
};

export default HursunIsAdmin;
