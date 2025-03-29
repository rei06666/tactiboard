import React from "react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import Message from "../../components/Message";

type Props = {};

type FormValues = {
  name: string;
  description: string;
  emblem: Blob;
};

type Message = {
  type: "error" | "success";
  message: string;
}

const CreateTeamForm = (props: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [emblem, setEmblem] = useState<Blob | null>(null);
  const userName = localStorage.getItem("TactiBoardUserName") as string;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEmblem(file);
    } else {
      setPreview(null);
    }
  };

  const createTeam = async (data: FormValues): Promise<void> => {
    try {
      // FormDataを作成
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("admin", userName);
      if (emblem) {
        formData.append("emblem", emblem); // 画像データを追加
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/team/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const responseJson = await response.json();
      setMessage({
        type: "success",
        message: "Team created successfully",
      });

    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        message: "Failed to create team",
      });
    }
  };

  const onSubmit = handleSubmit(async (data: FormValues) => {
    setMessage(null);
    await createTeam(data);
    reset();
    setPreview(null);
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
                Team Name
              </label>
              <input
                {...register("name", { required: "Please enter name" })}
                className="input w-full"
                type="name"
                name="name"
                placeholder="Team Name"
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
            {/* エンブレム */}
            <div>
              <label className="fieldset-label block mb-1 font-bold text-base-content">
                Emblem
              </label>
              <input
                {...register("emblem", { required: "Please input emblem" })}
                className="file-input file-input-neutral"
                type="file"
                accept="image/*" // 画像ファイルのみ許可
                onChange={handleFileChange} // ファイル変更時の処理
              />
              {errors.emblem && (
                <div className="px-2 text-base font-outfit py-0.5 text-error">
                  {errors.emblem.message}
                </div>
              )}
            </div>
            <div className="avatar mt-4">
              {preview && (
                <div className="mask mask-squircle rounded-full w-24 h-24">
                  <img src={preview} alt="Team Emblem Preview" />
                </div>
              )}
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

export default CreateTeamForm;
