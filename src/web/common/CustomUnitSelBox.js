import React from 'react';
import { msb_fCustomSelDivClk, msb_fCustomSelSpanClk, msb_fCustomOptClk} from 'js/common/common_msb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

const CustomUnitSelBox = ({value, cusSelId, originSel, cusChildId, childId, parentMethod, title}) => {
    const optList = value;
    const cusSelUlTitle = cusSelId+"Title";
    const cusSelDiv = cusSelId+"Div";
    const subjectItem = optList.map( (opt, idx) => {
        let liIdTmp = cusSelId+"Li"+idx;
        return <li id={liIdTmp} key={idx} className="msbOptItem" data-value={opt.mainVal}
            onClick={event=>{
                msb_fCustomOptClk(event, cusSelDiv, cusSelUlTitle, originSel);
                let trigEv = new Object();
                let sub    = new Object();
                trigEv.target= sub;
                trigEv.target.id= originSel;
                reg_unitTypeChange(trigEv, cusChildId, childId, true);
                parentMethod();
            }
            }>{opt.mainVal}</li>

        }
    );
    
    return (
        <div className="msbWrapSelBox">
            <div id={cusSelDiv} className="msbCustomSel msbCustom2" data-title={title} onClick={event=>msb_fCustomSelDivClk(event)}>
                <span id={cusSelUlTitle} className="msbCustomSelVal" onClick={event=>msb_fCustomSelSpanClk(event)}>{title}</span>
                <ul id={cusSelId} className="msbCustomOptList">
                   {subjectItem}
                </ul>
            </div>
        </div>
    );

}

export default CustomUnitSelBox;