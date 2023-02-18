import React from 'react'

export const get = {
    async dashboardData(set: React.Dispatch<any>, setError: (s: string) => void) {
        const r = await fetch(`${ENDPOINT_ROOT}/data/dashboard`)
        if (r.ok && r.headers.get('content-type')?.includes('application/json')) {
            set(await r.json())
        } else {
            setError(`Status ${r.status}: ${await r.text()}`)
        }
    },
    async submitQuery(form: { from: string, to: string, interval: string }, setter) {
        form.from = form.from ? Number(new Date(form.from)).toString() : null
        form.to = form.to ? Number(new Date(form.to)).toString() : null
        form.interval = translateInterval(form.interval)

        const url = `${ENDPOINT_ROOT}/data/query?${Object.entries(form)
            .map(([k, v]) => !v ? null : encodeURIComponent(k) + '=' + encodeURIComponent(v))
            .filter(v => v != null)
            .join('&')}`
        const r = await fetch(url)
        if (r.ok && r.headers.get('content-type')?.includes('application/json')) {
            const data = await r.json()
            data.length == 2
                ? setter(data)
                : console.error('Unexpected data, check network logs')
        } else {
            console.error(`Error in fetch: status ${r.status}\n${await r.text()}`)
        }
    },
    mapToChartArray(data: [Array<number>, Array<number>]) {
        return data[0].map((x, i) => [x, data[1][i]])
    }
}

const ENDPOINT_ROOT = `https://grozd-1-p3631895.deta.app/api`

function translateInterval(v: string) {
    const intervalOptions = [
        ['Tick', null], ['5m', '5min'], ['10m', '10min'], ['30m', '30min'], ['1h', '1H'],
        ['2h', '2H'], ['3h', '3H'], ['6h', '6H'], ['1d', '1D'], ['1w', '1W']
    ]
    return intervalOptions.find(e => e[0] == v)[1]
}