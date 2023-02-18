import React, { CSSProperties, useEffect, useState } from 'react';
import { Collapsible } from './Collapsible';
import { DashboardCard } from './DashboardCard';

export function NowCard(props) {
    const allowedCurrencies = ['usd', 'gbp', 'eur', 'bgn', 'jpy', 'cny', 'aud', 'cad']
    const styles: { [k: string]: CSSProperties } = {
        highlight: {
            background: "linear-gradient(45deg, #5d007e, #004080)",
            color: '#fff',
            font: 'bold 3rem serif',
            textAlign: 'center' as const,
            width: "max-content"
        },
        container: {
            width: '100%',
            display: 'grid',
            justifyItems: 'center',
            position: 'relative'
        },
        controls: {
            display: 'grid',
            alignItems: 'center',
            height: 'calc(22.8px + 1rem)'
        }
    }

    const [cur, setCur] = useState<string>('usd')
    const [conversion, setConversion] = useState(`⏳ Loading data`)
    const collapsedStateControler = useState(true)

    const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        fetchFiat(e.target.value, setCur, setConversion, props.data)
        collapsedStateControler[1](!collapsedStateControler[0])
    }

    useEffect(() => { fetchFiat(cur, setCur, setConversion, props.data) }, [])

    const controls = [
        <div className='fiatLabel'>{conversion}</div>,
        <div className='fiatLabel'>
            <label>Currency</label>
            <select value={cur} onChange={onSelect}>
                {allowedCurrencies.map(n =>
                    <option key={n} value={n}>{n.toUpperCase()}</option>
                )}
            </select>
        </div>
    ]

    return (
        <DashboardCard title="Now" containerStyle={styles.container}>
            <div style={styles.highlight} className="roundedCard">
                {props.data}
            </div>

            <Collapsible
                stateController={collapsedStateControler}
                style={styles.controls}
                whenCollapsed={controls[0]}
                whenExpanded={controls[1]} />
        </DashboardCard >
    );
}


async function fetchFiat(cur: string, setCur: (s: string) => void, setConversion: (s: string) => void, feeInGwei: number) {
    try {
        const GAS_UNITS_FOR_NORMAL_TRANSFER = 21000
        const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${cur}`)

        if (r.ok && r.headers.get('content-type')?.includes('application/json')) {
            const ethInFiat = (await r.json())?.ethereum?.[cur.toLowerCase()]
            const feeInFiat = (feeInGwei * ethInFiat * GAS_UNITS_FOR_NORMAL_TRANSFER) / (10 ** 9)
            setConversion(`${cur.toUpperCase()} ${feeInFiat?.toFixed(4)}`)
            setCur(cur)
        } else {
            throw ''
        }
    } catch (e) {
        console.error(e)
        setConversion('⚠️ Cannot fetch fiat currency data')
    }
}