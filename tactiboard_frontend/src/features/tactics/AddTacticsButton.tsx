import React from 'react'
import addIcon from '../img/add.png'

type Props = {}

const AddTacticsButton = (props: Props) => {
  return (
    <button className="btn btn-primary border border-primary-content p-1 min-h-0 h-6 ml-2 justify-center items-center">
        <img src={addIcon} className="h-2/3" alt="add icon"/>
        Add tactics
    </button>
  )
}

export default AddTacticsButton