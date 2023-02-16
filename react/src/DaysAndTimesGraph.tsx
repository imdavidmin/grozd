import * as  React from 'react'

type DaysAndTimesGraphProps = {
    data: Array<Array<number>>
    gradient: [string, string]
}

function convertToHexSet(s: string): [number, number, number] {

    return s
        ? [
            Number.parseInt(`${s[0]}${s[1]}`, 16),
            Number.parseInt(`${s[2]}${s[3]}`, 16),
            Number.parseInt(`${s[4]}${s[5]}`, 16)
        ]
        : null
}

export function DaysAndTimesGraph(props) {
    const [largest, smallest] = getScale(props.data)
    const [g1, g2] = [convertToHexSet(props.gradient?.[0]) ?? [0, 0, 0], convertToHexSet(props.gradient?.[1]) ?? [255, 255, 255]]

    const days = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const style = {
        gridTemplateColumns: `30px repeat(${props.data[0].length}, 1fr)`,
        "--dot-size": props.dotSize ?? '3px'
    }
    function getColour(v: number) {
        const pct = Math.abs((v - smallest) / (largest - smallest))
        return `#${g1.map((v1, i) => (v1 + Math.floor((g2[i] - v1) * pct)).toString(16).padStart(2, '0')).join('')}`
    }
    return <>
        <ul className="gridChart" style={style}>
            {props.data.map((day, i) => <React.Fragment key={`tod-frag-${i}`}>
                {days[i]}
                {
                    day.map((hr,j) => <li key={`tod-${i}-${j}`} aria-label={hr} style={{ background: getColour(hr) }}></li>)
                }
            </React.Fragment>
            )}
        </ul>
        <legend>
            Low: {smallest} <div style={{ background: getColour(smallest) }}></div> |
            High: {largest} <div style={{ background: getColour(largest) }}></div>


        </legend>
    </>
}

function getScale(d: Array<Array<number>>) {
    if (!Array.isArray(d)) {
        console.error(`Not an array`, d)
        return
    }
    const a = d.flatMap(a => a)
    a.sort((a, b) => a - b)
    return [a[a.length - 1], a[0]]
}
