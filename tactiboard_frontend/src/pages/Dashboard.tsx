import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

const userName = localStorage.getItem('TactiBoardUserName')

const Dashboard: React.FC = () => {

  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-base-100'>
       {/* <NavBar userName={userName}/> */}
    </div>
  )
}

export default Dashboard