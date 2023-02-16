import React from 'react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function BasePriceChart(props) {
    const data = props.data.map(([fee, ts]) => { return { 'Base fee': fee, ts: ts, label: Date.parse(ts) } })

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                <Tooltip labelFormatter={ts => (new Date(ts)).toLocaleString()} />
                <XAxis dataKey="ts" scale="time" type="number" domain={['dataMin', 'dataMax']}
                    hide={true} />
                <YAxis />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Base fee" stroke="#FB8833" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

// import React from 'react';
// import { LineChart, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Line } from 'recharts'


// export function BasePriceChart(props) {
//     const a = [[0, 1], [1, 2], [2, 3], [3, 2]]
//     const data = [
//         { label: 'January', sales: 21, leads: 41 },
//         { label: 'February', sales: 35, leads: 79 },
//         { label: 'March', sales: 75, leads: 57 },
//         { label: 'April', sales: 51, leads: 47 },
//         { label: 'May', sales: 41, leads: 63 },
//         { label: 'June', sales: 47, leads: 71 }
//     ];


//     return <>
//         here
//         <LineChart data={data} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
//             <Tooltip />
//             <XAxis dataKey="label" />
//             <YAxis />
//             <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//             <Legend />
//             <Line type="monotone" dataKey="sales" stroke="#FB8833" />
//             <Line type="monotone" dataKey="leads" stroke="#17A8F5" />
//         </LineChart></>

// }
