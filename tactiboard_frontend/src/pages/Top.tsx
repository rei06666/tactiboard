import React from 'react'
import LoginForm from '../components/LoginForm'
import LoginMessage from '../components/LoginMessage'
import SendVerificationForm from '../components/SendVerificationForm'
import { useState } from 'react'

const Top: React.FC = () => {

  const [message, setMessage] = useState<{ type: string; text: string; }>({ type: "", text: "" })
  const [formName, setFormName] = useState<string>("login")

  return (
    <div className="min-h-screen bg-base-100">
        <div className="mx-auto max-w-lg py-[15vh]">
          <div>
              <div className="font-monoton text-center text-5xl p-2">Tactiboard</div>
          </div>
          <LoginMessage type={message.type} text={message.text}/>
           {formName === "login" && <LoginForm setMessage={setMessage} setFormName={setFormName}/>}
           {formName === "forgot" && <SendVerificationForm setMessage={setMessage} setFormName={setFormName}/>}
        </div>
    </div>
    
  )
}

export default Top