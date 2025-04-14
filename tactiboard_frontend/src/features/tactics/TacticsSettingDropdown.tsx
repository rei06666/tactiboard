import { useState } from "react";
import DeleteTacticsModal from "./DeleteTacticsModal";

type Props = {
  tacticsName: string;
  isAdmin: boolean;
  team: string;
};

const TacticsSettingDropdown = (props: Props) => {
  const { tacticsName, isAdmin, team } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <td>
      <div className="dropdown dropdown-left">
        {/* トリガーボタン */}
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>

        {/* ドロップダウンメニュー */}
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
        >
          {/* 戦術を消す */}
          <li
            className={
              isAdmin
                ? "font-bold text-rose-600"
                : "text-rose-400 pointer-events-none font-bold"
            }
            onClick={() => {
              if (isAdmin) setShowDeleteModal(true);
            }}
          >
            <a>Delete Tactics</a>
          </li>
        </ul>
      </div>
      {/* 戦術を消す確認モーダル */}
      {showDeleteModal && (
        <DeleteTacticsModal
          tacticsName={tacticsName}
          team={team}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </td>
  );
};

export default TacticsSettingDropdown;
