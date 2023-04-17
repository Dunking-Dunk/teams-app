import styles from "../../styles/Members.module.css";

const Members = ({ allUsers }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Members</h1>
      <div className={styles.card__container}>
        {allUsers &&
          allUsers.map((user) => {
            return (
              <div className={styles.card} key={user.id}>
                <div className={styles.member__img__container}>
                  <img className={styles.member__img} src={user.photoURL} />
                </div>
                <div className={styles.card__right}>
                  <h3 className={styles.card__right__name}>{user.userName}</h3>
                  <h5 className={styles.goal__card__created}>{user.email}</h5>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Members;
