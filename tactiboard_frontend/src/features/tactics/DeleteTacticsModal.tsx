import React from "react";
import { useContext } from "react";
import { MessageContext } from "./TacticsTable";

type Props = {
  tacticsName: string;
  team: string;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteTacticsModal = (props: Props) => {
  const { tacticsName, team, setShowDeleteModal } = props;
  const setMessage = useContext(MessageContext).setMessage;

  const deleteTactics = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/tactics/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tacticsName,
            team: team
          }),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
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
          Are you sure you want to delete the tactics?
        </h3>
        <div className="modal-action">
          <button className="btn btn-error" onClick={() => deleteTactics()}>
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

export default DeleteTacticsModal;
