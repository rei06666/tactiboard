import React from "react";
import { useState } from "react";
import { MessageContext } from "./TeamTable";

type Props = {
  teamName: string;
  setShowLeaveModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveTeamModal = (props: Props) => {
  const { teamName, setShowLeaveModal } = props;
  const userName = localStorage.getItem("TactiBoardUserName") as string;
  const setMessage = React.useContext(MessageContext).setMessage;

  const leaveTeam = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/team/leave`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: teamName,
            username: userName,
          }),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      const responseJson = await response.json();
      setShowLeaveModal(false);
      setMessage({
        type: "success",
        text: "Left team successfully",
      });
    } catch (error) {
      console.error(error);
      setShowLeaveModal(false);
      setMessage({
        type: "error",
        text: "Failed to leave team",
      });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you sure you want to leave team?
        </h3>
        <div className="modal-action">
          <button className="btn btn-error" onClick={leaveTeam}>
            Yes
          </button>
          <button className="btn" onClick={() => setShowLeaveModal(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveTeamModal;
