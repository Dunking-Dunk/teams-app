import styles from "../styles/Header.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Header = ({ user, signOutHandler }) => {
  const span1 = useRef();
  const span2 = useRef();
  const span3 = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    const links = document.querySelectorAll("#link");
    let prevLink = links[0];
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.target.classList.add(styles.link__active);

        prevLink.classList.remove(styles.link__active);
        prevLink = e.target;
      });
    });
  }, []);

  const toggleNav = () => {
    navigationRef.current.classList.toggle(styles.right__active);
    span1.current.classList.toggle("active");
    span2.current.classList.toggle("active");
    span3.current.classList.toggle("active");
  };

  return (
    <div className={styles.container}>
      <Link href="/">
        <h1 className={styles.title}>ALPHA</h1>
      </Link>
      <div className={styles.mobile__menu} onClick={toggleNav}>
        <span ref={span1}></span>
        <span ref={span2}></span>
        <span ref={span3}></span>
      </div>
      <div className={styles.right} ref={navigationRef}>
        {user && (
          <>
            <Link href="/" className={styles.link} id="link">
              Projects
            </Link>
            <Link href="/members" className={styles.link} id="link">
              Members
            </Link>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
