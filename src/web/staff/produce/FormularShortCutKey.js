import {React, useEffect, useState} from "react";
import "css/staff/staff.css";
import {MathJaxContext, MathJax} from "better-react-mathjax";

const config = {
	tex2jax: {
	  inlineMath: [['$','$'], ['\\(','\\)'], ['$$', '$$']],

	},
};


const FormularShortCutKey  = () => {
    const [shortCutKey, setShortCutKey] = useState(new Array());

    useEffect(() => {
        fetch('/takeShortCutKey')
        .then(response => response.text() )
        .then(data => { 
            var jsonObj = JSON.parse(data);
            const shortCutKeyList = jsonObj["shortCutKey"].map( (keyLabel, idx) => {
                if(keyLabel.shortcutKey == "=" || keyLabel.shortcutKey == "]" || keyLabel.shortcutKey == "\"\"" ){
                    return <>
                    <sup className="supShortCut">{keyLabel.shortcutKey}</sup>
                            <span className="shortCutKey" key={idx} id={keyLabel.shortcutKey} >
                                
                                <MathJaxContext config={config} version={2} >
                                    <MathJax dynamic inline >${keyLabel.formulUi}$</MathJax> 
                                </MathJaxContext>
                            </span>
                            <br/>
                            </>;
                }else{
                   return <>
                   <sup className="supShortCut">{keyLabel.shortcutKey}</sup>
                   <span className="shortCutKey" key={idx} id={keyLabel.shortcutKey} >
                            
                            <MathJaxContext config={config} version={2} >
                                <MathJax dynamic inline >${keyLabel.formulUi}$</MathJax> 
                            </MathJaxContext>
                        </span>
                        </>;
                }
                
                }
    );
    setShortCutKey(shortCutKeyList);
        });
      },[]);

      
    
    return <div className="shortKeyBoard">{shortCutKey}</div>
}

export default FormularShortCutKey;