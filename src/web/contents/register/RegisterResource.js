import React, { useState, useEffect } from 'react';
import TopMenuBar from 'web/common/TopMenuBar';
import CustomSelectBox from 'web/common/CustomSelectBox';
import {nb_dataFetch, nb_formDataFetch} from 'js/common/common_nb.js';
import "css/resourceFile/registerResource.css";

const RegisterResource = () => {

    const [mainCate, setMainCate] = useState(new Array());	// 사용자 입력 문제

    useEffect(() => {
        const asyncUseEffect = async function(){
            let resourceMenu = await nb_dataFetch('/mathInfo/takeResource', true);
            setMainCate(resourceMenu["resourceMenuList"]);
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
            target.classList.remove("bageText");
        }
    }

    const imgFileChange = async (event) => {
        if(event.target.files[0] === undefined){
            document.getElementById("imgFileCustomDesc").innerText="choose File..."
        }else{
            let fileNames = event.target.files[0].name.split(".");
            let filetype = fileNames[1].toUpperCase();
            console.log(filetype);
            if(!( filetype === "PNG" || filetype=='JPG' || filetype=='GIF' || filetype=='PNG' || filetype=='JPEG' || filetype=='BMP')){
                alert("이미지 파일만 등록 가능합니다.(PNG, JPG, GIF, PNG, JPEG, BMP 확장자만 가능)");
                document.getElementById("imgFile").value = "";
                document.getElementById("imgFileCustomDesc").innerText="choose File...";
                return false;
            }

            if(event.target.files[0].size > 1024*1024*3){
                alert("파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.");
                document.getElementById("imgFile").value = "";
                document.getElementById("imgFileCustomDesc").innerText="choose File...";
                return false;
            }

            document.getElementById("imgFileCustomDesc").innerText=event.target.files[0].name;
            document.getElementById("imgDiv").classList.remove("redBoxValid");
        }
    }

    const pptFileChange = async (event) => {
        if(event.target.files[0] === undefined){
            document.getElementById("pptFileCustomDesc").innerText="choose File..."
        }else{
            let fileNames = event.target.files[0].name.split(".");
            let filetype = fileNames[1].toUpperCase();
             console.log(filetype);
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
        if(formData.get("title").length === 0 || formData.get("title").length > 10){
            document.getElementById("titleValDesc").innerText ="컨텐츠 타이틀을 입력해주세요.(10글자 미만)";
            document.getElementById("title").classList.add("redBoxValid");
            isValid = false;
        }

        if(formData.get("mainCateNo") === "0"){
            document.getElementById("mainCate").classList.add("redBoxValid");
            isValid = false;
        }

        if(formData.get("midCateNo") === "0"){
            document.getElementById("midCate").classList.add("redBoxValid");
            isValid = false;
        }
        if(formData.get("imgFile").name === ""){
            document.getElementById("imgDiv").classList.add("redBoxValid");
            isValid = false;
        }
        if(formData.get("description").length > 30){
            document.getElementById("descriptionValDesc").innerText ="컨텐츠 설명은 30글자 미만으로 입력해주세요.";
            document.getElementById("description").classList.add("redBoxValid");
            isValid = false;
        }

        if(!isValid){
            return;
        }

		let returnVal = await nb_formDataFetch("/mathInfo/registerResource", formData, true);
        if(returnVal.isSuccess === true){
            alert("컨텐츠가 정상적으로 등록되었습니다.");
            document.forms[0].reset();
            document.getElementById("imgFileCustomDesc").innerText="choose File...";
            document.getElementById("pptFileCustomDesc").innerText="choose File...";
            document.getElementById("mainCate").classList.add("bageText");
            document.getElementById("midCate").classList.add("bageText");
        }
        console.log(returnVal);
    }

    return (
        <>
        <TopMenuBar />
        <div className='bage-ground'>
        <form method="post" id="resourceForm" encType="multipart/form-data">
            <div className='center regResDesc'>사용자들과 공유할 컨텐츠를 등록해주세요.</div>
            <table className='regResourceTb'>
                <tbody>
                    <tr>
                        <td>
                            <input id="title" type="text" name="title" className='regResTitle' placeholder='컨텐츠 타이틀' onKeyUp={(event)=>validUI(event)}/>
                            <div id='titleValDesc' className='redText2'></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <CustomSelectBox id="mainCate" className="bageText" name="mainCateNo" firstVal="카테고리" optList={mainCate} val="mainCateNo" mainVal="mainCateName" changeHandler={changeHandler}></CustomSelectBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <CustomSelectBox id="midCate" className="bageText" name="midCateNo" firstVal="세부 카테고리" optList={mainCate} val="midCateNo" parentKey="mainCateNo" mainVal="midCateName" displayMode="hide" changeHandler={validUiHandler}></CustomSelectBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="imgFile" type="file" name="imgFile" accept="image/*" className='hide' onChange={(event)=>{imgFileChange(event)}}/>
                            <span id="imgDiv" className='center' onClick={()=>{document.getElementById("imgFile").click()}}><span id="imgFileCustomDesc" className='imgFileCustomDesc'>choose File...</span><span className='imgFileCustomBtn'>이미지 첨부</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input id="pptFile" type="file" name="pptFile" className='hide' onChange={(event)=>{pptFileChange(event)}}/>
                            <span id="pptDiv" className='center' onClick={()=>{document.getElementById("pptFile").click()}}><span id="pptFileCustomDesc" className='imgFileCustomDesc'>choose File...</span><span className='imgFileCustomBtn2'>ppt 첨부</span></span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <textarea id="description" name="description" placeholder='컨텐츠 설명(선택, 30글자 미만)' onKeyUp={(event)=>validUI(event)}/>
                            <div id='descriptionValDesc' className='redText2'></div>
                        </td>
                    </tr>
                    <tr>
                        <td><div className='submit-btn' onClick={()=>resourceSubmit()}>등록</div></td>
                    </tr>
                </tbody>
            </table>
        </form>
        </div>
        
        </>
    );

}

export default RegisterResource;