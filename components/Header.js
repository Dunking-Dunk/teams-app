import styles from "../styles/Header.module.css";

const Header = ({ user, signOutHandler }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ALPHA</h1>

      {user && (
        <div className={styles.right}>
          <div className={styles.user__container}>
            {user?.photoURL && (
              <div className={styles.img__container}>
                <img className={styles.image} src={user.photoURL} />
              </div>
            )}
            <h3 style={{ marginRight: 10 }}>{user?.userName}</h3>
          </div>

          <button onClick={signOutHandler} className={styles.signout__button}>
            sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
