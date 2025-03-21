import React from "react";

type Props = {
  setFormName: React.Dispatch<React.SetStateAction<string>>;
  setMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
};

const BackToLoginButton: React.FC<Props> = (props) => {
  const { setFormName, setMessage } = props;
  return (
    <div className="animate-fadeIn mx-auto w-2/3 text-center mt-4 text-base-content">
      <button
        className="font-outfit underline text-lg"
        onClick={() => {
          setMessage({ type: "", text: "" });
          setFormName("login");
        }}
      >
        back to login form
      </button>
    </div>
  );
};

export default BackToLoginButton;
