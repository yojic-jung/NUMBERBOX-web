import React, { useState, useEffect } from 'react';
import TopMenuBar from 'web/common/TopMenuBar';
import Geogebra from 'react-geogebra';
import "css/main/main.css";
import "css/page/etcPage.css";
import "css/contentsFile/contentsFile.css";

const GraphMake = ()=>{
    const [rendered, setRendered] = useState(false);	// 사용자 입력 문제
    let api;
    const geoGebraCustomInit = ()=> {
        api = window.ggbApplet;
        api.showMenuBar(false);
        api.showToolBar(false);
        api.setGridVisible(1, false);
        api.setAxisLabels(1, "x","y","z");
        document.getElementsByClassName("avDummyLabel")[0].innerText="함수식 입력(+버튼으로 텍스트 변경가능)";
        document.getElementsByClassName("toggleStyleBar")[1].click();
        document.getElementsByClassName("gwt-ToggleButton-down")[0].classList.add("force-hide");
        document.getElementsByClassName("MyCanvasButton")[0].classList.add("force-hide");
        document.getElementsByClassName("MyCanvasButton")[1].classList.add("force-hide");
        document.getElementsByClassName("MyCanvasButton")[2].classList.add("force-hide");
        document.getElementsByClassName("MyCanvasButton")[12].classList.add("force-hide");
        document.getElementsByClassName("TitleBarClassic ")[0].classList.add("force-hide");
        //document.getElementsByClassName("zoomPanel")[0].classList.add("force-hide");
    } 

    let innerHeight;
    useEffect((event) => {
        let topHeight = document.getElementsByClassName("top-div")[0].height;
        innerHeight=window.innerHeight-topHeight;
        setRendered(true);
        window.addEventListener("click", closeAxesOptionTap);
        window.addEventListener("keyup", escMethod);
        return () => removeAddedEvent();
    }, []);

    const closeAxesOptionTap = (event)=>{
        let targetId = event.target.id;
        let axesTap = document.getElementById("ggb-cus-axesOption");
        let gridTap = document.getElementById("ggb-cus-gridOption");
        if(targetId !== "ggb-cus-axes" && !axesTap.classList.contains("hide")){
            document.getElementById("ggb-cus-axesOption").classList.add("hide");
        }
        if(targetId !== "ggb-cus-grid" && !gridTap.classList.contains("hide")){
            document.getElementById("ggb-cus-gridOption").classList.add("hide");
        }

        //툴바 커스터마이징 오류 해결, geogbra자체적으로 툴바 모드 바뀔 경우 오류 해결
        let toolBarmode = window.ggbApplet.getMode();
        let nbCusActive = document.getElementsByClassName("nbCusActive");
        if(toolBarmode === 1){
            if(!document.getElementById("ggb-cus-dot").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-dot").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>원하는 위치의 좌표에 클릭하세요.</span>";
            }
        }else if(toolBarmode === 2){
            if(!document.getElementById("ggb-cus-line").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-line").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>직선을 지나는 두 점의 좌표에 클릭하세요.</span>";
            }
        }else if(toolBarmode === 15){
            if(!document.getElementById("ggb-cus-lineSegment").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-lineSegment").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>시작점과 끝점의 좌표에 클릭하세요.</span>";
            }
        }else if(toolBarmode === 18){
            if(!document.getElementById("ggb-cus-halfLine").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-halfLine").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>반직선을 지나는 두 점의 좌표에 클릭하세요.</span>";
            }
        }else if(toolBarmode === 28){
            if(!document.getElementById("ggb-cus-labelErase").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-labelErase").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>도형 및 그래프를 클릭하여 <span class='descImg'><span>레이블을 제거하세요.</span>";
            }
        }else{
            if(nbCusActive.length !== 0){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-desc").innerText = "마우스 우클릭을 사용하면 속성을 다양하게 변경할 수 있습니다.";
            }
        }
    }

    const escMethod = (event)=>{
        let userKeycode= event.keyCode;
        if(userKeycode === 27){
            window.ggbApplet.setCustomToolBar("0");
            document.getElementById("ggb-cus-desc").innerText = "마우스 우클릭을 사용하면 속성을 다양하게 변경할 수 있습니다.";
            let nbCusActive = document.getElementsByClassName("nbCusActive");
            for(let i=0; i<nbCusActive.length; i++){
                nbCusActive[i].classList.remove("nbCusActive");
            }
            
        }
        
    }

    const ggbCustomAxesSetting = () => {
        let axesOption = document.getElementById("ggb-cus-axesOption");
        if(axesOption.classList.contains("hide")){
            axesOption.classList.remove("hide");
        }else{
            axesOption.classList.add("hide");
        }
    }

    const ggbCustomGridSetting = () => {
        let axesOption = document.getElementById("ggb-cus-gridOption");
        if(axesOption.classList.contains("hide")){
            axesOption.classList.remove("hide");
        }else{
            axesOption.classList.add("hide");
        }
    }

    const cusAxesPopOpen = (tagetId) => {
        document.getElementById("cusAxesPop").classList.remove("hide");
        document.getElementById("preventPanel").classList.remove("hide");
        document.getElementById(tagetId).classList.remove("hide");
    }

    const cusAxesPopOkBtn = (tagetId) => {
        if(tagetId === "customAxesHideShow"){
            let xAxesShow = document.getElementById("xAxesShow").checked;
            let xAxesHide = document.getElementById("xAxesHide").checked;
            if(!xAxesShow && !xAxesHide){
                alert("x축 숨김 설정을 선택해주세요.");
                return;
            }
            let yAxesShow = document.getElementById("yAxesShow").checked;
            let yAxesHide = document.getElementById("yAxesHide").checked;
            if(!yAxesShow && !yAxesHide){
                alert("y축 숨김 설정을 선택해주세요.");
                return;
            }
	        window.ggbApplet.setAxesVisible(xAxesShow, yAxesShow);
            cusAxesPopClose("customAxesHideSetting")
        }else if(tagetId === "customAxesFormerType"){
            let xAxesFormer = document.getElementById("ggb-cus-xAxesFormer").value;
            let yAxesFormer = document.getElementById("ggb-cus-yAxesFormer").value;
            if(xAxesFormer === "" || yAxesFormer === ""){
                alert("좌표축 눈금자를 선택해주세요.");
                return;
            }
            let gridNumberObj = new Object();
	        gridNumberObj.showNumbers=false;
	        gridNumberObj.axes = {"x":{"tickStyle":parseInt(xAxesFormer)}}		//0 : "눈금 1개더 추가", 1 : "기본", 3 : "눈금없음"
	        window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            gridNumberObj.axes = {"y":{"tickStyle":parseInt(yAxesFormer)}}		//0 : "눈금 1개더 추가", 1 : "기본", 3 : "눈금없음"
            window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            cusAxesPopClose("customAxesDistanceSetting");
        }else if(tagetId === "cusAxesNum"){
            let xAxesNum = document.getElementById("ggb-cus-xAxesDistance").value;
            let yAxesNum = document.getElementById("ggb-cus-yAxesDistance").value;
            if(xAxesNum === "" || yAxesNum === ""){
                alert("좌표축 눈금 숫자를 선택해주세요.");
                return;
            }
            if(xAxesNum === "99"){
                let gridNumberObj = new Object();
                gridNumberObj.showNumbers=false;
                gridNumberObj.axes = {"x":{"showNumbers":false}}
                window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            }else{
                let gridNumberObj = new Object();
                gridNumberObj.showNumbers=false;
                gridNumberObj.axes = {"x":{"showNumbers":true}}
                window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            }

            if(yAxesNum === "99"){
                let gridNumberObj = new Object();
                gridNumberObj.showNumbers=false;
                gridNumberObj.axes = {"y":{"showNumbers":false}}
                window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            }else{
                let gridNumberObj = new Object();
                gridNumberObj.showNumbers=false;
                gridNumberObj.axes = {"y":{"showNumbers":true}}
                window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            }
            window.ggbApplet.setAxisSteps(1, xAxesNum, yAxesNum,"1");
            cusAxesPopClose("cusAxesPopAsist");
        }

    }

    const cusAxesPopClose = (tagetId)=> {
        document.getElementById("cusAxesPop").classList.add("hide");
        document.getElementById("preventPanel").classList.add("hide");
        document.getElementById(tagetId).classList.add("hide");
        document.getElementById("xAxesShow").checked = false;
        document.getElementById("xAxesHide").checked = false;
        document.getElementById("yAxesShow").checked = false;
        document.getElementById("yAxesHide").checked = false;
        document.getElementById("ggb-cus-xAxesFormer").value= ""
        document.getElementById("ggb-cus-yAxesFormer").value= ""
        document.getElementById("ggb-cus-xAxesDistance").value= ""
        document.getElementById("ggb-cus-yAxesDistance").value= ""
    }
    
    const ggbCustomEffect = (event) => {
        let targetId = event.target.id;
        
        if(document.getElementById(targetId).classList !== undefined && document.getElementById(targetId).classList.contains("nbCusActive")){
            document.getElementById(targetId).classList.remove("nbCusActive");
            window.ggbApplet.setCustomToolBar("0");
            document.getElementById("ggb-cus-desc").innerText = "마우스 우클릭을 사용하면 속성을 다양하게 변경할 수 있습니다.";
            return;
        }

        let nbCusActive = document.getElementsByClassName("nbCusActive");
        if(!(targetId === "ggb-cus-undo" || targetId === "ggb-cus-donwload" || targetId === "ggb-cus-goToPoint")){
            for(let i=0; i<nbCusActive.length; i++){
                nbCusActive[i].classList.remove("nbCusActive");
            }
            document.getElementById(targetId).classList.add("nbCusActive");
        }
        
        if(targetId === "ggb-cus-dot"){
            window.ggbApplet.setCustomToolBar("1");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>원하는 위치의 좌표에 클릭하세요.</span>";
        }else if(targetId === "ggb-cus-line"){
            window.ggbApplet.setCustomToolBar("2");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>직선을 지나는 두 점의 좌표에 클릭하세요.</span>";
        }else if(targetId === "ggb-cus-halfLine"){
            window.ggbApplet.setCustomToolBar("18");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>반직선을 지나는 두 점의 좌표에 클릭하세요.</span>";
        }else if(targetId === "ggb-cus-lineSegment"){
            window.ggbApplet.setCustomToolBar("15");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>시작점과 끝점의 좌표에 클릭하세요.</span>";
        }else if(targetId === "ggb-cus-undo"){
            window.ggbApplet.undo();
        }else if(targetId === "ggb-cus-labelErase"){
            window.ggbApplet.setCustomToolBar("28");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>도형 및 그래프를 클릭하여 <span class='descImg'>&nbsp;&nbsp;&nbsp;<span>레이블을 제거하세요.</span>";
        }else if(targetId === "ggb-cus-donwload"){
            window.ggbApplet.writePNGtoFile("myImage.png", 1, false, 72);
        }else if(targetId === "ggb-cus-gridShow"){
            window.ggbApplet.setGridVisible(1, true);
        }else if(targetId === "ggb-cus-gridHide"){
            window.ggbApplet.setGridVisible(1, false);
        }else if(targetId === "ggb-cus-goToPoint"){
            if(document.getElementsByClassName("zoomPanelHomeIn")[0] !== undefined){
                document.getElementsByClassName("zoomPanelHomeIn")[0].click();
            }
            
        }
    }



    const removeAddedEvent = ()=>{
        window.removeEventListener("click",closeAxesOptionTap);
        window.removeEventListener("keyup",escMethod);
    }
return (
    <>    
        <TopMenuBar />
        <div className='ggb-custom-menu'>
            <button id="ggb-cus-dot" className="ggb-cus-btn" type='button' onClick={(event)=>{ggbCustomEffect(event)}}>점</button>
            <button id="ggb-cus-line" className="ggb-cus-btn" type='button' onClick={(event)=>{ggbCustomEffect(event)}}>직선</button>
            <button id="ggb-cus-halfLine" className="ggb-cus-btn" type='button' onClick={(event)=>{ggbCustomEffect(event)}}>반직선</button>
            <button id="ggb-cus-lineSegment" className="ggb-cus-btn" type='button' onClick={(event)=>{ggbCustomEffect(event)}}>선분</button>
            <button id="ggb-cus-labelErase" className="ggb-cus-btn3" type='button' onClick={(event)=>{ggbCustomEffect(event)}}>label</button>
            <span id="ggb-cus-axesWrap">
                <button id="ggb-cus-axes" className="ggb-cus-sel" type='button' onClick={()=>{ggbCustomAxesSetting()}}>좌표축</button>
                <ul id="ggb-cus-axesOption" className='ggb-cus-axesOption hide'>
                    <li><span id="ggb-cus-axesNum" className="ggb-cus-axesOption-btn" onClick={()=>{cusAxesPopOpen("customAxesHideSetting")}}>좌표축 숨김설정</span></li>
                    <li><span id="ggb-cus-axesDistace" className="ggb-cus-axesOption-btn" onClick={()=>{cusAxesPopOpen("customAxesDistanceSetting")}}>좌표축 눈금자 설정</span></li>
                    <li><span id="ggb-cus-asistAxes" className="ggb-cus-axesOption-btn" onClick={()=>{cusAxesPopOpen("cusAxesPopAsist")}}>좌표축 눈금 숫자설정</span></li>
                </ul>
            </span>
            <span id="ggb-cus-axesWrap">
                <button id="ggb-cus-grid" className="ggb-cus-sel" type='button' onClick={()=>{ggbCustomGridSetting()}}>격자</button>
                <div id="ggb-cus-gridOption" className='ggb-cus-gridOption hide'>
                    <span id="ggb-cus-gridHide" className="ggb-cus-gridHide" onClick={(event)=>{ggbCustomEffect(event)}}></span>
                    <span id="ggb-cus-gridShow" className="ggb-cus-gridShow" onClick={(event)=>{ggbCustomEffect(event)}}></span>
                </div>
            </span>
            <span id="ggb-cus-desc" className='ggb-cus-desc'>마우스 우클릭을 사용하면 속성을 다양하게 변경할 수 있습니다.</span>
            <span id="btn2-wrap" className='btn2-wrap'>
                <button id="ggb-cus-goToPoint" className="ggb-cus-btn2 first" type='button' onClick={(event)=>{ggbCustomEffect(event)}}></button>
                <button id="ggb-cus-donwload" className="ggb-cus-btn2" type='button' onClick={(event)=>{ggbCustomEffect(event)}}></button>
                <button id="ggb-cus-undo" className="ggb-cus-btn2 first" type='button' onClick={(event)=>{ggbCustomEffect(event)}}></button>
            </span>
        </div>
        <div className='ggb-wrap'>


        {rendered && <Geogebra id="" appName="classic" width={1200} height={innerHeight} language="Korean"
        showMenuBar={true}  showToolBar={true} showAlgebraInput={true}  showNavigationBar={false} showZoomButtons={true}
        borderColor="#000000" appletOnLoad={geoGebraCustomInit} />}


        </div>
        <div id="preventPanel" className='preventPanel hide'></div>
        <div id="cusAxesPop" className='cusAxesPop hide'>
            <div id="customAxesHideSetting" className='customAxesHideSetting hide'>
                <div className='cusAxesPopTitle'>좌표축 숨김 설정</div>
                <div className='cusAxesPopContents'>
                    <div className='radioWrap'><input name="xAxesHideShow" id="xAxesShow" type="radio" className='hide'/><label htmlFor="xAxesShow" className='radioLabel first'>x축 보이기</label><input name="xAxesHideShow" id="xAxesHide" type="radio" className='hide'/><label htmlFor="xAxesHide" className='radioLabel'>x축 숨기기</label></div>
                    <div className='radioWrap'><input name="yAxesHideShow" id="yAxesShow" type="radio" className='hide'/><label htmlFor="yAxesShow" className='radioLabel first'>y축 보이기</label><input name="yAxesHideShow" id="yAxesHide" type="radio" className='hide'/><label htmlFor="yAxesHide" className='radioLabel'>y축 숨기기</label></div>
                </div>
                <div className='cusAxesPopBtnDiv'>
                    <span className='cusAxesPopBtn cancel' onClick={()=>{cusAxesPopClose("customAxesHideSetting")}}>취소</span><span className='cusAxesPopBtn ok'onClick={()=>{cusAxesPopOkBtn("customAxesHideShow")}}>확인</span>
                </div>
            </div>
            <div id="customAxesDistanceSetting" className='customAxesDistanceSetting hide'>
                <div className='cusAxesPopTitle'>좌표축 눈금자 설정</div>
                <div className='cusAxesPopContents'>
                    <span>x 축</span>
                    <select id="ggb-cus-xAxesFormer" className='ggb-cus-sel3' defaultValue="">
                        <option disabled hidden ></option>
                        <option value="3">눈금없음</option>
                        <option value="1">간격 마다 표시</option>
                        <option value="0">간격 사이 추가</option>
                    </select>
                    <span>y 축</span>
                    <select id="ggb-cus-yAxesFormer" className='ggb-cus-sel3' defaultValue="">
                        <option disabled hidden ></option>
                        <option value="3">눈금없음</option>
                        <option value="1">간격 마다 표시</option>
                        <option value="0">간격 사이 추가</option>
                    </select>
                </div>
                <div className='cusAxesPopBtnDiv'>
                    <span className='cusAxesPopBtn cancel' onClick={()=>{cusAxesPopClose("customAxesDistanceSetting")}}>취소</span><span className='cusAxesPopBtn ok' onClick={()=>{cusAxesPopOkBtn("customAxesFormerType")}}>확인</span>
                </div>
            </div>
            <div id="cusAxesPopAsist" className='cusAxesPopAsist hide'>
                <div className='cusAxesPopTitle'>좌표축 눈금 숫자 설정</div>
                <div className='cusAxesPopContents'>
                    <span>x 축</span>
                    <select id="ggb-cus-xAxesDistance" className='ggb-cus-sel2' defaultValue="" >
                        <option disabled hidden ></option>
                        <option>1</option>
                        <option>&#960;</option>
                        <option>&#960;/2</option>
                        <option value="99">숫자 숨기기</option>
                    </select>
                    <span>y 축</span>
                    <select id="ggb-cus-yAxesDistance" className='ggb-cus-sel2' defaultValue="" >
                        <option disabled hidden ></option>
                        <option>1</option>
                        <option>&#960;</option>
                        <option>&#960;/2</option>
                        <option value="99">숫자 숨기기</option>
                    </select>
                </div>
                <div className='cusAxesPopBtnDiv'>
                    <span className='cusAxesPopBtn cancel' onClick={()=>{cusAxesPopClose("cusAxesPopAsist")}}>취소</span><span className='cusAxesPopBtn ok' onClick={()=>{cusAxesPopOkBtn("cusAxesNum")}}>확인</span>
                </div>
            </div>
        </div>
    </>
    )
}

export default GraphMake;