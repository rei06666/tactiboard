import React from 'react'
import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'
import LoginMessage from '../components/LoginMessage'
import SendVerificationForm from '../components/SendVerificationForm'
import PasswordChangeForm from '../components/PasswordChangeForm'
import { useState, useRef } from 'react'

const Top: React.FC = () => {

  const [message, setMessage] = useState<{ type: string; text: string; }>({ type: "", text: "" })
  const [formName, setFormName] = useState<string>("login")
  const [userName, setUserName] = useState<string>("")

  return (
    <div className="min-h-screen bg-base-100">
        <div className="mx-auto max-w-lg py-[15vh]">
          <div>
              <div className="font-monoton text-center text-5xl p-2">Tactiboard</div>
          </div>
          <LoginMessage type={message.type} text={message.text}/>
           {formName === "login" && <LoginForm setMessage={setMessage} setFormName={setFormName}/>}
           {formName === "forgot" && <SendVerificationForm setMessage={setMessage} setFormName={setFormName} setUserName={setUserName}/>}
           {formName === "passwordchange" && <PasswordChangeForm setMessage={setMessage} setFormName={setFormName} userName={userName}/>}
           {formName === "signup" && <SignUpForm setMessage={setMessage} setFormName={setFormName}/>}
           {formName === "login" && 
           <div className="animate-fadeIn mx-auto w-2/3 text-center mt-4 text-base-content">
            <button className="font-outfit underline text-lg font-black" onClick={() => {setFormName("signup")}}>SignUp</button>
           </div>}
           {formName !== "login" &&
           <div className="animate-fadeIn mx-auto w-2/3 text-center mt-4 text-base-content">
            <button className="font-outfit underline text-lg" onClick={() => {
              setMessage({ type: "", text: "" });
              setFormName("login")
              }}>back to login form</button>
           </div>}
        </div>
    </div>
    
  )
}

export default Top