import React from 'react';
import {Link} from "react-router-dom";

const RoundButtonList = ({id, className, tabList, dataId, mainKey}) => {
    const tabListMap = tabList;
    const tabTd = tabListMap.map( (tab, idx) => 
        <Link key={idx} className='linkNoneCss' to={"/shareResource?mainCateNo="+tab[dataId]}>
            <span id={id+"-"+tab[dataId]} className={className} data-uniq-id={tab[dataId]}  onClick={()=>{}}>{tab[mainKey]}</span>
        </Link>
    );

    return (
        <div>{tabTd}</div>
    );

}

export default RoundButtonList;