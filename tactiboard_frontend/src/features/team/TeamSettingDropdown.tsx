import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteTeamModal from "./DeleteTeamModal";
import LeaveTeamModal from "./LeaveTeamModal";

type Props = {
  teamName: string;
  isAdmin: boolean;
};

const TeamSettingDropdown = (props: Props) => {
  const navigate = useNavigate();
  const { teamName, isAdmin } = props;

  const [showLeaveModal, setShowLeaveModal] = useState(false);
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
          {/* メンバー一覧を見る */}
          <li
            onClick={() => {
              navigate(`/team/${teamName}/members`);
            }}
            className="font-bold"
          >
            <a>View Members</a>
          </li>

          {/* メンバーを招待 */}
          <li
            onClick={() => {
              navigate(`/team/${teamName}/invite`);
            }}
            className="font-bold"
          >
            <a>Invite Members</a>
          </li>

          {/* チームを離れる */}
          <li
            className={
              isAdmin
                ? "text-gray-400 pointer-events-none font-bold"
                : "font-bold"
            }
            onClick={() => {
              if (!isAdmin) setShowLeaveModal(true);
            }}
          >
            <a>Leave Team</a>
          </li>

          {/* チームを消す */}
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
            <a>Delete Team</a>
          </li>
        </ul>
      </div>
      {/* チームを消す確認モーダル */}
      {showDeleteModal && (
        <DeleteTeamModal
          teamName={teamName}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      {/* チームを離れる確認モーダル */}
      {showLeaveModal && (
        <LeaveTeamModal
          teamName={teamName}
          setShowLeaveModal={setShowLeaveModal}
        />
      )}
    </td>
  );
};

export default TeamSettingDropdown;
