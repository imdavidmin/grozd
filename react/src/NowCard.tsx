import * as React from 'react';
import { DashboardCard } from './DashboardCard';

export function NowCard(props) {
    const highlightStyle = {
        background: "linear-gradient(45deg, #5d007e, #004080)",
        color: '#fff',
        font: 'bold 3rem serif',
        textAlign: 'center' as const,
        width: "max-content"
    };
    return (
        <DashboardCard title="Now">
            <div style={highlightStyle} className="roundedCard">
                {props.data}
            </div>
        </DashboardCard>
    );
}
