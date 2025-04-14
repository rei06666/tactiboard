import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  tacticsName: string;
  team: string;
  isAdmin: boolean;
  setShowGoToLiveTacticsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const GoToLiveTacticsModal = (props: Props) => {
  const { tacticsName, team, setShowGoToLiveTacticsModal } = props;
  const navigate = useNavigate();

  return (
    <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="modal-box relative text-base shadow-xl animate-scaleUp">
        <button
          className="absolute top-2 right-2 text-white text-xl font-bold hover:text-gray-300"
          onClick={() => setShowGoToLiveTacticsModal(false)}
        >
          ✕
        </button>
        <h3 className="font-bold text-2xl text-center mb-4">
          Ready to go live?
        </h3>
        <p className="text-center mb-6">
          <strong>{tacticsName}</strong> in team <strong>{team}</strong>.
        </p>
        <div className="modal-action flex justify-center gap-4">
          <button
            className="btn bg-teal-200 hover:bg-teal-500 text-primary-content font-bold px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            onClick={() => navigate(`/tactics/live/${team}/${tacticsName}`)}
          >
            Go Live
          </button>
          <button
            className="btn  bg-text-base font-bold px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            onClick={() => setShowGoToLiveTacticsModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoToLiveTacticsModal;