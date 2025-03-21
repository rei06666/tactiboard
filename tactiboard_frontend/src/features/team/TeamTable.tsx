import React, { useLayoutEffect } from "react";

type Props = {
  userName: string;
  dispatch: React.Dispatch<Action>;
};

type Team = {
  name: string;
  admin: string;
  description: string;
};

export type Action =
  | { datatype: string; type: "error"; message: string }
  | { datatype: string; type: "success" };

const TeamTable = (props: Props) => {
  const { userName, dispatch } = props;
  const [team, setTeam] = React.useState<Team[]>([]);

  useLayoutEffect(() => {
    getTeam(userName);
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getTeam = async (userName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        username: userName,
      });

      // dispatch({ datatype: 'team', type: 'success' })

      // Uncomment and use actual API response
      // const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/team?` + params, {
      //     method: 'GET',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     }
      // });

      // if (!response.ok) {
      //     throw new Error();
      // }

      // const responseJson = await response.json()
      // setTeam(responseJson)

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

  return (
    <div className="overflow-x-auto mt-5">
      <table className="table w-[90%] mx-auto ml-5">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Administrator</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {team.length > 0 ? (
            team.map((teamItem, index) => (
              <tr key={index}>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle rounded-full w-12">
                      <img
                        src="https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqG1HCspbL7sWokfZotm1uDBd81-Wb6xyJ6-nR6EPFga2PuiwG7KW-XKawZC5bAvHfd2umYnXFqf7ekqbENVDjLvDbfVvz7l84cW52m6yNhvLLF45fd8w1bmGD16JeST4km6PCyhegI00RTxCVaIG3YQ7-JsblGWJpaoPN5QlLwcxrd2U4cUFUkl97nzUO160yuj_QUXRm-jGOLxdB2E2Xpqq4pRs1JbdevxbCv73Qleim5MyaQZVQkd76tu5jol9OqStwnIMutuHh95W7CchEsdkuWYaJL7rE4LL8M6ivsxQy/Manchester_United_F.C.-Logo.wine.png"
                        alt="Team Logo"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-bold">{teamItem.name}</div>
                </td>
                <td>
                  <div className="font-bold">{teamItem.admin}</div>
                </td>
                <td>
                  <div className="font-bold">{teamItem.description}</div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center font-bold">
                No Team
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
