import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../features/nav/NavBar'
import Message from '../components/Message'

import GoToTeamPageButton from '../features/team/GoToTeamPageButton'
import GoToTacticsPageButton from '../features/tactics/GoToTacticsPageButton'
import TeamTable from '../features/team/TeamTable'
import TacticsTable from '../features/tactics/TacticsTable'

import { DashboardAction } from '../types/dashboard'

const userName = localStorage.getItem('TactiBoardUserName') as string 

export type DashboardState = {
  teamLoading : boolean;
  teamError: string | null;
  tacticsLoading: boolean;
  tacticsError: string | null;
}

const initialState: DashboardState = {
  teamLoading: true,
  teamError: null,
  tacticsLoading: true,
  tacticsError: null
}

const reducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'error':
      if (action.datatype === 'team') {
        return {
          ...state,
          teamLoading: false,
          teamError: action.message
        }
      }
      if (action.datatype === 'tactics') {
        return {
          ...state,
          tacticsLoading: false,
          tacticsError: action.message
        }
      }
      break;
    case 'success':
      if (action.datatype === 'team') {
        return {
          ...state,
          teamLoading: false,
          teamError: null
        }
      }
      if (action.datatype === 'tactics') {
        return {
          ...state,
          tacticsLoading: false,
          tacticsError: null
        }
      }
      break;
    default:
      return state
  }
  return state;
}


const Dashboard: React.FC = () => {

  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <div className='min-h-screen bg-base-100'>
       <NavBar userName={userName}/>
       <div className="animate-fadeIn">
          <div className="mt-5 ml-5">
            <div className='flex mb-0 items-end'>
              <div className='font-outfit font-bold text-2xl md:text-3xl p-2 pb-0'>Your Team</div>
              <GoToTeamPageButton/>
            </div>
            {state.teamError && 
            <div className='ml-2 mt-2 inline-block'>
              <Message type='error' text={state.teamError}/>
            </div>}
            {state.teamLoading && (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-bars loading-xl"></span>
              </div>
            )}
            <div className={state.teamLoading ? 'hidden' : ''}>
              <TeamTable userName={userName} dispatch={dispatch}/>
            </div>
          </div>
          <div className="mt-20 ml-5">
            <div className='flex mb-0 items-end'>
              <div className='font-outfit font-bold text-2xl md:text-3xl p-2 pb-0'>Your Tactics</div>
              <GoToTacticsPageButton/>            
            </div>
            {state.tacticsError && 
            <div className='ml-2 mt-2 inline-block'>
              <Message type='error' text={state.tacticsError}/>
            </div>}
            {state.tacticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-bars loading-xl"></span>
              </div>
            ) : (
              <TacticsTable userName={userName} dispatch={dispatch}/>
            )}
          </div>
        </div>
    </div>
  )
}

export default Dashboard