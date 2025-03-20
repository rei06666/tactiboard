import React, { useLayoutEffect } from 'react'
import { DashboardAction } from '../../types/dashboard'

type Props = {
    userName: string
    dispatch: React.ActionDispatch<[action: DashboardAction]>
}

type Tactics = {
    name: string
    team: string
    description: string
    status: string
}

const TacticsTable = (props: Props) => {
    const { userName, dispatch } = props
    const [tactics, setTactics] = React.useState<Tactics[]>([])
    useLayoutEffect(() => {
        getTactics(userName)
    }, [])

    const getTactics = async (userName: string): Promise<void> => {
        try {
            const params = new URLSearchParams({
                username: userName
            });

            // const response = await fetch(`${process.env.REACT_APP_BACKEND_API_PATH}/tactics?` + params, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });

            // if (!response.ok) {
            //     throw new Error();
            // }

            // const responseJson = await response.json()
            // setTactics(responseJson)
            dispatch({datatype: "tactics", type: "success"})
        } catch (error) {
            console.error(error);
            dispatch({datatype: "tactics", type: "error", message: "Failed to get tactics"})
        }
    }


  return (
    <div className="overflow-x-auto mt-5">
        <table className="table w-[90%] mx-auto ml-5">
            <thead>
            <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Description</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td >
                <div className="font-bold">Offence</div>
                </td>
                <td >
                <div className="font-bold">Manchester United</div>
                </td>
                <td>
                <div className="font-bold">Offence tactics</div>
                </td>
                <td>
                <div className="bg-success  inline-block rounded-xl">
                    <div className="pl-2 pr-2">Success</div>
                </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default TacticsTable