import React from 'react';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

const UnitSelBox = ({value, myId, childId, isUnitBubbleEv, parentMethod}) => {
    const unitList = value;
    const subjectItem = unitList.map( (unit, idx) => 
        <option key={idx} data-uniq-no={unit.unitUniqNo} data-parent-value={unit.parentVal} >{unit.mainVal}</option>
    );

    return (
        <div>
            <select id={myId} onChange={(event) => {reg_unitTypeChange(event, childId, isUnitBubbleEv);parentMethod()}}>{subjectItem}</select>
        </div>
    );

}

export default UnitSelBox;