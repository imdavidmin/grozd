export const get = {
    async dashboardData(set: React.Dispatch<any>, setError: (s: string) => void) {
        const r = await fetch(`${ENDPOINT_ROOT}/data/dashboard`)
        if (r.ok && r.headers.get('content-type')?.includes('application/json')) {
            set(await r.json()) 
        } else {
            setError(`Status ${r.status}: ${await r.text()}`)
        }
    }
}

const ENDPOINT_ROOT = `https://grozd-1-p3631895.deta.app/api`