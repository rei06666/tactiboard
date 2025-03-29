import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

const MovePageDropdown = (props: Props) => {

    const navigate = useNavigate()

    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                <li onClick={() => {navigate("/dashboard")}}><a>Dashboard</a></li>
                <li onClick={() => {navigate("/team")}}><a>Team</a></li>
                <li onClick={() => {navigate("/tactics")}}><a>Tactics</a></li>
            </ul>
        </div>
    )
}

export default MovePageDropdown