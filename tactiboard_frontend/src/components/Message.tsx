import React from 'react'

type Props = {
    type: string
    text: string
}

const Message: React.FC<Props> = (props) => {
    const { type, text } = props
    return (
        <div >
            {type === "success" && 
            <div role="alert" className="alert alert-success py-0.5 animate-fadeIn flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current mr-2" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{text}</span>
            </div>}
            {type === "error" &&
            <div role="alert" className="alert alert-error py-0.5 animate-fadeIn flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 stroke-current mr-2" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{text}</span>
            </div>}
        </div>
    )
}

export default Message