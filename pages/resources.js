// import React, { useState, useEffect } from "react";
// import styles from "../styles/Resources.module.css";
// import Link from "next/link";
// import { GoLinkExternal } from "react-icons/go";
// import { db } from "../firebaseConfig";
// import { addDoc, collection, onSnapshot } from "firebase/firestore";

// const Resources = ({ user }) => {
//   const [currentTemplate, setCurrentTemplate] = useState("ai");
//   const [resource, setResource] = useState({
//     description: "",
//     link: "",
//   });
//   const [resources, setResources] = useState([]);

//   useEffect(() => {
//     const getData = async () => {
//       const resourceRef = collection(db, "resources");
//       const unsub = await onSnapshot(resourceRef, (res) => {
//         setResources(res.docs);
//       });
//     };

//     getData();
//   }, []);

//   useEffect(() => {
//     const headerBtn = document.querySelectorAll("#header__btn");
//     const templates = document.querySelectorAll("#template");
//     templates.forEach((template) => {
//       if (template.getAttribute("data-template") === currentTemplate) {
//         template.className = styles.template__active;
//       } else template.className = styles.template;
//     });
//     headerBtn.forEach((btn) => {
//       if (btn.getAttribute("data-template") === currentTemplate) {
//         btn.className = styles.header__btn__active;
//       } else {
//         btn.className = styles.header__btn;
//       }
//     });
//   }, []);

//   const handleResourceChange = (e, val) => {
//     setResource((data) => ({ ...data, [val]: e.target.value }));
//   };

//   const handleCreateResource = async () => {
//     const projectRef = collection(db, "resources");
//     if (resource.link.length > 4) {
//       await addDoc(projectRef, {
//         description: resource.description,
//         category: currentTemplate,
//         createdBy: user.id,
//         link: resource.link,
//       });
//       setResource({
//         link: "",
//         description: "",
//       });
//     }
//   };

//   return (
//     <div>
//       <h1>Resources</h1>
//       {/* <div className={styles.header}>
//         <div className={styles.header__container}>
//           <button
//             className={styles.header__btn}
//             id="header__btn"
//             onClick={() => {
//               setCurrentTemplate("ai");
//             }}
//             data-template="ai"
//           >
//             AI
//           </button>
//           <button
//             id="header__btn"
//             className={styles.header__btn}
//             onClick={() => {
//               setCurrentTemplate("web");
//             }}
//             data-template="web"
//           >
//             WEB
//           </button>
//           <button
//             id="header__btn"
//             className={styles.header__btn}
//             onClick={() => {
//               setCurrentTemplate("ui/ux");
//             }}
//             data-template="ui/ux"
//           >
//             UI/UX
//           </button>
//         </div>
//       </div> */}
//       <div className={styles.create__goal}>
//         <div className={styles.detail__row}>
//           <span className={styles.detail__row__title}>Description</span>
//           <input
//             placeholder="Description"
//             type="text"
//             className={styles.goal__input}
//             onChange={(e) => handleResourceChange(e, "description")}
//             value={resource.description}
//           />
//         </div>
//         <div className={styles.detail__row}>
//           <span className={styles.detail__row__title}>Link</span>
//           <input
//             placeholder="Link"
//             type="text"
//             className={styles.goal__input}
//             onChange={(e) => handleResourceChange(e, "link")}
//             value={resource.link}
//           />
//         </div>
//         <button
//           className={styles.goal__create__btn}
//           onClick={handleCreateResource}
//         >
//           Create
//         </button>
//       </div>
//       {/* <h1>{currentTemplate.toUpperCase()}</h1> */}
//       <div id="template" data-template="ai" className="template">
//         {resources.map((res) => {
//           const data = res.data();
//           return (
//             <div className={styles.resource__card} key={res.id}>
//               <iframe src={data.link} height="250" />
//               <h5 className={styles.resource__card__description}>
//                 {data.description}
//               </h5>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: "20px",
//                 }}
//               >
//                 <Link href={data.link} className={styles.resource__card__btn}>
//                   <GoLinkExternal size={22} />
//                 </Link>
//                 {user?.admin && (
//                   <button className={styles.resource__card__btndlt}>
//                     delete
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Resources;
