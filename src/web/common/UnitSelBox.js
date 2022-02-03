import React from 'react';
import {unitTypeChange} from 'js/common/common.js';

const UnitSelBox = ({value, childId}) => {
    const unitList = value;
    const subjectItem = unitList.map( (unit, idx) => 
        <option key={idx} data-uniq-no={unit.unitUniqNo} data-parent-value={unit.parentVal} >{unit.mainVal}</option>
    );

    return (
        <div>
            <select id={childId} onChange={unitTypeChange}>{subjectItem}</select>
        </div>
    );

}

export default UnitSelBox;