import React, { useLayoutEffect } from "react";
import TeamSettingDropdown from "./TeamSettingDropdown";
import Message from "../../components/Message";

type Props = {
  teamName: string;
};

type Message = {
  type: "error" | "success";
  text: string;
};

type Member = {
  name: string;
  role: string;
};

const TeamMembersTable = (props: Props) => {
  const { teamName } = props;
  const [members, setMembers] = React.useState<Member[]>([]);
  const [message, setMessage] = React.useState<Message | null>(null);

  useLayoutEffect(() => {
    getMembers(teamName);
  }, []);

  const getMembers = async (teamName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        teamName: teamName,
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/member?` + params,
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
      setMembers(data.data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Failed to get team members",
      });
    }
  };

  return (
    <div className="md:overflow-x-visible overflow-x-scroll">
      <div className="max-w-xs ml-2 mt-1">
        {message && <Message type={message.type} text={message.text} />}
      </div>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.name}>
              <td>{member.name}</td>
              <td>{member.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersTable;
