import React from 'react';



const TabButton = ({className, tabList, clickEv}) => {
    const tabListMap = tabList;
    const tabTd = tabListMap.map( (tab, idx) => 
        <button type="button" key={idx} id={tab.id} checked={tab.checked} className={tab.className} onClick={(event)=>clickEv(event)}>{tab.tabName}</button>
    );

    return (
        <div className={className}>{tabTd}</div>
    );

}

export default TabButton;