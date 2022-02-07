import {React, useEffect, useState} from "react";
import "css/staff/staff.css";
import {MathJaxContext, MathJax} from "better-react-mathjax";

const config = {
	tex2jax: {
	  inlineMath: [['$','$'], ['\\(','\\)'], ['$$', '$$']],

	},
};


const FormularShortCutKey  = ({getShortCutKeyList}) => {
    const [shortCutKey, setShortCutKey] = useState(new Array());

    useEffect(() => {
        fetch('/takeShortCutKey')
        .then(response => response.text() )
        .then(data => { 
            let jsonObj = JSON.parse(data);
            getShortCutKeyList(jsonObj["shortCutKey"]);
            const shortCutKeyList = jsonObj["shortCutKey"].map( (keyLabel, idx) => {
                let brtagVal = null;
                if(keyLabel.lineChange == 1  ) brtagVal = <br/>
                return <span key={idx}>
                        <div className="keySpan"  title={keyLabel.formulName}>
                            <sup className="supShortCut" >{keyLabel.shortcutKey}</sup>
                            <span className="shortCutKey" id={keyLabel.shortcutKey} >
                                <MathJaxContext config={config}  version={2} >
                                    <MathJax dynamic inline  >${keyLabel.formulUi}$</MathJax> 
                                </MathJaxContext>
                            </span>
                        </div>
                        {brtagVal}
                        </span>
                }
    );
    setShortCutKey(shortCutKeyList);
        });
      },[]);

    return <div className="shortKeyBoard">{shortCutKey}</div>
}

export default FormularShortCutKey;