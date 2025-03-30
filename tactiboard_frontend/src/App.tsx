import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import CreateTeam from "./pages/CreateTeam";
// import EditTeam from "./pages/EditTeam";
// import TeamMembers from "./pages/TeamMembers";
// import InviteMembers from "./pages/InviteMembers";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="*" element={<Top />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team/create" element={<CreateTeam />} />
        {/* <Route path="/team/:teamName/edit" element={<EditTeam />} />
        <Route path="/team/:teamName/members" element={<TeamMembers />} />
        <Route path="/team/:teamName/invite" element={<InviteMembers />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;