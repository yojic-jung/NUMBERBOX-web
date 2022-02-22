import React from 'react';
import {MathJaxContext, MathJax} from "better-react-mathjax";

const config = {
	tex2jax: {
	  inlineMath: [['$','$'], ['\\(','\\)'], ['$$', '$$']],
	},
};

const TypeSelBox = ({value, myId}) => {
    const typeList = value;
    const quesTypeItem = typeList.map( (quesType, idx) => 
        <option key={idx} data-parent-value={quesType.mathTypeDomain.unitUniqNo} data-type-no={quesType.mathTypeDomain.typeNo} >{quesType.quesType}</option>
    );
    return (
        <div className='hide'>
            <MathJaxContext config={config} version={2} >
                <MathJax>
                    <select id={myId} >
                        <option>--선택--</option>
                        {quesTypeItem}
                    </select>
                </MathJax> 
            </MathJaxContext>
        </div>
    );
}

export default TypeSelBox;