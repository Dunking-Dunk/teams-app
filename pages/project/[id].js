import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Project.module.css";
import { useRouter } from "next/router";
import {
  getDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
  addDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, getClientStorage } from "../../firebaseConfig";
import Link from "next/link";
import Progress from "../../components/Progress";
import moment from "moment/moment";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineStop } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { IoIosArrowDroprightCircle } from "react-icons/io";

import { BsFileImageFill } from "react-icons/bs";

const Project = ({ user }) => {
  const metadata = {
    contentType: "image/jpeg",
  };
  const scrlBottomRef = useRef();
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState({});
  const [currentTemplate, setCurrentTemplate] = useState("info");
  const [goal, setGoal] = useState({
    goal: "",
    technology: "",
    endDate: "",
    referenceLink: "",
  });
  const [message, setMessage] = useState({
    message: "",
    image: "",
  });

  useEffect(() => {
    const getProject = async () => {
      if (id) {
        const projectRef = doc(db, "projects", id);
        let data = await getDoc(projectRef);
        setProject(data.data());
        if (data.data()) {
          if (data.data()?.teamMembers?.length > 0) {
            const q = query(
              collection(db, "users"),
              where("id", "in", data.data().teamMembers)
            );
            const userSnapShot = await getDocs(q);
            setProject((data) => ({ ...data, team: userSnapShot.docs }));
          }
          const projectGoalRef = query(
            collection(db, "projects", id, "goals"),
            orderBy("endDate", "desc")
          );
          const unsub = await onSnapshot(projectGoalRef, (goal) => {
            setProject((data) => ({ ...data, goals: goal.docs }));
          });
          const projectForumRef = query(
            collection(db, "projects", id, "messages"),
            orderBy("createdAt", "asc")
          );
          const unsubForum = await onSnapshot(projectForumRef, (msg) => {
            setProject((data) => ({ ...data, messages: msg.docs }));
          });
          return () => {
            unsub();
            unsubForum();
          };
        }
      }
    };
    getProject();
  }, [id]);

  useEffect(() => {
    const headerBtn = document.querySelectorAll("#header__btn");
    const templates = document.querySelectorAll("#template");
    templates.forEach((template) => {
      if (template.getAttribute("data-template") === currentTemplate) {
        template.className = styles.template__active;
      } else template.className = styles.template;
    });
    headerBtn.forEach((btn) => {
      if (btn.getAttribute("data-template") === currentTemplate) {
        btn.className = styles.header__btn__active;
      } else {
        btn.className = styles.header__btn;
      }
    });
    if (scrlBottomRef.current)
      scrlBottomRef.current.scrollTop = scrlBottomRef.current.scrollHeight;
  }, [currentTemplate]);

  const handleCreateGoal = async () => {
    const projectRef = collection(db, "projects", id, "goals");
    if (goal.goal.length > 3 && goal.technology.length > 3 && goal.endDate) {
      await addDoc(projectRef, {
        goal: goal.goal,
        technology: goal.technology.split(","),
        endDate: goal.endDate,
        createdBy: user.id,
        completedUser: [],
        referenceLink: goal.referenceLink,
      });
      setGoal({
        goal: "",
        technology: "",
        endDate: "",
        referenceLink: "",
      });
    }
  };

  const handleGoalChange = (e, val) => {
    setGoal((data) => ({ ...data, [val]: e.target.value }));
  };

  const goalStatusHandler = async (e, goalId, action) => {
    e.stopPropagation();
    const goalRef = doc(db, "projects", id, "goals", goalId);
    if (action === "completed") {
      await updateDoc(goalRef, {
        completedUser: arrayUnion(user.id),
      });
    } else {
      await updateDoc(goalRef, {
        completedUser: arrayRemove(user.id),
      });
    }
  };

  const findMember = (id, members) => {
    const found = members?.find((member) => member.id == id);
    return found?.data();
  };

  const handleDeleteGoal = async (e, goalId) => {
    const docRef = doc(db, "projects", id, "goals", goalId);
    await deleteDoc(docRef);
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    const projectRef = collection(db, "projects", id, "messages");
    if (message.message.length > 1) {
      if (message.image) {
        const storageRef = ref(
          getClientStorage,
          "images/" + message.image.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          message.image,
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
                await addDoc(projectRef, {
                  message: message.message,
                  user: user.id,
                  createdAt: Date(),
                  image: downloadURL,
                });
              }
            );
          }
        );
      } else {
        await addDoc(projectRef, {
          message: message.message,
          user: user.id,
          createdAt: Date(),
        });
      }

      setMessage({
        message: "",
        image: "",
      });
      scrlBottomRef.current.scrollTop = scrlBottomRef.current.scrollHeight;
    }
  };
  if (project) {
    return (
      <div className={styles.container}>
        <Link className={styles.back__btn} href="/">
          Back
        </Link>
        <div className={styles.header}>
          <div className={styles.header__container}>
            <button
              className={styles.header__btn}
              id="header__btn"
              onClick={() => {
                setCurrentTemplate("info");
              }}
              data-template="info"
            >
              info
            </button>
            <button
              id="header__btn"
              className={styles.header__btn}
              onClick={() => {
                setCurrentTemplate("goals");
              }}
              data-template="goals"
            >
              goals
            </button>
            <button
              id="header__btn"
              className={styles.header__btn}
              onClick={() => {
                setCurrentTemplate("forum");
              }}
              data-template="forum"
            >
              Forum
            </button>
          </div>
        </div>
        <div>
          <h1 className={styles.detail__title}>{project.title}</h1>
          <div id="template" data-template="info" className="template">
            <div className={styles.row}>
              <div className={styles.detail__container}>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Category</span>
                  <p className={styles.detail__row__value}>
                    {project.category}
                  </p>
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Description</span>
                  <p className={styles.detail__row__value}>
                    {project.description}
                  </p>
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>End Goal</span>
                  <p className={styles.detail__row__value}>{project.endGoal}</p>
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Tech Stack</span>
                  <div className={styles.techStack__container}>
                    {project.techStack?.length > 0 &&
                      project.techStack.map((stack, index) => (
                        <div className={styles.tech} key={index}>
                          {stack}
                        </div>
                      ))}
                  </div>
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Team Lead</span>
                  <p className={styles.detail__row__value}>
                    {project.teamLead}
                  </p>
                </div>
                <span className={styles.detail__row__title}>Team</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {project.team &&
                    project.team.map((user) => {
                      const data = user.data();
                      return (
                        <div className={styles.member} key={user?.id}>
                          <div
                            className={styles.member__img__container}
                            key={user.id}
                          >
                            <img
                              className={styles.member__img}
                              src={data.photoURL}
                            />
                          </div>
                          <p className={styles.user__name}>{data.userName}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={styles.detail__sub__container}>
                {project.githubLink && (
                  <div className={styles.code__container}>
                    <h3>Code</h3>
                    <Link
                      href={project.githubLink}
                      className={styles.githubLink}
                    >
                      {project.githubLink}
                    </Link>
                  </div>
                )}

                <div className={styles.date__container}>
                  <h3>{moment(project?.startDate).format("MMMM Do YYYY")}</h3>
                  <Progress />
                  <h3>{moment(project?.endDate).format("MMMM Do YYYY")}</h3>
                </div>
              </div>
            </div>
          </div>
          <div id="template" data-template="goals" className="template">
            {project.team?.find((member) => member.id === user?.id) && (
              <div className={styles.create__goal}>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Goal</span>
                  <input
                    placeholder="Goal"
                    type="text"
                    className={styles.goal__input}
                    onChange={(e) => handleGoalChange(e, "goal")}
                    value={goal.goal}
                  />
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>
                    Technology and libraries
                  </span>
                  <input
                    placeholder="       ',' between tech and lib"
                    type="text"
                    className={styles.goal__input}
                    onChange={(e) => handleGoalChange(e, "technology")}
                    value={goal.technology}
                  />
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>
                    Reference Link
                  </span>
                  <input
                    placeholder="Link"
                    type="text"
                    className={styles.goal__input}
                    onChange={(e) => handleGoalChange(e, "referenceLink")}
                    value={goal.referenceLink}
                  />
                </div>
                <div className={styles.detail__row}>
                  <span className={styles.detail__row__title}>Due Date</span>
                  <input
                    type="date"
                    className={styles.goal__input}
                    onChange={(e) => handleGoalChange(e, "endDate")}
                    value={goal.endDate}
                  />
                </div>
                <button
                  className={styles.goal__create__btn}
                  onClick={handleCreateGoal}
                >
                  Create
                </button>
              </div>
            )}
            <div className={styles.goals__container}>
              {project.goals &&
                project.goals.map((goal) => {
                  const data = goal.data();
                  const createdMember = findMember(
                    data.createdBy,
                    project.team
                  );
                  const expired = moment() > moment(data.endDate);

                  return (
                    <>
                      <div
                        key={goal.id}
                        className={styles.goal__card}
                        style={{
                          pointerEvents: expired ? "none" : "",
                          opacity: expired ? 0.5 : 1,
                        }}
                      >
                        <div className={styles.goal__card__left}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div className={styles.member__img__container}>
                              <img
                                className={styles.member__img}
                                src={createdMember?.photoURL}
                              />
                            </div>
                            <h5 className={styles.goal__card__created}>
                              Goal Created By {createdMember?.userName}
                            </h5>
                          </div>
                          <h3 className={styles.goal__card__title}>
                            {data.goal}
                          </h3>

                          <div className={styles.techStack__container}>
                            {data.technology?.length > 0 &&
                              data.technology.map((tech, index) => (
                                <div className={styles.tech} key={index}>
                                  {tech}
                                </div>
                              ))}
                          </div>
                          {data.referenceLink && (
                            <a
                              href={data.referenceLink}
                              className={styles.githubLink}
                            >
                              {data.referenceLink}
                            </a>
                          )}
                        </div>
                        <div className={styles.goal__card__right}>
                          <h5 className={styles.goal__right__time}>
                            expires {moment(data.endDate).fromNow()}
                          </h5>
                          <div className={styles.goal__card__completedUser}>
                            {data.completedUser &&
                              data.completedUser.map((id) => {
                                const data = findMember(id, project.team);
                                return (
                                  <div
                                    className={styles.member__img__container}
                                    key={user?.id}
                                  >
                                    <img
                                      className={styles.member__img}
                                      src={data.photoURL}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                          {project.team?.find(
                            (member) => member.id === user?.id
                          ) && !data.completedUser?.includes(user?.id) ? (
                            <button
                              onClick={(e) =>
                                goalStatusHandler(e, goal.id, "completed")
                              }
                              className={styles.goal__completed__btn}
                            >
                              <MdOutlineDone size={18} color="white" />
                            </button>
                          ) : (
                            project.team?.find(
                              (member) => member.id === user?.id
                            ) && (
                              <button
                                onClick={(e) =>
                                  goalStatusHandler(e, goal.id, "nope")
                                }
                                className={styles.goal__completed__btn}
                              >
                                <AiOutlineStop size={18} color="white" />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      {user?.admin && (
                        <button
                          className={styles.delete__button}
                          onClick={(e) => handleDeleteGoal(e, goal.id)}
                        >
                          <BsFillTrashFill size={22} color="white" />
                        </button>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </div>
        <div id="template" data-template="forum" className="template">
          <div className={styles.forum}>
            <div className={styles.forum__container} ref={scrlBottomRef}>
              {project.messages &&
                project.messages.map((message, index) => {
                  const data = message.data();

                  const msgUser = findMember(data.user, project.team);
                  const prevMsg = project.messages[index - 1]?.data();
                  const prevDate = moment(prevMsg?.createdAt).format("l");
                  const todayDate = moment(data.createdAt).format("l");

                  return (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {prevDate !== todayDate && (
                        <h5 style={{ alignSelf: "center" }}>
                          {moment(data.createdAt).format("l")}
                        </h5>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            data.user === user?.id ? "flex-start" : "flex-end",
                        }}
                      >
                        <div className={styles.forum__message__card}>
                          <div className={styles.forum__member__img__container}>
                            <img
                              className={styles.member__img}
                              src={msgUser?.photoURL}
                            />
                          </div>
                          <div className={styles.forum__message__card__detail}>
                            <h5>{msgUser?.userName}</h5>
                            {data.image && (
                              <a href={data.image}>
                                <img
                                  src={data.image}
                                  className={styles.forum__card__image}
                                />
                              </a>
                            )}
                            {data.message.includes("http") ? (
                              <a
                                className={styles.forum__card__text}
                                href={data.message}
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                {data.message}
                              </a>
                            ) : (
                              <p className={styles.forum__card__text}>
                                {data.message}
                              </p>
                            )}

                            <p className={styles.forum__card__time}>
                              {moment(data.createdAt).format("LT")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {project.team?.find((member) => member.id === user?.id) && (
              <form
                className={styles.forum__create__container}
                onSubmit={handleCreateMessage}
              >
                <input
                  className={styles.forum__create__input}
                  onChange={(e) => {
                    setMessage((data) => ({
                      ...data,
                      message: e.target.value,
                    }));
                  }}
                  value={message.message}
                />
                <label className={styles.forum__create__imgInput__container}>
                  <input
                    type="file"
                    onChange={(e) =>
                      setMessage((data) => ({
                        ...data,
                        image: e.target.files[0],
                      }))
                    }
                    className={styles.forum__create__imgInput}
                  />
                  <BsFileImageFill size={22} color="white" />
                </label>

                <button className={styles.forum__create__button}>
                  <IoIosArrowDroprightCircle size={22} color="white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h1
        className={styles.detail__title}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        NOT FOUND
      </h1>
    );
  }
};

export default Project;
