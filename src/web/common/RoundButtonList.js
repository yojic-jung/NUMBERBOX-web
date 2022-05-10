import React from 'react';

const RoundButtonList = ({id, className, tabList, dataId, mainKey, clickEv}) => {
    const tabListMap = tabList;
    const tabTd = tabListMap.map( (tab, idx) => 
        <span key={idx} id={id+"-"+tab[dataId]} className={className} data-uniq-id={tab[dataId]}  onClick={(event)=>clickEv(event)}>{tab[mainKey]}</span>
    );

    return (
        <div>{tabTd}</div>
    );

}

export default RoundButtonList;