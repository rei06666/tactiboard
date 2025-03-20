import React from 'react'
import { useForm } from 'react-hook-form'
import { MESSAGES } from '../../consts/consts'


type FormValues = {
    name: string
    password: string
    email: string
}

type Props = {
    setMessage: React.Dispatch<React.SetStateAction<{ type: string; text: string; }>>
    setFormName: React.Dispatch<React.SetStateAction<string>>
}

const SignUpForm: React.FC<Props> = (props) => {
    const { setMessage, setFormName } = props
  
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>({mode: "onChange"})

    const signUp = async (data: FormValues): Promise<void> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    password: data.password,
                    email: data.email
                }),
            });

            if (!response.ok) {
                throw new Error();
            }
            setMessage(MESSAGES.SIGNUP_SUCCESS);
            setFormName("login")

        } catch (error) {
            console.error(error);
            setMessage(MESSAGES.SIGNUP_FAILURE);
        }
    }

    const onSubmit = handleSubmit(async (data: FormValues) => {
        await signUp(data)
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
                Email
                </label>
                <input
                {...register("email", { required: "Please enter email" })}
                className="rounded-md border bg-base-100 px-2 py-0.5 focus:border-2"
                type="email"
                name="email"
                placeholder="value"
                />
                {errors.email && (
                    <div className="px-2 text-base font-outfit py-0.5 text-error">
                    {errors.email.message}
                    </div>
                )}
            </div>
            <div className="mt-5 flex w-full flex-col">
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
            <div className="flex w-full flex-col mt-5">
                <label className="text-lg font-outfit text-base-content">
                Password
                </label>
                <input
                {...register("password", { 
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
                SignUp
            </button>
            </form>
        </div>
    )
}

export default SignUpForm