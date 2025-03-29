import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "../../consts/consts";

type FormValues = {
  name: string;
  password: string;
};

type Props = {
  setMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
  setFormName: React.Dispatch<React.SetStateAction<string>>;
};

const LoginForm: React.FC<Props> = (props) => {
  const { setMessage, setFormName } = props;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const signIn = async (data: FormValues): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_PATH}/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const responseJson = await response.json();
      const accessToken = responseJson.accessToken;
      // accessTokenをローカルストレージに保存
      localStorage.setItem("accessToken", accessToken);
      // ユーザー名をローカルストレージから削除
      localStorage.removeItem("TactiBoardUserName");
      // ユーザー名をローカルストレージに保存
      localStorage.setItem("TactiBoardUserName", data.name);
      console.log(data.name);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage(MESSAGES.LOGIN_FAILURE);
    }
  };

  const forgotPassword = (): void => {
    setMessage({ type: "", text: "" });
    setFormName("forgot");
  };

  const onSubmit = handleSubmit(async (data: FormValues) => {
    await signIn(data);
    reset();
  });

  return (
    <div className="animate-fadeIn container mx-auto w-2/3 rounded-sm shadow-md bg-base-200">
      <form onSubmit={onSubmit} className="p-2">
        <div className="mt-2 flex w-full flex-col">
          <label className="text-lg font-outfit text-base-content">Name</label>
          <input
            {...register("name", { required: "Please enter name" })}
            className="rounded-md border bg-base-100 px-2 py-0.5 focus:border-2"
            type="name"
            name="name"
            placeholder="value"
          />
          {errors.name && (
            <div className="px-2 text-base font-outfit py-0.5 text-error">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col mt-5">
          <label className="text-lg font-outfit text-base-content">
            Password
          </label>
          <input
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 8,
                message: "fill in at least 8 characters",
              },
              validate: {
                hasUpperCase: (value: string) =>
                  /[A-Z]/.test(value) ||
                  "password must contain uppercase letters",
                hasLowerCase: (value: string) =>
                  /[a-z]/.test(value) ||
                  "password must contain lowercase letters",
                hasNumber: (value: string) =>
                  /[0-9]/.test(value) || "password must contain numbers",
                hasSymbol: (value: string) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                  "password must contain symbols",
              },
            })}
            className="rounded-md border bg-base-100 px-2 py-0.5 focus:border-2"
            type="password"
            name="password"
            placeholder="value"
          />
          {errors.password && (
            <div className="px-2 text-base font-outfit py-0.5 text-error">
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          className="w-full rounded-lg mt-8 bg-neutral hover:bg-stone-700 px-2 py-0.5 font-outfit text-neutral-content"
          type="submit"
        >
          Login
        </button>
      </form>
      <button
        className="mt-8 px-2 py-1 text-[10px] font-outfit px-py-0.5 underline text-base"
        onClick={forgotPassword}
      >
        forgot password?
      </button>
    </div>
  );
};

export default LoginForm;
