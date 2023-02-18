import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client';

import { get } from './common';
import './app.css'

import { DashboardCard } from './DashboardCard';
import { DaysAndTimesGraph } from './DaysAndTimesGraph';
import { NowCard } from './NowCard';
import { LoadingScreen } from './LoadingScreen';
import { BasePriceChart } from './BasePriceChart';

function App(props) {
    const [data, setData] = useState<DashboardData>()
    const [chartData, setChartData] = useState()
    const [hasError, setHasError] = useState<string>()

    useEffect(() => {
        get.dashboardData(setData, setHasError)
    }, [])


    return data
        ? <>
            <NowCard data={data.now.base} />
            <DashboardCard title="Hours + Days">
                <DaysAndTimesGraph data={data.avg.base} dotSize={'10px'} gradient={['0c7c1f', 'e3840f']} />
            </DashboardCard>
            <DashboardCard title="Chart" suppressMargin size={[1, 2]}>
                <BasePriceChart data={get.mapToChartArray(chartData || data.base)} />
                <ChartControls dataSetter={setChartData}></ChartControls>
            </DashboardCard>
        </>
        : <LoadingScreen hasError={hasError} />
}
function ChartControls(props) {
    const intervalOptions = ['Tick', '5m', '10m', '30m', '1h', '2h', '3h', '6h', '1d', '1w']
    const [from, to, interval] = [useRef<HTMLInputElement>(), useRef<HTMLInputElement>(), useRef<HTMLSelectElement>()]
    const [showAdvanced, setShowAdvanced]  = useState(false)

    const submitQuery = () => get.submitQuery({
        from: from.current?.value,
        to: to.current?.value || null,
        interval: interval.current?.value || null
    }, props.dataSetter)

    return <div className="ChartPanel">
        <div className="chartControls">
            
            <label>From</label> <input type="datetime-local" ref={from}></input>
            <label>To</label> <input type="datetime-local" ref={to}></input>
            <label>Interval</label> <select ref={interval}>
                {intervalOptions.map(o =>
                    <option value={o} key={o}>
                        {o}
                    </option>
                )}
            </select>
        </div>
        <div>
            <button onClick={submitQuery}>Update</button>
            <button>Reset</button>
        </div>

    </div>
}

type PriceTypeDictionary<T> = {
    base: T,
    standard: T,
    instant: T,
    fast: T
}

type DashboardData = {
    avg: PriceTypeDictionary<Array<Array<number>>>,
    now: PriceTypeDictionary<number>
    base: [Array<number>, Array<number>]
}

createRoot(document.getElementById('root')!).render(<App />)
