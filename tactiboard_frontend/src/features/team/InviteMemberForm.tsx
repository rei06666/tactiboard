import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Message from "../../components/Message";

type Props = {
  teamName: string;
};

type FormValues = {
  name: string;
};

type Message = {
  type: "error" | "success";
  message: string;
}

const InviteMemberForm = (props: Props) => {
  const [message, setMessage] = useState<Message | null>(null);
  const teamName = props.teamName;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });


  const InviteMember = async (data: FormValues): Promise<void> => {
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/member/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: data.name,
            teamName: teamName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const responseJson = await response.json();
      console.log(responseJson);
      setMessage({
        type: "success",
        message: "Invitation sent successfully",
      });

    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        message: "Failed to send invitation",
      });
    }
  };

  const onSubmit = handleSubmit(async (data: FormValues) => {
    setMessage(null);
    await InviteMember(data);
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
                User Name
              </label>
              <input
                {...register("name", { required: "Please enter name" })}
                className="input mt-2 w-1/2"
                type="name"
                name="name"
                placeholder="User Name who you want to invite"
              />
              {errors.name && (
                <div className="px-2 text-base font-outfit py-0.5 text-error">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="rounded-lg w-auto text-xl font-bold mt-2 bg-primary hover:bg-opacity-80  p-2 font-outfit text-primary-content"
                type="submit"
              >
                Invite
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default InviteMemberForm;
