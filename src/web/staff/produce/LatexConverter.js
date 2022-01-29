import {React, useState} from "react";
import {MathJaxContext, MathJax} from "better-react-mathjax";

const config = {
	tex2jax: {
	  inlineMath: [['$','$'], ['\\(','\\)'], ['$$', '$$']],

	},
};


const LatexConverter = () => {
	const [latexText, setLatexText] = useState("");

	function latexConvert(e) {
		var latexValue = document.getElementById("questionAnswer").value.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;").trim();
		setLatexText(latexValue)
	  }

  return (
    <>
      <div className="left">
	  	<form method="post">
			<div className="left-title">문제</div>
			<textarea name="questionAnswer" id="questionAnswer" className="questionAnswer" placeholder="문제를 입력해주세요..." rows="10" onKeyUp={latexConvert}></textarea>
			<br />
			<div className="choice">
				<input type="radio" id="huey" name="drone" value="huey" defaultChecked />
				<label htmlFor="huey">객관식</label>
				<input type="radio" id="dewey" name="drone" value="dewey" />
				<label htmlFor="dewey">주관식</label>
			</div>
		</form>
      </div>
      <div className="right">
        <div className="right-title">LateX 변환화면</div>
		<div className="latex-show" id="latex-show">
			<MathJaxContext config={config} version={2} >
				<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:latexText}}></MathJax> 
			</MathJaxContext>
		</div>
      </div>
    </>
  );
};

export default LatexConverter;
