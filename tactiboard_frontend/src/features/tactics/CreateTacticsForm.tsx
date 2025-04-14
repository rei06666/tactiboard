import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLayoutEffect } from "react";
import Message from "../../components/Message";

type Props = {};

type FormValues = {
  name: string;
  description: string;
  team: string;
};

type Message = {
  type: "error" | "success";
  message: string;
};

interface Team {
  name: string;
  description: string;
  admin: string;
  create_date: string;
  emblem: { type: string; data: number[] };
}

const CreateTacticsForm = (props: Props) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [team, setTeam] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>(""); // 選択されたチームを管理
  const userName = localStorage.getItem("TactiBoardUserName") as string;

  useLayoutEffect(() => {
    getTeam(userName);
  }, [userName]);

  const getTeam = async (userName: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        username: userName,
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/team?` + params,
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
      setTeam(data.data);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        message: "Failed to get team",
      });
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const createTactics = async (data: FormValues): Promise<void> => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        admin: userName,
        team: selectedTeam,
      };
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/tactics/`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }
      setMessage({
        type: "success",
        message: "Tactics created successfully",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        message: "Failed to create tactics",
      });
    }
  };

  const onSubmit = handleSubmit(async (data: FormValues) => {
    setMessage(null);
    await createTactics(data);
    reset();
  });

  return (
    <div>
      <div className="max-w-xs ml-2">
        {message && (
          <Message
            type={message.type}
            text={message.message}
          />
        )}
      </div>
      <form onSubmit={onSubmit} className="p-2">
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend"></legend>
          <div className="flex flex-col gap-4">
            <div>
              <label className="fieldset-label block mb-1 font-bold text-base-content">
                Tactics Name
              </label>
              <input
                {...register("name", { required: "Please enter name" })}
                className="input w-full"
                type="name"
                name="name"
                placeholder="Tactics Name"
              />
              {errors.name && (
                <div className="px-2 text-base font-outfit py-0.5 text-error">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div>
              <label className="fieldset-label block mb-1 font-bold text-base-content">
                Description
              </label>
              <input
                {...register("description", {
                  required: "Please enter description",
                })}
                className="input w-full"
                type="description"
                name="description"
                placeholder="Description"
              />
              {errors.description && (
                <div className="px-2 text-base font-outfit py-0.5 text-error">
                  {errors.description.message}
                </div>
              )}
            </div>
            <div>
              <label className="fieldset-label block mb-1 font-bold text-base-content">
                Team
              </label>
              <select
                className="select w-full"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)} // 選択されたチームを更新
              >
                <option value="" disabled>
                  Select a team
                </option>
                {team.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="rounded-lg w-auto text-xl font-bold mt-2 bg-primary hover:bg-opacity-80  p-2 font-outfit text-primary-content"
                type="submit"
              >
                Create
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateTacticsForm;