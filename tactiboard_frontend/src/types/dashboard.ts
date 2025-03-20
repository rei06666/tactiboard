export type DashboardAction =
| { datatype: string, type: 'error', message: string }
| { datatype: string, type: 'success'} 