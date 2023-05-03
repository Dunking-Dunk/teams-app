import styles from "../styles/Home.module.css";
import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/Card";
import moment from "moment";

export default function Home({ user }) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "projects"), orderBy("endDate")),
      (doc) => {
        setProjects(doc.docs);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    projects.forEach(async (project) => {
      if (project.data().teamMembers?.length > 0) {
        const q = query(
          collection(db, "users"),
          where("id", "in", project.data().teamMembers)
        );
        const userSnapShot = await getDocs(q);
        setTeams((data) => ({ ...data, [project.id]: userSnapShot.docs }));
      }
    });
  }, [projects]);

  return (
    <div className={styles.container}>
      {user?.admin && (
        <div className={styles.create__container}>
          <h3 className={styles.create__title}>Create a Project</h3>
          <Link className={styles.create__btn} href="/project/create">
            Create
          </Link>
        </div>
      )}
      <div className={styles.projects__container}>
        {projects.map((project) => {
          const users = teams[project.id];

          if (moment() < moment(project.data().endDate)) {
            return (
              <Card
                project={project}
                detail={false}
                users={users}
                user={user}
                key={project.id}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
