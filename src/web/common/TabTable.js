import React from 'react';



const TabTable = ({className, tabList, clickEv}) => {
    const tabListMap = tabList;
    const tabTd = tabListMap.map( (tab, idx) => 
        <td key={idx} id={tab.id} checked={tab.checked} className={tab.className} onClick={clickEv}>{tab.tabName}</td>
    );

    return (
        <table className={className}>
            <thead>
                <tr>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {tabTd}
                </tr>
            </tbody>
        </table>
    );

}

export default TabTable;