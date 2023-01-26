import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./_about.module.css";

const Page = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles["remote-b-about"]}>
      <h1>Remote B - About</h1>

      {pathname === "/remote-b" && <Link to="/">To Host</Link>}
      {pathname === "/" && (
        <Link to="/remote-b/about">To Remote B - About</Link>
      )}
    </div>
  );
};

export default Page;
