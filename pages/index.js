import styles from "../styles/Home.module.css";
import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, getAuthClient } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import Card from "../components/Card";

export default function Home({ user }) {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (doc) => {
      setProjects(doc.docs);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    projects.forEach(async (project) => {
      if (project.data().teamMembers.length > 0) {
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
          return (
            <Card
              project={project}
              detail={false}
              users={users}
              user={user}
              key={project.id}
            />
          );
        })}
      </div>
    </div>
  );
}
