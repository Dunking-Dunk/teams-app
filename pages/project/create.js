import Link from "next/link";
import styles from "../../styles/Create.module.css";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";

const CreateProject = () => {
  const router = useRouter();
  const [state, setState] = useState({
    title: "",
    description: "",
    endGoal: "",
    category: "",
    teamLead: "",
    techStack: [],
    endDate: "",
    teamMembers: [],
    startDate: serverTimestamp(),
    githubLink: "",
  });

  const updateState = (data) => {
    setState((state) => ({ ...state, ...data }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      state.title.length > 3 &&
      state.description.length > 3 &&
      state.endGoal.length > 3
    ) {
      await addDoc(collection(db, "projects"), state);
      setState({
        title: "",
        description: "",
        endGoal: "",
        category: "",
        teamLead: "",
        techStack: [],
        endDate: "",
        teamMembers: [],
        githubLink: "",
      });
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <Link className={styles.back__btn} href="/">
        Back
      </Link>
      <h1 className={styles.title}>Create Project</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <h3 className={styles.form__text}>Project Title: </h3>
          <input
            placeholder="Project Title"
            type="text"
            className={styles.input}
            value={state.title}
            onChange={(e) => updateState({ title: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}>Project Description: </h3>
          <textarea
            placeholder="Project Description"
            className={styles.input}
            value={state.description}
            onChange={(e) => updateState({ description: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}>Project End Goal: </h3>
          <textarea
            placeholder="Project End Goal"
            className={styles.input}
            value={state.endGoal}
            onChange={(e) => updateState({ endGoal: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}>Project category: </h3>
          <input
            placeholder="development category"
            className={styles.input}
            value={state.category}
            onChange={(e) => updateState({ category: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}>Team Lead: </h3>
          <input
            placeholder="Team Lead"
            className={styles.input}
            value={state.teamLead}
            onChange={(e) => updateState({ teamLead: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}> Tech Stack: </h3>
          <h5 className={styles.form__text}>
            <blockquote>Note: </blockquote>Insert , between each Tech
          </h5>
          <textarea
            placeholder="Tech Stack"
            className={styles.input}
            value={state.techStack}
            onChange={(e) =>
              updateState({ techStack: e.target.value.split(",") })
            }
          />
        </div>
        <div>
          <h3 className={styles.form__text}>source code Link: </h3>
          <input
            placeholder="link"
            type="text"
            className={styles.input}
            value={state.githubLink}
            onChange={(e) => updateState({ githubLink: e.target.value })}
          />
        </div>
        <div>
          <h3 className={styles.form__text}>End Date: </h3>
          <input
            type="date"
            className={styles.input}
            value={state.endDate}
            onChange={(e) => updateState({ endDate: e.target.value })}
          />
        </div>

        <button className={styles.create__btn}>Create</button>
      </form>
    </div>
  );
};

export default CreateProject;
