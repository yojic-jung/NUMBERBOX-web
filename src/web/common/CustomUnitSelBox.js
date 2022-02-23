import React from 'react';
import { nb_fCustomSelDivClk, nb_fCustomSelSpanClk, nb_fCustomOptClk} from 'js/common/common_nb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

const CustomUnitSelBox = ({value, cusSelId, originSel, cusChildId, childId, parentMethod, title}) => {
    const optList = value;
    const cusSelUlTitle = cusSelId+"Title";
    const cusSelDiv = cusSelId+"Div";
    const subjectItem = optList.map( (opt, idx) => {
        let liIdTmp = cusSelId+"Li"+idx;
        return <li id={liIdTmp} key={idx} className="nbOptItem" data-value={opt.mainVal}
            onClick={event=>{
                nb_fCustomOptClk(event, cusSelDiv, cusSelUlTitle, originSel);
                let trigEv = new Object();
                let sub    = new Object();
                trigEv.target= sub;
                trigEv.target.id= originSel;
                reg_unitTypeChange(trigEv, cusChildId, childId, true);
                parentMethod(event);
            }
            }>{opt.mainVal}</li>

        }
    );
    
    return (
        <div className="nbWrapSelBox">
            <div id={cusSelDiv} className="nbCustomSel nbCustom2" data-title={title} onClick={event=>nb_fCustomSelDivClk(event)}>
                <span id={cusSelUlTitle} className="nbCustomSelVal" onClick={event=>nb_fCustomSelSpanClk(event)}>{title}</span>
                <ul id={cusSelId} className="nbCustomOptList">
                   {subjectItem}
                </ul>
            </div>
        </div>
    );

}

export default CustomUnitSelBox;