import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import CreateTeam from "./pages/CreateTeam";
import TeamMembers from "./pages/TeamMembers";
import InviteMember from "./pages/InviteMember";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="*" element={<Top />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/create" element={<CreateTeam />} />
        <Route path="/team/:teamName/members" element={<TeamMembers />} />
        <Route path="/team/:teamName/invite" element={<InviteMember />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;