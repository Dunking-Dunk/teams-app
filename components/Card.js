import styles from "../styles/ProjectCard.module.css";
import moment from "moment/moment";
import { useRouter } from "next/router";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const ProjectCard = ({ project, users, user, detail, key }) => {
  const router = useRouter();
  const data = project.data();

  const handleSubmit = async (e, projectId, action) => {
    e.stopPropagation();
    const projectRef = doc(db, "projects", projectId);
    if (action === "join") {
      await updateDoc(projectRef, {
        teamMembers: arrayUnion(user.id),
      });
    } else {
      await updateDoc(projectRef, {
        teamMembers: arrayRemove(user.id),
      });
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    const projectRef = doc(db, "projects", projectId);
    await deleteDoc(projectRef);
  };

  return (
    <div
      className={styles.card}
      key={key}
      onClick={() => {
        router.push(`/project/${project.id}`);
      }}
    >
      <div className={styles.title__row}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.tech}>
          <h3 style={{ fontSize: 17, textTransform: "uppercase" }}>
            {data.category}
          </h3>
        </div>
      </div>
      <div className={styles.member__container}>
        <span className={styles.team__title}>Team</span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <h3 className={styles.team__lead}>{data.teamLead}</h3>
          <div className={styles.members__container}>
            {users &&
              users.map((user) => {
                const data = user.data();
                return (
                  <>
                    <div className={styles.member} key={user.id}>
                      <img className={styles.member__img} src={data.photoURL} />
                    </div>
                    {/* <p className={styles.member__name}>{data.userName}</p> */}
                  </>
                );
              })}
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.row__header}>Description: </span>
        <p className={styles.description}>{data.description}</p>
      </div>
      <div className={styles.row}>
        <span className={styles.row__header}>End Goal:</span>
        <p className={styles.description}>{data.endGoal}</p>
      </div>
      <div className={styles.row}>
        <span className={styles.row__header}>Tech Stack:</span>
        <div className={styles.techStack__container}>
          {data.techStack?.length > 0 &&
            data.techStack?.map((stack, index) => (
              <div className={styles.tech} key={index}>
                {stack}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.join__container}>
        <span className={styles.row__header}>
          Completion {moment(data.endDate).fromNow()}
        </span>
        {user?.admin && (
          <button
            className={styles.join__button}
            style={{ background: "red" }}
            onClick={(e) => handleDelete(e, project.id)}
          >
            Delete
          </button>
        )}

        {!detail && !data.teamMembers?.includes(user?.id) ? (
          <button
            className={styles.join__button}
            onClick={(e) => handleSubmit(e, project.id, "join")}
          >
            JOIN
          </button>
        ) : (
          <button
            className={styles.join__button}
            onClick={(e) => handleSubmit(e, project.id, "leave")}
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
