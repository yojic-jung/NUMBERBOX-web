import React from 'react';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

const UnitSelBox = ({value, myId, childId, isUnitBubbleEv, parentMethod, cusChildId}) => {
    const unitList = value;
    const subjectItem = unitList.map( (unit, idx) => 
        <option key={idx} data-uniq-no={unit.unitUniqNo} data-parent-value={unit.parentVal} >{unit.mainVal}</option>
    );

    return (
        <div className="hide">
            <select id={myId} onChange={(event) => {reg_unitTypeChange(event, cusChildId, childId, isUnitBubbleEv);parentMethod(event)}}>{subjectItem}</select>
        </div>
    );

}

export default UnitSelBox;