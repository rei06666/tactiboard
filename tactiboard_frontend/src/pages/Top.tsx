import React from 'react'
import LoginForm from '../features/auth/LoginForm'
import SignUpForm from '../features/auth/SignUpForm'
import Message from '../components/Message'
import SendVerificationForm from '../features/auth/SendVerificationForm'
import PasswordChangeForm from '../features/auth/PasswordChangeForm'
import SignUpButton from '../features/auth/SignUpButton'
import BackToLoginButton from '../features/auth/BackToLoginButton'
import { useState } from 'react'
import { APP_NAME } from '../consts/consts';

const Top: React.FC = () => {

  const [message, setMessage] = useState<{ type: string; text: string; }>({ type: "", text: "" })
  const [formName, setFormName] = useState<string>("login")
  const [userName, setUserName] = useState<string>("")

  return (
    <div className="min-h-screen bg-base-100">
        <div className="mx-auto max-w-lg py-[15vh]">
          <div>
              <div className="font-monoton text-center text-5xl p-2">{APP_NAME}</div>
          </div>
          <div className='w-2/3 mx-auto'>
            <Message type={message.type} text={message.text}/>
          </div>
           {formName === "login" && <LoginForm setMessage={setMessage} setFormName={setFormName}/>}
           {formName === "forgot" && <SendVerificationForm setMessage={setMessage} setFormName={setFormName} setUserName={setUserName}/>}
           {formName === "passwordchange" && <PasswordChangeForm setMessage={setMessage} setFormName={setFormName} userName={userName}/>}
           {formName === "signup" && <SignUpForm setMessage={setMessage} setFormName={setFormName}/>}
           {formName === "login" && <SignUpButton setFormName={setFormName}/>}
           {formName !== "login" && <BackToLoginButton setFormName={setFormName} setMessage={setMessage}/>}
        </div>
    </div>
    
  )
}

export default Top