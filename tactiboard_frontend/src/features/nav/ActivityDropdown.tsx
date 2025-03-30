import React, { useState, useRef } from "react";
import { useLayoutEffect } from "react";
import { set } from "react-hook-form";

type Props = {
  userName: string;
};

type Activity = {
  name: string;
  activity: string;
  create_date: string;
};

const ActivityDropdown = (props: Props) => {
  const { userName } = props;
  const [activities, setActivities] = useState<Activity[]>([]);

  useLayoutEffect(() => {
    getActivity(userName);
  }, []);

  const getActivity = async (userName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        userName: userName,
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/activity?` + params,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setActivities(data.activities); // アクティビティを状態に保存
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptInvite = (activityName: string) => {
    console.log(`Accepted invite for activity: ${activityName}`);
    // 招待を受ける処理をここに追加
  };

  const handleRejectInvite = (activityName: string) => {
    console.log(`Rejected invite for activity: ${activityName}`);
    // 招待を拒否する処理をここに追加
  };

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      {/* トリガーボタン */}
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="badge badge-xs badge-error indicator-item"></span>
        </div>
      </div>

      {/* ドロップダウンメニュー */}
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-auto p-2 shadow"
      >
        {activities.map((activity) => (
          <li key={activity.name} className="mb-2">
            <div className="flex items-center justify-between">
              {/* アクティビティ名と日付 */}
              <div className="flex flex-col">
                <p className="font-bold w-auto whitespace-nowrap">
                  {activity.name}
                </p>
                <p className="text-sm text-gray-500 w-auto whitespace-nowrap">
                  {activity.create_date}
                </p>
              </div>

              {/* ボタン */}
              {activity.activity === "invite" && (
                <div className="flex gap-2">
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => handleAcceptInvite(activity.name)}
                  >
                    accept
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleRejectInvite(activity.name)}
                  >
                    reject
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityDropdown;
