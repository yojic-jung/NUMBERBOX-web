import React, { useState, useEffect } from 'react';
import TopMenuBar from 'web/common/TopMenuBar';
import ResourceMenuBar from 'web/common/ResourceMenuBar';
import Geogebra from 'react-geogebra';
import "css/main/main.css";
import "css/page/etcPage.css";
import "css/resourceFile/resourceFile.css";

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
        document.getElementsByClassName("zoomPanel")[0].classList.add("force-hide");
    } 

    let innerHeight;
    useEffect((event) => {
        let topHeight = document.getElementsByClassName("top-div")[0].height;
        innerHeight=window.innerHeight-topHeight;
        setRendered(true);
        window.addEventListener("click", closeAxesOptionTap);
        window.addEventListener("keyup", escMethod);
        document.getElementById("resourceTools").classList.add("active")
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
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>원하는 위치의 좌표에 클릭하여 추가할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 2){
            if(!document.getElementById("ggb-cus-line").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-line").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 15){
            if(!document.getElementById("ggb-cus-lineSegment").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-lineSegment").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>시작점과 끝점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 18){
            if(!document.getElementById("ggb-cus-halfLine").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-halfLine").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>반직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 28){
            if(!document.getElementById("ggb-cus-labelErase").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-labelErase").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>도형 및 그래프를 클릭하여 레이블을 제거할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 41){
            if(!document.getElementById("ggb-cus-zoomIn").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-zoomIn").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>좌표평면을 클릭하여 확대할 수 있습니다.</span>";
            }
        }else if(toolBarmode === 42){
            if(!document.getElementById("ggb-cus-zoomOut").classList.contains("nbCusActive")){
                for(let i=0; i<nbCusActive.length; i++){
                    nbCusActive[i].classList.remove("nbCusActive");
                }
                document.getElementById("ggb-cus-zoomOut").classList.add("nbCusActive");
                document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>좌표평면을 클릭하여 축소할 수 있습니다.</span>";
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
        document.getElementById("ggb-cus-xAxesDistance").classList.remove("hide");
        document.getElementById("xAxes-self-val").classList.add("hide");
        document.getElementById("ggb-cus-yAxesDistance").classList.remove("hide");
        document.getElementById("yAxes-self-val").classList.add("hide");
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
	        gridNumberObj.axes = {"x":{"tickStyle":parseInt(xAxesFormer)}}		// 0 : "눈금 1개더 추가", 1 : "기본", 3 : "눈금없음"
	        window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            gridNumberObj.axes = {"y":{"tickStyle":parseInt(yAxesFormer)}}		// 0 : "눈금 1개더 추가", 1 : "기본", 3 : "눈금없음"
            window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
            cusAxesPopClose("customAxesDistanceSetting");
        }else if(tagetId === "cusAxesNum"){
            let xAxesNum;
            let yAxesNum;

            if(document.getElementById("ggb-cus-xAxesDistance").classList.contains("hide")){
                xAxesNum=document.getElementById("xAxes-self-val").value;
            }else{
                xAxesNum=document.getElementById("ggb-cus-xAxesDistance").value;
            }

            if(document.getElementById("ggb-cus-yAxesDistance").classList.contains("hide")){
                yAxesNum=document.getElementById("yAxes-self-val").value;
            }else{
                yAxesNum=document.getElementById("ggb-cus-yAxesDistance").value;
            }

            if(xAxesNum === "" || yAxesNum === ""){
                alert("좌표축 눈금 숫자를 선택해주세요.");
                return;
            }
            if(xAxesNum === "99"){
                let gridNumberObj = new Object();
                gridNumberObj.showNumbers=false;
                gridNumberObj.axes = {"x":{"showNumbers":false}}
                window.ggbApplet.setGraphicsOptions(1, gridNumberObj );
                xAxesNum=1;
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
                yAxesNum=1;
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
        if(!(targetId === "ggb-cus-undo" || targetId === "ggb-cus-download" || targetId === "ggb-cus-goToPoint")){
            for(let i=0; i<nbCusActive.length; i++){
                nbCusActive[i].classList.remove("nbCusActive");
            }
            document.getElementById(targetId).classList.add("nbCusActive");
        }
        
        if(targetId === "ggb-cus-dot"){
            window.ggbApplet.setCustomToolBar("1");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>원하는 위치의 좌표에 클릭하여 추가할 수 있습니다.</span>";
        }else if(targetId === "ggb-cus-line"){
            window.ggbApplet.setCustomToolBar("2");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
        }else if(targetId === "ggb-cus-halfLine"){
            window.ggbApplet.setCustomToolBar("18");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>반직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
        }else if(targetId === "ggb-cus-lineSegment"){
            window.ggbApplet.setCustomToolBar("15");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>시작점과 끝점의 좌표에 클릭하여 추가할 수 있습니다.</span>";
        }else if(targetId === "ggb-cus-undo"){
            window.ggbApplet.undo();
        }else if(targetId === "ggb-cus-labelErase"){
            window.ggbApplet.setCustomToolBar("28");
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>도형 및 그래프를 클릭하여 <span class='descImg'>&nbsp;&nbsp;&nbsp;</span>레이블을 제거할 수 있습니다.</span>";
        }else if(targetId === "ggb-cus-download"){
            window.ggbApplet.writePNGtoFile("myImage.png", 1, false, 72);
        }else if(targetId === "ggb-cus-gridShow"){
            window.ggbApplet.setGridVisible(1, true);
        }else if(targetId === "ggb-cus-gridHide"){
            window.ggbApplet.setGridVisible(1, false);
        }else if(targetId === "ggb-cus-goToPoint"){
            if(document.getElementsByClassName("zoomPanelHomeIn")[0] !== undefined){
                document.getElementsByClassName("zoomPanelHomeIn")[0].click();
            }
        }else if(targetId === "ggb-cus-zoomIn"){
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>좌표평면을 클릭하여 확대할 수 있습니다.</span>";
            window.ggbApplet.setCustomToolBar("41");
        }else if(targetId === "ggb-cus-zoomOut"){
            document.getElementById("ggb-cus-desc").innerHTML = "<span class='redbox'>좌표평면을 클릭하여 축소할 수 있습니다.</span>";
            window.ggbApplet.setCustomToolBar("42");
        }
    }

    const ggbManualTap = (event) =>{
        let targetId = event.target.id;
        document.getElementById("ggb-manual1").classList.remove("active");
        document.getElementById("ggb-manual2").classList.remove("active");
        document.getElementById("ggb-manual3").classList.remove("active");

        document.getElementById("ggbCusBtnGuideWrap").classList.add("hide");
        document.getElementById("ggbCusGraphGuideWrap").classList.add("hide");
        document.getElementById("ggbCusTextGuideWrap").classList.add("hide");

        if(targetId==="ggb-manual1"){
            document.getElementById("ggb-manual1").classList.add("active");
            document.getElementById("ggbCusBtnGuideWrap").classList.remove("hide");
        }else if(targetId==="ggb-manual2"){
            document.getElementById("ggb-manual2").classList.add("active");
            document.getElementById("ggbCusGraphGuideWrap").classList.remove("hide");
        }else{
            document.getElementById("ggb-manual3").classList.add("active");
            document.getElementById("ggbCusTextGuideWrap").classList.remove("hide");
        }
    }

    const cusGuideTap = (event) =>{
        let targetId = event.target.id;
        if(targetId==="ggbShortcutGuideTap"){
            document.getElementById("ggbUseGuideTap").classList.remove("active");
            document.getElementById(targetId).classList.add("active");
            document.getElementById("ggbCusShortcutsDiv").classList.remove("hide");
            document.getElementById("ggbCusUseGuideDiv").classList.add("hide");
        }else{
            document.getElementById("ggbShortcutGuideTap").classList.remove("active");
            document.getElementById(targetId).classList.add("active");
            document.getElementById("ggbCusShortcutsDiv").classList.add("hide");
            document.getElementById("ggbCusUseGuideDiv").classList.remove("hide");
        }
    }

    const axesNumSelfInput = (event, axes) => {
        if(event.target.value === "100"){
            if(axes === "xAxes"){
                document.getElementById("ggb-cus-xAxesDistance").classList.add("hide");
                document.getElementById("xAxes-self-val").classList.remove("hide");
            }else{
                document.getElementById("ggb-cus-yAxesDistance").classList.add("hide");
                document.getElementById("yAxes-self-val").classList.remove("hide");
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
        <ResourceMenuBar/>
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
                <button id="ggb-cus-goToPoint" className="ggb-cus-btn2 first" type='button' onClick={(event)=>{ggbCustomEffect(event)}} title="원점에 초점 맞추기"></button>
                <button id="ggb-cus-zoomIn" className="ggb-cus-btn2" type='button' onClick={(event)=>{ggbCustomEffect(event)}} title="확대"></button>
                <button id="ggb-cus-zoomOut" className="ggb-cus-btn2" type='button' onClick={(event)=>{ggbCustomEffect(event)}} title="축소"></button>
                <button id="ggb-cus-download" className="ggb-cus-btn2" type='button' onClick={(event)=>{ggbCustomEffect(event)}} title="이미지 다운로드"></button>
                <button id="ggb-cus-undo" className="ggb-cus-btn2" type='button' onClick={(event)=>{ggbCustomEffect(event)}} title="되돌리기"></button>
                <button id="ggb-cus-shortcuts" className="ggb-cus-guide" type='button' onClick={()=>{document.getElementById("ggbCustomGuide").classList.remove("hide");document.getElementById("preventPanel").classList.remove("hide");}} title="사용법"></button>
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
                    <select id="ggb-cus-xAxesDistance" className='ggb-cus-sel2' defaultValue="" onChange={(event)=>{axesNumSelfInput(event, "xAxes")}}>
                        <option disabled hidden ></option>
                        <option>1</option>
                        <option>&#960;</option>
                        <option>&#960;/2</option>
                        <option value="100">직접입력</option>
                        <option value="99">숫자 숨기기</option>
                    </select>
                    <input id="xAxes-self-val" type="number" className="ggb-cus-sel2 hide"/>
                    <span>y 축</span>
                    <select id="ggb-cus-yAxesDistance" className='ggb-cus-sel2' defaultValue="" onChange={(event)=>{axesNumSelfInput(event, "yAxes")}}>
                        <option disabled hidden ></option>
                        <option>1</option>
                        <option>&#960;</option>
                        <option>&#960;/2</option>
                        <option value="100">직접입력</option>
                        <option value="99">숫자 숨기기</option>
                    </select>
                    <input id="yAxes-self-val" type="number" className="ggb-cus-sel2 hide"/>
                </div>
                <div className='cusAxesPopBtnDiv'>
                    <span className='cusAxesPopBtn cancel' onClick={()=>{cusAxesPopClose("cusAxesPopAsist")}}>취소</span><span className='cusAxesPopBtn ok' onClick={()=>{cusAxesPopOkBtn("cusAxesNum")}}>확인</span>
                </div>
            </div>
        </div>
        <div id="ggbCustomGuide" className='ggbCustomGuide hide'>
            <div className='ggb-guide-close-btn' onClick={()=>{document.getElementById("ggbCustomGuide").classList.add("hide");document.getElementById("preventPanel").classList.add("hide");}}>x</div>
            <div>
                <span id="ggbShortcutGuideTap" className='ggbUseGuideTap active' onClick={(event)=>{cusGuideTap(event)}}>단축키</span>
                &nbsp;/&nbsp;
                <span id="ggbUseGuideTap" className='ggbUseGuideTap' onClick={(event)=>{cusGuideTap(event)}}>사용법</span></div>
            <div id='ggbCusShortcutsDiv'>
                <ul className='guide-ul'>
                    <li><span className='ggb-shortcuts rightClick'></span><div className='guide-shortcut-desc'>좌표평면 또는 도형을 선택 후 마우스 우클릭시 세부적인 속성을 변경할 수 있습니다.</div></li>
                    <li><span className='ggb-shortcuts esc'></span><div className='guide-shortcut-desc'>도형 그리기 모드에서 esc 버튼을 누르면 기본 모드로 돌아 옵니다.</div></li>
                    <li><span className='ggb-shortcuts shift'></span><span className='ggb-shortcuts plus'></span><span className='ggb-shortcuts mousewheel'></span><div className='guide-shortcut-desc'>shift키를 누른 채 마우스 휠을 위아래로 움직이면 좌표평면을 확대 축소 할 수 있습니다.</div></li>
                    <li><span className='ggb-shortcuts arrow'></span><div className='guide-shortcut-desc'>도형을 선택 후 키보드 상하좌우 화살표를 누르면 도형을 이동시킬 수 있습니다.</div></li>
                    <li><span className='ggb-shortcuts del'></span><span className='comma'>,</span><span className='ggb-shortcuts backspace'></span><div className='guide-shortcut-desc'>도형을 선택 후 delete 또는 backspace 키를 누르면 삭제할 수 있습니다.</div></li>
                    <li>ctrl+a : 전체 선택 | ctrl+z : 되돌리기 | ctrl+y : 다시실행</li>
                </ul>
            </div>
            <div id='ggbCusUseGuideDiv' className='hide'>
                <table className='ggbCusUseGuideTb'>
                    <tbody>
                        <tr>
                            <td id="ggb-manual1" className='active' onClick={(event)=>{ggbManualTap(event)}}>버튼</td>
                            <td id="ggb-manual2" onClick={(event)=>{ggbManualTap(event)}}>그래프그리기</td>
                            <td id="ggb-manual3" onClick={(event)=>{ggbManualTap(event)}}>텍스트추가</td>
                        </tr>
                    </tbody>
                </table>
                <div className='ggbCusUseGuideContents'>
                    <div id="ggbCusBtnGuideWrap" className='ggbCusBtnGuideWrap'>
                        <div className='btnGuideTitle'>도형 버튼</div>
                        <div>
                            <button className="ggb-cus-btn-manual" type='button'>점</button>원하는 위치의 좌표에 클릭하여 추가할 수 있습니다.<br/>
                            <button className="ggb-cus-btn-manual" type='button'>직선</button>직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.<br/>
                            <button className="ggb-cus-btn-manual" type='button'>반직선</button>반직선을 지나는 두 점의 좌표에 클릭하여 추가할 수 있습니다.<br/>
                            <button className="ggb-cus-btn-manual" type='button'>선분</button>시작점과 끝점의 좌표에 클릭하여 추가할 수 있습니다.<br/>
                            <button  className="ggb-cus-btn3-manual" type='button'>label</button>도형 및 그래프를 클릭하여 레이블을 제거할 수 있습니다.<br/>
                            <div className='ggb-cus-semiTitle center'>※ esc 키를 누르면 도형 그리기 모드에서 기본 모드로 전환이 됩니다.</div>
                        </div>
                        <div className='btnGuideTitle2'>보조 버튼</div>
                        <div>
                            <table className='btnGuide-table'>
                                <tbody>
                                    <tr>
                                        <td><button className="ggb-cus-btn2-manual first" type='button'></button></td>
                                        <td><button className="ggb-cus-btn2-manual zoomIn" type='button'></button></td>
                                        <td><button className="ggb-cus-btn2-manual zoomOut" type='button' ></button></td>
                                        <td><button className="ggb-cus-btn2-manual down" type='button'></button></td>
                                        <td><button className="ggb-cus-btn2-manual undo" type='button' ></button></td>
                                    </tr>
                                    <tr>
                                        <td>원점에 초점</td>
                                        <td>확대</td>
                                        <td>축소</td>
                                        <td>이미지 다운</td>
                                        <td>되돌리기</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                    </div>

                    <div id="ggbCusGraphGuideWrap" className='ggbCusGraphGuideWrap hide'>
                        <div className='ggbCusUseGuideDesc first'>
                            왼쪽 상단의 함수식 입력창을 클릭하세요.
                            <span className='graph-guide1'></span>
                        </div>
                        <div className='ggbCusUseGuideDesc second'>
                            왼쪽 하단에 <span className='graph-guide2'></span>키보드 모양의 아이콘이 나타나면 클릭해 주세요.
                        </div>
                        <div className='ggbCusUseGuideDesc third'>
                            수식 키보드를 이용하여 함수식을 입력하면 그래프가 추가됩니다.
                            <span className='graph-guide3'></span>
                        </div>
                    </div>
                    <div id="ggbCusTextGuideWrap" className='ggbCusTextGuideWrap hide'>
                        <div className='ggbCusUseGuideDesc first'>
                            왼쪽 상단의 + 버튼을 클릭 후 텍스트를 선택해 주세요.
                            <span className='text-guide1'></span>
                        </div>
                        <div className='ggbCusUseGuideDesc second'>
                            텍스트를 입력 후 따옴표 아이콘을 클릭하면 좌표평면에<br/>입력한 텍스트가 추가됩니다.
                            <span className='text-guide2'></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default GraphMake;