import React, {useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {Link} from "react-router-dom";
import {nb_dataFetch, nb_fadeInOutA, nb_getParameterByName} from 'js/common/common_nb.js';
import EmptyList from 'web/common/EmptyList';
import PageNumBtn from 'web/common/PageNumBtn';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';


const MyMathDocs = ()=>{
    let location = useLocation();
    const [mathDocsList, setMathDocsList] = useState(new Array());
    const [errContentsNo, setErrContentsNo] = useState(0);
    const [curPageNum, setCurPageNum] = useState(0);
    const [totalPageCnt, setTotalPageCnt] = useState(0);
    const pageVolume = 20;
    const emptyListMsg="저장된 학습지 내역이 없습니다.\n학습지를 생성하여 관리해보세요.";

    useEffect(()=>{
        if(location.pathname.indexOf("myMathDocs")<0) return;
        let param = nb_getParameterByName("pageNum")
        const asyncUseEffect = async function(){
            document.getElementById("myPageProd").classList.remove("active");
            document.getElementById("myPageRepo").classList.remove("active");
            document.getElementById("myMathDocs").classList.add("active");
            document.getElementById("myResource").classList.remove("active");
            let returnObj;
            let movePage;
            if(param !== ""){
                movePage = Number(param)-1;
                setCurPageNum(movePage)
                returnObj= await nb_dataFetch("/mathDocs/myMathDocs?curPageNum="+movePage+"&pageVolume="+pageVolume, true);
            }else{
                movePage=curPageNum
                returnObj= await nb_dataFetch("/mathDocs/myMathDocs?curPageNum="+curPageNum+"&pageVolume="+pageVolume, true);
            }
            if(returnObj.isSuccess){
                setMathDocsList(returnObj.myDocsList);
                setTotalPageCnt(returnObj.totalPageCnt);
            }
            
        }
        asyncUseEffect();
        return ()=>{}
    }, [location]);


   

    
    const errorReportOpen = async (docsNo) => {
        setErrContentsNo(docsNo);
    }

    const errorReportClose = async (contentsNo) => {
        setErrContentsNo(0);
        if(contentsNo !== undefined){
            document.getElementById("docsListErrInnerText-"+contentsNo).innerText = "접수완료"
            document.getElementById("docsListErrBtn-"+contentsNo).classList.add("hide");
        }
    }

    const docsPaperDel = async (docsNo) => {
        let returnObj= await nb_dataFetch("/mathDocs/delMyMathDocs?docsNo="+docsNo, true);
        if(returnObj.isSuccess){
            if(mathDocsList.length === 1 && curPageNum > 0){
                returnObj= await nb_dataFetch("/mathDocs/myMathDocs?curPageNum="+(curPageNum-1)+"&pageVolume="+pageVolume, true);
                window.history.pushState("", "나의 컨텐츠", '/myMathDocs?pageNum='+curPageNum);
                setCurPageNum(curPageNum-1)
            }else{
                returnObj= await nb_dataFetch("/mathDocs/myMathDocs?curPageNum="+curPageNum+"&pageVolume="+pageVolume, true);
            }
            setMathDocsList(returnObj.myDocsList);
            setTotalPageCnt(returnObj.totalPageCnt);
            nb_fadeInOutA("학습지가 정상적으로 삭제 되었습니다.", 2000);
        }
    }

    const doscList = mathDocsList.map((docs, idx) => {
        let docErrBtnClassName = 'errBtn docsList';
        let docErrText = '';
        if(docs.docsErrStts === 1){
            docErrBtnClassName = "errBtn docsList hide";
            docErrText = "접수완료";
        }
        return <tr className='docsListTr' key={docs.docsNo}>
                    <td className='alignCenter docsGrade'><Link className="linkNoneCss" to={"/makeMathDocs?docsNo="+docs.docsNo}><div className='allSpace docs'>{docs.docsGrade}</div></Link></td>
                    <td className='alignCenter docsListTitle'><Link className="linkNoneCss" to={"/makeMathDocs?docsNo="+docs.docsNo}><div className='allSpace docs'>{docs.docsTitle}</div></Link></td>
                    <td className='docsListSubTitle'><Link className="linkNoneCss" to={"/makeMathDocs?docsNo="+docs.docsNo}><div className='allSpace docs'>{docs.docsSubTitle}</div></Link></td>
                    <td className='alignCenter'><Link className="linkNoneCss" to={"/makeMathDocs?docsNo="+docs.docsNo}><div className='allSpace docs'>{docs.docsOwner}</div></Link></td>
                    <td className="docsListDate"><Link className="linkNoneCss" to={"/makeMathDocs?docsNo="+docs.docsNo}><div className='allSpace docs'>{docs.sysCreateDate}</div></Link></td>
                    <td className="docsListErr alignCenter"><span id={"docsListErrBtn-"+docs.docsNo} onClick={()=>errorReportOpen(docs.docsNo)} className={docErrBtnClassName}></span><span id={"docsListErrInnerText-"+docs.docsNo}>{docErrText}</span></td>
                    <td className='docsListDel alignCenter'><span id="" onClick={()=>docsPaperDel(docs.docsNo)} className="delBtn docsList"></span></td>
                </tr>
    });

        
return (
                <>
                        <Helmet>
                            <title>나의 학습지</title>
                            <meta name="description" content="나의 학습지 내역을 확인해보세요!"/>
                            <link rel="canonical" href="https://nsoohak.com/myMathDocs" />
                            <meta property="og:title" content="나의 학습지" />
                            <meta property="og:description" content="나의 학습지 내역을 확인해보세요!" />
                        </Helmet>
                        <div>
                            {
                            mathDocsList.length === 0 ?
                            <EmptyList msg={emptyListMsg} imgName="myRepoEmpty" addImgClass="miniSize" /> :
                            <div className='mathDocsListWrap'>
                                <table className='mathDocsList'>
                                    <thead>
                                        <tr>
                                            <th className='docsListGrade'>학년</th><th className='docsListTitle'>제목</th><th className='docsListSubTitle'>부제목</th><th>출제자</th><th>생성날짜</th><th></th><th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doscList}
                                    </tbody>
                                </table>
                                {totalPageCnt > 1 && <PageNumBtn linkUrl="/myMathDocs" additionParam="" curPageNum={curPageNum} totalPageCnt={totalPageCnt} /> } 
                            </div>
                            }
                      
                            <div className='paddinHundreds'></div>
                            {errContentsNo !== 0 &&
                            <ErrorReportForMathCon parentMethod={errorReportClose} conNo={errContentsNo} errType={3} title="학습지 오류 신고"/>
                            }
                        </div>
                </>
)
}

export default MyMathDocs;