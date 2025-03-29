import React, { useLayoutEffect } from "react";

type Props = {
  userName: string;
  dispatch: React.Dispatch<Action>;
};

interface Team {
  name: string;
  description: string;
  admin: string;
  create_date: string;
  emblem: { type: string; data: number[] };
}

export type Action =
  | { datatype: string; type: "error"; message: string }
  | { datatype: string; type: "success" };

const TeamTable = (props: Props) => {
  const { userName, dispatch } = props;
  const [teams, setTeam] = React.useState<Team[]>([]);

  useLayoutEffect(() => {
    getTeam(userName);
  }, []);


  const getTeam = async (userName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        username: userName,
      });

      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/team?` + params, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error();
      }

      const data = await response.json()
      setTeam(data.data);

      dispatch({ datatype: "team", type: "success" });
    } catch (error) {
      console.error(error);
      dispatch({
        datatype: "team",
        type: "error",
        message: "Failed to get team",
      });
    }
  };

  const arrayBufferToBase64 = (buffer: { type: string; data: number[] }): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer.data);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Emblem</th>
            <th>Name</th>
            <th>Description</th>
            <th>Admin</th>
            <th>Create Date</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.name}>
              <td>
                {team.emblem && (
                  <img
                    src={`data:image/png;base64,${arrayBufferToBase64(team.emblem)}`}
                    alt={`${team.name} Emblem`}
                    className="w-12 h-12 rounded-full"
                  />
                )}
              </td>
              <td>{team.name}</td>
              <td>{team.description}</td>
              <td>{team.admin}</td>
              <td>{team.create_date}</td>
            </tr>
          ))}
          {teams.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center font-black">
                No team
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
