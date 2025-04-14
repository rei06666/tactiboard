import React from "react";
import NavBar from "../features/nav/NavBar";
import CreateTacticsForm from "../features/tactics/CreateTacticsForm";


const CreateTactics: React.FC = () => {
  const userName = localStorage.getItem("TactiBoardUserName") as string;
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar userName={userName} />
      <div className="animate-fadeIn">
        <div className="mt-5 ml-5 mr-5">
          <div className="flex mb-0 items-end">
            <div className="font-outfit font-bold text-2xl md:text-3xl p-2 pb-0">
              Create Tactics
            </div>
          </div>
          <CreateTacticsForm />
        </div>
      </div>
    </div>
  );
};

export default CreateTactics;
