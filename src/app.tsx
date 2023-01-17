import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Notfound from "./pages/not-found";
import Home from "./pages/remote-b";

const App = () => (
  <>
    <Suspense fallback={<span>Loading...</span>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </Suspense>
  </>
);

export default App;
