import React, { ReactNode } from "react";

type PageType = {
  children?: ReactNode;
};

const Page = ({ children }: PageType) => {
  return (
    <div>
      <h1>Not found</h1>
      {children}
    </div>
  );
};

export default Page;
