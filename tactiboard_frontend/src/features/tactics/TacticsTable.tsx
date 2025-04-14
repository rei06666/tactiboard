import React, { useLayoutEffect } from "react";
import TacticsSettingDropdown from "./TacticsSettingDropdown";
import GoToLiveTacticsButton from "./GoToLiveTacticsButton";
import { createContext } from "react";
import Message from "../../components/Message";

export const MessageContext = createContext<{
  message: Message | null;
  setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}>({
  message: null,
  setMessage: () => { },
});

type Props = {
  userName: string;
  dispatch: React.ActionDispatch<[action: Action]>;
  isTacticsPage: boolean;
};

type Tactics = {
  name: string;
  team: string;
  description: string;
  create_date: string;
  admin: string;
};

export type Action =
  | { datatype: string; type: "error"; message: string }
  | { datatype: string; type: "success" };

type Message = {
  type: "error" | "success";
  text: string;
};

const TacticsTable = (props: Props) => {
  const { userName, dispatch, isTacticsPage } = props;
  const [tactics, setTactics] = React.useState<Tactics[]>([]);
  const [message, setMessage] = React.useState<Message | null>(null);
  useLayoutEffect(() => {
    getTactics(userName);
  }, [message]);

  const getTactics = async (userName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        username: userName,
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/tactics?` + params, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setTactics(data.data);

      dispatch({ datatype: "tactics", type: "success" });
    } catch (error) {
      console.error(error);
      dispatch({
        datatype: "tactics",
        type: "error",
        message: "Failed to get tactics",
      });
    }
  };

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      <div className="md:overflow-x-visible overflow-x-scroll">
        <div className="max-w-xs ml-2 mt-1">
          {message && <Message type={message.type} text={message.text} />}
        </div>
        <div className="overflow-x-auto mt-5">
          <table className="table w-[90%] mx-auto ml-5">
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Description</th>
                <th>Create_date</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {tactics.length > 0 ? (
                tactics.map((tacticsItem, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-bold">{tacticsItem.name}</div>
                    </td>
                    <td>
                      <div className="font-bold">{tacticsItem.team}</div>
                    </td>
                    <td>
                      <div className="font-bold">{tacticsItem.description}</div>
                    </td>
                    <td>
                      <div className="font-bold">{tacticsItem.create_date}</div>
                    </td>
                    <td>
                      <div className="font-bold">{tacticsItem.admin}</div>
                    </td>

                    {isTacticsPage && (
                      <>
                        <td>
                          <GoToLiveTacticsButton
                            tacticsName={tacticsItem.name}
                            team={tacticsItem.team}
                            isAdmin={tacticsItem.admin === userName}
                          />
                        </td>
                        <td>
                          <TacticsSettingDropdown
                            tacticsName={tacticsItem.name}
                            team={tacticsItem.team}
                            isAdmin={tacticsItem.admin === userName}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center font-bold">
                    No Tactics
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MessageContext.Provider>
  );
};

export default TacticsTable;
