import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import tactiboardIcon from '../../img/tactiboard.png'

import MovePageDropdown from './MovePageDropdown'
import ActivityDropdown from './ActivityDropdown'
import UserDropdown from './UserDropdown'


type Props = {
    userName: string | null
}

const NavBar: React.FC<Props> = (props) => {
    const { userName } = props

    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <MovePageDropdown />
          <img src={tactiboardIcon} className="h-12 w-12" alt="tactiboard icon"/>
          <a className="text-2xl font-monoton">Tactiboard</a>
        </div>
        <div className="navbar-end">
            <ActivityDropdown />
            <UserDropdown />
        </div>
      </div>
    )
}

export default NavBar