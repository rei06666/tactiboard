import React  from 'react'
import tactiboardIcon from '../img/tactiboard.png'
import userIcon from '../img/user.png'
import { useNavigate } from 'react-router-dom'

type Props = {
    userName: string
}

const NavBar: React.FC<Props> = (props) => {
    const { userName } = props
    const navigate = useNavigate()

    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('TactiBoardUserName');
        navigate('/')
    }

    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><a>Dashboard</a></li>
              <li><a>Team</a></li>
              <li><a>Tactics</a></li>
            </ul>
          </div>
          <img src={tactiboardIcon} className="h-12 w-12" alt="tactiboard icon"/>
          <a className="text-2xl font-monoton">Tactiboard</a>
        </div>
        <div className="navbar-end">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-auto p-2 shadow">
            <li><a>aaaaaaaaaaaaaaaaaaaaaaaaaaaa</a></li>
          </ul>
        </div>
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <img src={userIcon} className="h-5 w-5" alt="user icon"/>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-auto p-2 shadow">
            <li onClick={logout}><a>Logout</a></li>
          </ul>
        </div>
        </div>
      </div>
    )
}

export default NavBar