import React from 'react'
import { useNavigate } from 'react-router-dom'
import userIcon from '../../img/user.png'

type Props = {}

const UserDropdown = (props: Props) => {
    const navigate = useNavigate()

    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('TactiBoardUserName');
        navigate('/')
    }
    return (
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
    )
}

export default UserDropdown