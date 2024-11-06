import React, { PropsWithChildren, useEffect } from "react";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

export const DefautLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-[100vh] flex flex-col relative overflow-y-auto">
      <div className="sticky top-0 w-full z-50">
        <Header defaultStatus="newFeed" />
      </div>
      <div className="w-full md:fixed md:top-[64px]">
        <div className="flex flex-col">
          {children}
        </div>
      </div>
      {/* <ChatMonitor /> */}
    </div>
  );
};

export default DefautLayout;
