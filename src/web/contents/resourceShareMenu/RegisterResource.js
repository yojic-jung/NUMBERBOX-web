import React, { useState, useEffect } from 'react';
import image from 'img/image.png';
import addImg from 'img/add.png';
import TopMenuBar from 'web/common/TopMenuBar';
import ResourceMenuBar from 'web/common/ResourceMenuBar';
import CustomSelectBox from 'web/common/CustomSelectBox';
import {nb_dataFetch, nb_formDataFetch, nb_loadFile} from 'js/common/common_nb.js';
import "css/resourceFile/registerResource.css";

const RegisterResource = () => {

    const [mainCate, setMainCate] = useState(new Array());	// 사용자 입력 문제

    useEffect(() => {
        const asyncUseEffect = async function(){
            let resourceMenu = await nb_dataFetch('/mathInfo/takeResourceMenu', true);
            setMainCate(resourceMenu["resourceMenuList"]);
            document.getElementById("registerResource").classList.add("active")
        }
        asyncUseEffect();
    }, []);

    const validUI = async (event) => {
        let targetId = event.target.id;
        if(targetId === "title"){
            if(document.getElementById(targetId).value.length > 0 && document.getElementById(targetId).value.length < 11){
                document.getElementById(targetId).classList.remove("redBoxValid");
                document.getElementById("titleValDesc").innerText="";
            }
        }else if(targetId === "description"){
            if(document.getElementById(targetId).value.length < 31){
                document.getElementById(targetId).classList.remove("redBoxValid");
                document.getElementById("descriptionValDesc").innerText="";
            }
        }
    }

    const changeHandler = async (event) => {
        let target = event.target;
        target.classList.remove("redBoxValid");
        if(target.value === "0"){
            target.classList.add("bageText");
        }else{
            target.classList.remove("bageText");
        }

        let selectedIdx = target.options.selectedIndex;
        let parentKey = target[selectedIdx].value
        document.querySelectorAll("#midCate option").forEach((element, idx)=>{
            if(idx ===0) {
                element.classList.remove("hide");
                return;
            }
            if(element.dataset.parentKey === parentKey) element.classList.remove("hide");
            else element.classList.add("hide");
        });
        document.getElementById("midCate").value="0";
        document.getElementById("midCate").classList.add("bageText");
    }

    const validUiHandler = async (event) => {
        let target = event.target;
        target.classList.remove("redBoxValid");
        if(target.value === "0"){
            target.classList.add("bageText");
        }else{
            let alreadyCateBtn = document.querySelectorAll(".userCateBtn");
            if(alreadyCateBtn.length === 5){
                return;
            }

            let cateNo = document.getElementById("mainCate").value+"-"+document.getElementById("midCate").value;
            for(let i=0; i<alreadyCateBtn.length; i++){
                console.log(cateNo);
                if(alreadyCateBtn[i].dataset.cateNo === cateNo)return;
            }
            let userCateWrap = document.createElement("div");
            userCateWrap.className = "userCateWrap";
            let userCate = document.createElement("span");
            userCate.className = "userCateBtn";
            userCate.dataset.cateNo=cateNo;
            let mainText = document.querySelectorAll("#mainCate option")[document.getElementById("mainCate").selectedIndex].text;
            let midText = document.querySelectorAll("#midCate option")[document.getElementById("midCate").selectedIndex].text;
            let userCateDel = document.createElement("span");
            userCateDel.className = "cate-del";
            userCateDel.innerText = "x";
            userCateDel.addEventListener("click", function(event){
                event.target.closest(".userCateWrap").remove();
            });

            userCate.innerHTML = mainText+"-"+midText;
            userCate.append(userCateDel);
            userCateWrap.append(userCate);
            document.getElementById("userCateDiv").append(userCateWrap);
            target.classList.remove("bageText");
        }
    }

    const imgFileChange = async (event) => {
        if(event.target.files[0] === undefined){
            document.getElementById("representImg").src=image;
        }else{
            let fileNames = event.target.files[0].name.split(".");
            let filetype = fileNames[1].toUpperCase();
            if(!( filetype === "PNG" || filetype=='JPG' || filetype=='GIF' || filetype=='PNG' || filetype=='JPEG' || filetype=='BMP')){
                alert("이미지 파일만 등록 가능합니다.(PNG, JPG, GIF, PNG, JPEG, BMP 확장자만 가능)");
                document.getElementById("imgFile").value = "";
                document.getElementById("representImg").src=image;
                return false;
            }

            if(event.target.files[0].size > 1024*1024*3){
                alert("파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.");
                document.getElementById("imgFile").value = "";
                document.getElementById("representImg").src=image;
                return false;
            }

            await nb_loadFile(event, "representImg", undefined);
            document.getElementById("imgDiv").classList.remove("redBoxValid");
        }
    }

    const pptFileChange = async (event) => {
        if(event.target.files[0] === undefined){
            document.getElementById("pptFileCustomDesc").innerText="choose File..."
        }else{
            let fileNames = event.target.files[0].name.split(".");
            let filetype = fileNames[1].toUpperCase();
            if(!(filetype === "PPT" || filetype==='PPTX' || filetype==='POT' || filetype==='PDF')){
                alert("ppt 및 pdf 파일만 등록 가능합니다.(PPT, PPTX, POT, PDF 확장자만 가능)");
                document.getElementById("pptFile").value = "";
                document.getElementById("pptFileCustomDesc").innerText="choose File...";
                return false;
            }

            if(event.target.files[0].size > 1024*1024*3){
                alert("파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.");
                document.getElementById("pptFile").value = "";
                document.getElementById("pptFileCustomDesc").innerText="choose File..."
                return false;
            }

            document.getElementById("pptFileCustomDesc").innerText=event.target.files[0].name;
            document.getElementById("pptDiv").classList.remove("redBoxValid");

        }
    }

    const resourceSubmit = async () => {
        let formData = new FormData(document.getElementById("resourceForm"));

        let isValid = true;
        if(formData.get("title").length === 0 || formData.get("title").length > 15){
            document.getElementById("titleValDesc").innerText ="컨텐츠 타이틀(15글자 이하)";
            document.getElementById("title").classList.add("redBoxValid");
            isValid = false;
        }
        let alreadyCateBtn = document.querySelectorAll(".userCateBtn");
        if(alreadyCateBtn.length === 0){
            document.getElementById("mainCate").classList.add("redBoxValid");
            document.getElementById("midCate").classList.add("redBoxValid");
            isValid = false;
        }
       
        if(formData.get("imgFile").name === ""){
            document.getElementById("imgDiv").classList.add("redBoxValid");
            isValid = false;
        }
        if(formData.get("description").length > 30){
            document.getElementById("descriptionValDesc").innerText ="컨텐츠 설명(30글자 이하)";
            document.getElementById("description").classList.add("redBoxValid");
            isValid = false;
        }

        if(!isValid){
            return;
        }

        let cateList = "";
        for(let i=0; i<alreadyCateBtn.length; i++){
            if(i===0){
                cateList = alreadyCateBtn[i].dataset.cateNo;
            }else{
                cateList += ","+alreadyCateBtn[i].dataset.cateNo;
            }
        }
        formData.append("cateList", cateList);

		let returnVal = await nb_formDataFetch("/mathInfo/registerResource", formData, true);
        if(returnVal.isSuccess === true){
            alert("컨텐츠가 정상적으로 등록되었습니다.");
            document.forms[0].reset();
            document.getElementById("representImg").src=image;
            document.getElementById("pptFileCustomDesc").innerText="choose File...";
            document.getElementById("mainCate").classList.add("bageText");
            document.getElementById("midCate").classList.add("bageText");
        }

    }

    return (
        <>
        <TopMenuBar />
        <ResourceMenuBar/>
        <div className='bage-ground'>
        <form method="post" id="resourceForm" encType="multipart/form-data">
            <div className='center regResDesc'>컨텐츠를 등록하여 사용자들과 함께 공유 해보세요!</div>
            <table className='regResourceTb'>
                <tbody>
                    <tr>
                        <td><span>대표 이미지</span></td>
                        <td className='relative'>
                            <span id="imgDiv" className='imgDiv'>
                                <img id="representImg" className='representImg' src={image} alt="대표이미지" onClick={()=>{document.getElementById("imgFile").click()}}/>
                                <img id="regRepImg" className='regRepImg' src={addImg} alt="이미지 등록" onClick={()=>{document.getElementById("imgFile").click()}}/>
                                <input id="imgFile" type="file" name="imgFile" accept="image/*" className='hide' onChange={(event)=>{imgFileChange(event)}}/>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td><span>타이틀</span> </td>
                        <td>
                            <input id="title" type="text" name="title" className='regResTitle' placeholder='컨텐츠 타이틀 (15글자 이하)' onKeyUp={(event)=>validUI(event)}/>
                            <div id='titleValDesc' className='redText2'></div>
                        </td>
                    </tr>
                    <tr>
                        <td><span>카테고리</span></td>
                        <td>
                            <CustomSelectBox id="mainCate" className="bageText" name="mainCateNo" firstVal="카테고리" optList={mainCate} val="mainCateNo" mainVal="mainCateName" changeHandler={changeHandler}></CustomSelectBox>
                        </td>
                    </tr>
                    <tr>
                        <td><span>세부 카테고리</span></td>
                        <td>
                            <CustomSelectBox id="midCate" className="bageText" name="midCateNo" firstVal="세부 카테고리" optList={mainCate} val="midCateNo" parentKey="mainCateNo" mainVal="midCateName" displayMode="hide" changeHandler={validUiHandler}></CustomSelectBox>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" className='paddingZero'>
                            <div className='cateDesc'>카테고리는 최대 5개까지 선택 가능합니다.</div>
                            <div id="userCateDiv" className='userCateDiv'></div>
                        </td>
                    </tr>
                    <tr>
                        <td>ppt파일<sup>(선택)</sup></td>
                        <td>
                            <input id="pptFile" type="file" name="pptFile" className='hide' onChange={(event)=>{pptFileChange(event)}}/>
                            <span id="pptDiv" className='center' onClick={()=>{document.getElementById("pptFile").click()}}><span id="pptFileCustomDesc" className='imgFileCustomDesc'>choose File...</span><span className='imgFileCustomBtn2'>UPLOAD</span></span>
                            <div className='pptDesc'>편집 가능한 ppt파일로 더욱 적극적으로 공유 해보세요</div>
                        </td>
                    </tr>
                    <tr>
                        <td>설명<sup>(선택)</sup></td>
                        <td>
                            <textarea id="description" name="description"  placeholder='컨텐츠 설명 (30글자 이하)' onKeyUp={(event)=>validUI(event)}/>
                            <div id='descriptionValDesc' className='redText2'></div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2"><div className='submit-btn' onClick={()=>resourceSubmit()}>등록</div></td>
                    </tr>
                </tbody>
            </table>
        </form>
        </div>
        
        </>
    );

}

export default RegisterResource;