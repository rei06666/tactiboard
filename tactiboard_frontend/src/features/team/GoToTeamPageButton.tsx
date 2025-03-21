import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const GoToTeamPageButton = (props: Props) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn p-1 min-h-0 h-6 ml-2 justify-center items-center"
      onClick={() => navigate("/team")}
    >
      Go to team page
    </button>
  );
};

export default GoToTeamPageButton;
