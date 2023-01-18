import React from "react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./_remote_b.module.css";

export type PageType = {
  children?: ReactNode;
};

const Page = ({ children }: PageType) => {
  const { pathname } = useLocation();

  return (
    <div className={styles["remote-b-home"]}>
      <h1>Home Remote B</h1>

      {pathname === "/remote-b" && <Link to="/">To Host</Link>}
      {pathname === "/" && <Link to="/remote-b">To Remote B</Link>}
      {children}
    </div>
  );
};

export default Page;
