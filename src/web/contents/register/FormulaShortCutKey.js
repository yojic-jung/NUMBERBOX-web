import {React, useEffect, useState} from "react";
import "css/staff/staff.css";
import "css/common/msbFormula.css";

const FormulaShortCutKey  = (parentShortCutKey) => {
    const [shortCutKey, setShortCutKey] = useState(new Array());
    const jsonObj = parentShortCutKey["parentShortCutKey"]["shortCutKey"];
        //getShortCutKeyList(jsonObj["shortCutKey"]);
        const shortCutKeyList = jsonObj.map( (keyLabel, idx) => {
            let brtagVal = null;
            if(keyLabel.lineChange == 1  ) brtagVal = <br/>
            return <span key={idx}>
                    <div className="keySpan"  title={keyLabel.formulName}>
                        <sup className="supShortCut" >{keyLabel.shortcutKey}</sup>
                        <span className="shortCutKey" id={keyLabel.shortcutKey} >
                                <span dangerouslySetInnerHTML={{ __html:keyLabel.formulUi}} />
                        </span>
                    </div>
                    {brtagVal}
                    </span>
        });
    useEffect(()=>{
        setShortCutKey(shortCutKeyList);
    },[]);
    
    

    return <div className="shortKeyBoard">{shortCutKey}</div>
}

export default FormulaShortCutKey;


