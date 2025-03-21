import React from "react";
import addIcon from "../../img/add.png";
import { Navigate, useNavigate } from "react-router-dom";

type Props = {};

const AddTeamButton = (props: Props) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-primary  p-1 min-h-0 h-6 ml-2 justify-center items-center"
      onClick={() => navigate("/team/create")}
    >
      <img src={addIcon} className="h-2/3" alt="add icon" />
      Add team
    </button>
  );
};

export default AddTeamButton;
