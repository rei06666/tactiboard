import React from "react";

type Props = {
  setFormName: React.Dispatch<React.SetStateAction<string>>;
};

const SignUpButton: React.FC<Props> = (props) => {
  const { setFormName } = props;

  return (
    <div className="animate-fadeIn mx-auto w-2/3 text-center mt-4 text-base-content">
      <button
        className="font-outfit underline text-lg font-black"
        onClick={() => {
          setFormName("signup");
        }}
      >
        SignUp
      </button>
    </div>
  );
};

export default SignUpButton;
