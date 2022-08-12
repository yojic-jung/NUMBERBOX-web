import React from 'react';



const TabTable = ({className, tabList, clickEv}) => {
    const tabListMap = tabList;
    const tabTd = tabListMap.map( (tab, idx) => 
        <td key={idx} id={tab.id} checked={tab.checked} className={tab.className} onClick={(event)=>clickEv(event)}>{tab.tabName}</td>
    );

    return (
        <>
        <table className={className}>
            <tbody>
                <tr>
                    {tabTd}
                    <td id="tabTableDesc" className='tabTableDesc hide'>로그인 이후 사용해주시기 바랍니다.</td>
                </tr>
            </tbody>
        </table>
        </>
        
    );

}

export default TabTable;