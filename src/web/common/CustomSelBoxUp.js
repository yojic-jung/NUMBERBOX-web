import React from 'react';
import { nb_fCustomSelDivClk, nb_fCustomSelSpanClk, nb_fCustomOptClk} from 'js/common/common_nb.js';

const CustomSelBoxUp = ({value, cusSelId, originSel, title}) => {
    const optList = value;
    const cusSelUlTitle = cusSelId+"Title";
    const cusSelDiv = cusSelId+"Div";
    const firLiId = cusSelId+"Li000"
    const subjectItem = optList.map( (opt, idx) => {
        let liIdTmp = cusSelId+"Li"+idx;
               return <li id={liIdTmp} key={idx} className="nbOptItem" data-value={opt.originVal}
                        onClick={event=>{ nb_fCustomOptClk(event, cusSelDiv, cusSelUlTitle, originSel)}}>{opt.value}</li>
        }
        
    );

    return (
        <div className="nbWrapSelBox">
            <div id={cusSelDiv} className="nbCustomSel nbCustom4" onClick={event=>nb_fCustomSelDivClk(event)}>
                <span id={cusSelUlTitle} className="nbCustomSelVal" onClick={event=>nb_fCustomSelSpanClk(event)}>{title}</span>
                <ul id={cusSelId} className="nbCustomOptList nbCustomOptList2">
                    <li id={firLiId} key="00" className="nbOptItem" data-value="0" >{title}</li>
                   {subjectItem}
                </ul>
            </div>
        </div>
    );

}

export default CustomSelBoxUp;