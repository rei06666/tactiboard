import Icon from "../../img/join_livetactics.png";
import { useState } from "react";
import GoToLiveTacticsModal from "./GoToLiveTacticsModal";

type Props = {
  tacticsName: string;
  team: string;
  isAdmin: boolean;
};

const GoToLiveTacticsButton = (props: Props) => {
  const { tacticsName, team, isAdmin } = props;
  const [ showGoToLiveTacticsModal, setShowGoToLiveTacticsModal ] = useState(false);
  return (
    <>
      <div className="btn btn-ghost btn-square" onClick={() => setShowGoToLiveTacticsModal(true)}>
        <img src={Icon} className="h-5 w-5 " alt="icon" />
      </div>
      {showGoToLiveTacticsModal && (
        <GoToLiveTacticsModal
          tacticsName={tacticsName}
          team={team}
          isAdmin={isAdmin}
          setShowGoToLiveTacticsModal={setShowGoToLiveTacticsModal}
        />
      )}
    </>
  );
};

export default GoToLiveTacticsButton;