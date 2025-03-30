import React from "react";
import { useState, useContext } from "react";
import { MessageContext } from "./TeamTable";

type Props = {
  teamName: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteTeamModal = (props: Props) => {
  const { teamName, setShowDeleteModal } = props;
  const setMessage = useContext(MessageContext).setMessage;

  const deleteTeam = async () => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_API_PATH}/team/`,
            {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: teamName,
            }),
            }
        );
        if (!response.ok) {
        throw new Error();
        }
        const responseJson = await response.json();
        setShowDeleteModal(false);
        setMessage({
            type: "success",
            text: "Team deleted successfully",
        });
    } catch (error) {
        console.error(error);
        setShowDeleteModal(false);
        setMessage({
            type: "error",
            text: "Failed to delete team",
        });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Are you sure you want to delete the team?
        </h3>
        <div className="modal-action">
          <button className="btn btn-error" onClick={() => deleteTeam()}>
            Yes
          </button>
          <button className="btn" onClick={() => setShowDeleteModal(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeamModal;
