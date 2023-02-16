import React, { useState } from 'react'
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
    const [hasError, setHasError] = useState<string>()

    get.dashboardData(setData, setHasError)

    return data
        ? <>
            <NowCard data={data.now.base} />
            <DashboardCard title="Hours + Days">
                <DaysAndTimesGraph data={data.avg.base} dotSize={'10px'} gradient={['0c7c1f', 'e3840f']} />
            </DashboardCard>
            <DashboardCard title="Chart" suppressMargin>
                <BasePriceChart data={data.base[0].map((x, i) => [x, data.base[1][i]])} />
            </DashboardCard>
        </>
        : <LoadingScreen hasError={hasError} />
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
