import React from "react";
import NavBar from "../features/nav/NavBar";
import Message from "../components/Message";

import AddTacticsButton from "../features/tactics/AddTacticsButton";
import TacticsTable from "../features/tactics/TacticsTable";

import { Action } from "../features/tactics/TacticsTable";

export type State = {
  Loading: boolean;
  Error: string | null;
  tacticsNumber: number;
};

const initialState: State = {
  Loading: true,
  Error: null,
  tacticsNumber: 0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "error":
      return {
        ...state,
        Loading: false,
        Error: action.message,
      };
    case "success":
      return {
        ...state,
        Loading: false,
        Error: null,
      };
    default:
      return state;
  }
};

const Tactics: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const userName = localStorage.getItem("TactiBoardUserName") as string;
  return (
    <div className="min-h-screen bg-base-100">
      <NavBar userName={userName} />
      <div className="animate-fadeIn">
        <div className="mt-5 ml-5">
          <div className="flex mb-0 items-end">
            <div className="font-outfit font-bold text-2xl md:text-3xl p-2 pb-0">
              Your Tactics
            </div>
            <AddTacticsButton />
          </div>
          {state.Error && (
            <div className="ml-2 mt-2 inline-block">
              <Message type="error" text={state.Error} />
            </div>
          )}
          {state.Loading && (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-bars loading-xl"></span>
            </div>
          )}
          <div className={state.Loading ? "hidden" : ""}>
            <TacticsTable userName={userName} dispatch={dispatch} isTacticsPage={true}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tactics;
