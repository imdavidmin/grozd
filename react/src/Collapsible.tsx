import React, { CSSProperties, useState } from 'react';
import { NameType } from 'recharts/types/component/DefaultTooltipContent';

type CollapsibleProps = {
    style: CSSProperties;
    whenCollapsed: JSX.Element;
    whenExpanded: JSX.Element;
    stateController?: [any, React.Dispatch<any>]
}

export function Collapsible(props: CollapsibleProps) {
    const [isCollapsed, setCollapsed] = props.stateController || useState(true);

    return <div className='collapsible' style={props.style}>
        <button
            className='iconButton'
            style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}
            onClick={() => setCollapsed(!isCollapsed)}>
            <img src={`/icons/${isCollapsed ? 'settings' : 'angle-left'}.svg`} />

        </button>
        {isCollapsed ? props.whenCollapsed : props.whenExpanded}
    </div>;
}
