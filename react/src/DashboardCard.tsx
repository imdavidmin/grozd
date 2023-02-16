import * as React from 'react';

type DashboardCardProps = {
    size?: [number, number],
    title: string,
    colour?: string,
    children?: any,
    style?,
    suppressMargin?: boolean
}
export function DashboardCard(props: DashboardCardProps) {
    const cardStyle = {
        background: props.colour ?? 'var(--default-card-colour)',
        gridArea: `auto / auto / span ${props.size?.[0] ?? 1} / span ${props.size?.[1] ?? 1}`,
        ...props.style
    };
    return <div style={cardStyle} className="dashboardCard">
        <h1>{props.title}</h1>
        <div style={props.suppressMargin ? {} : { margin: 'auto' }}>
            {props.children}
        </div>
    </div>;
}
