import {React} from "react";
import "css/staff/staff.css";
import {MathJaxContext, MathJax} from "better-react-mathjax";

const config = {
	tex2jax: {
	  inlineMath: [['$','$'], ['\\(','\\)'], ['$$', '$$']],

	},
};

const keyBoardArr = [{keyUi:'1',latexVal:'$\\times$'}, {keyUi:'2',latexVal:'${□}^{□}$'}];

const FormularShortCutKey  = () => {

    const shortCutKey = keyBoardArr.map( (keyLabel, idx) => 
            
        <span className="shortCutKey" key={idx} id={keyLabel.keyUi} >
            <sup className="supShortCut">{keyLabel.keyUi}</sup>
            <MathJaxContext config={config} version={2} >
				<MathJax dynamic inline >{keyLabel.latexVal}</MathJax> 
			</MathJaxContext>
            {}
            </span>
        
    );
    return <div className="shortKeyBoard">{shortCutKey}</div>
}

export default FormularShortCutKey;