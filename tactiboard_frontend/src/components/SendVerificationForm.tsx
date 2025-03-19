import React from 'react'
import { set, useForm } from 'react-hook-form'

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string; }>>,
    setFormName: React.Dispatch<React.SetStateAction<string>>,
    setUserName: React.Dispatch<React.SetStateAction<string>>
}

type FormValues = {
    name: string
}

const SendVerificationForm: React.FC<Props> = (props) => {
  const { setMessage, setFormName, setUserName } = props

  const {
      register,
      handleSubmit,
      formState: { errors }
  } = useForm<FormValues>({mode: "onChange"})

  // 確認コードを送信
  const sendVerification = async (data: FormValues) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/user/verifycode`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name: data.name
          }),
      });

      if (!response.ok) {
          throw new Error();
      }

      setMessage({ type: "success", text: "sent verification to email" });
      setUserName(data.name)
      setFormName("passwordchange")

    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "failed to send verification" });
    }
  }


  return (
      <div className="animate-fadeIn container mx-auto w-2/3 rounded-sm shadow-md bg-base-200">
            <form
            onSubmit={handleSubmit(sendVerification)}
            className="p-2"
            >
            <div className="mt-2 flex w-full flex-col">
                <label className="text-lg font-outfit text-base-content">
                Name
                </label>
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
            <div className="flex px-10">
              <button
                  className="text-lg w-full mt-8 px-2 py-0.5 font-outfit text-base-content hover:text-stone-700" onClick={() => {
                    setMessage({ type: "", text: "" });
                    setFormName("login")
                  }}
                  type="submit"
              >
                  Cancel
              </button>
              <button
                  className="text-lg w-full rounded-lg mt-8 bg-neutral hover:bg-stone-700 px-2 py-0.5 font-outfit text-neutral-content"
                  type="submit"
              >
                  verify
              </button>
            </div>
            </form>
        </div>
  )
}

export default SendVerificationForm