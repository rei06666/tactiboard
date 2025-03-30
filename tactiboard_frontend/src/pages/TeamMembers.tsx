import React from "react";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import NavBar from "../features/nav/NavBar";
import Message from "../components/Message";
import TeamMembersTable from "../features/team/TeamMembersTable";


const TeamMembers: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const userName = localStorage.getItem("TactiBoardUserName") as string;
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar userName={userName} />
      <div className="animate-fadeIn">
        <div className="mt-5 ml-5 mr-5">
          <div className="flex mb-0 items-end">
            <div className="font-outfit font-bold text-2xl md:text-3xl p-2 pb-0">
              Members:   {teamName}
            </div>
          </div>
          <TeamMembersTable teamName={teamName || ""}/>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
