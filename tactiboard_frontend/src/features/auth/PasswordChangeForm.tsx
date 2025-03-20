import React from 'react'
import { useForm } from 'react-hook-form'
import { MESSAGES } from '../../consts/consts'

type FormValues = {
    newpassword: string
    verification: string
}

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string; }>>,
    setFormName: React.Dispatch<React.SetStateAction<string>>,
    userName: string
}

const PasswordChangeForm: React.FC<Props> = (props) => {
    const { setMessage, setFormName, userName} = props

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        mode: 'onChange',
    });

    const changePassword = async (data: FormValues) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/user/password/change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    verifyCode: data.verification,
                    newPassword: data.newpassword,
                    name: userName
                }),
            });
    
            if (!response.ok) {
                throw new Error();
            }

            setMessage(MESSAGES.PASSWORD_CHANGE_SUCCESS);
            setFormName("login")

        } catch (error) {
            console.error(error);
            setMessage(MESSAGES.PASSWORD_CHANGE_FAILURE);
            
        }
    }

    const onSubmit = handleSubmit(async (data: FormValues) => {
        await changePassword(data)
        reset()
    })

  return (
    <div className="animate-fadeIn container mx-auto w-2/3 rounded-sm shadow-md bg-base-200">
            <form
            onSubmit={onSubmit}
            className="p-2"
            >
            <div className="mt-2 flex w-full flex-col">
                <label className="text-lg font-outfit text-base-content">
                verification code
                </label>
                <input
                {...register("verification", { required: "Please enter name" })}
                className="rounded-md border bg-base-100 px-2 py-0.5 focus:border-2"
                type="verification"
                name="verification"
                placeholder="value"
                />
                {errors.verification && (
                    <div className="px-2 text-base font-outfit py-0.5 text-error">
                    {errors.verification.message}
                    </div>
                )}
            </div>
            <div className="flex w-full flex-col mt-5">
                <label className="text-lg font-outfit text-base-content">
                New Password
                </label>
                <input
                {...register("newpassword", { 
                    required: "Please enter password",
                    minLength: {
                        value: 8,
                        message: "fill in at least 8 characters"
                    },
                    validate: {
                        hasUpperCase: (value: string) => /[A-Z]/.test(value) || "password must contain uppercase letters",
                        hasLowerCase: (value: string) => /[a-z]/.test(value) || "password must contain lowercase letters",
                        hasNumber: (value: string) => /[0-9]/.test(value) || "password must contain numbers",
                        hasSymbol: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "password must contain symbols"
                    }
                })}
                className="rounded-md border bg-base-100 px-2 py-0.5 focus:border-2"
                type="password"
                name="newpassword"
                placeholder="value"
                />
                {errors.newpassword && (
                    <div className="px-2 text-base font-outfit py-0.5 text-error">
                    {errors.newpassword.message}
                    </div>
                )}
            </div>
            <button
                className="w-full rounded-lg mt-8 bg-neutral hover:bg-stone-700 px-2 py-0.5 font-outfit text-neutral-content"
                type="submit"
            >
                Change Password
            </button>
            </form>
        </div>
  )
}

export default PasswordChangeForm