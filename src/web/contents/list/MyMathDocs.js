import React, {useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {Link} from "react-router-dom";
import {nb_dataFetch, nb_fadeInOutA} from 'js/common/common_nb.js';
import EmptyList from 'web/common/EmptyList';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';
import MathDocsMaker from 'web/contents/mathDocs/MathDocsMaker';


const MyMathDocs = ()=>{

    const [emptyListMsg, setEmptyListMsg] = useState("저장된 학습지 내역이 없습니다.\n학습지를 생성하여 관리해보세요.");
    const [mathDocsList, setMathDocsList] = useState(new Array());
    const [errContentsNo, setErrContentsNo] = useState(0);
    const [isShowMathDocs, setIsShowMathDocs] = useState(false);
    const [mathDocsNo, setMathDocsNo] = useState(0);

    useEffect(()=>{
        const asyncUseEffect = async function(){
            document.getElementById("myPageProd").classList.remove("active");
            document.getElementById("myPageRepo").classList.remove("active");
            document.getElementById("myMathDocs").classList.add("active");
            document.getElementById("myResource").classList.remove("active");
            let returnObj= await nb_dataFetch("/mathDocs/myMathDocs", true);
            if(returnObj.isSuccess){
                setMathDocsList(returnObj.myDocsList);
            }
        }
        asyncUseEffect();
    }, []);


    const docsPaperShow = async (docsNo) => {
       // window.location.href = '/makeMathDocs?docsNo='+docsNo;
        //setIsShowMathDocs(true);
        //setMathDocsNo(docsNo);
    }

    
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
            let mathDocsListTmp = mathDocsList.filter(function(element, idx){
                if(element.docsNo !==  Number(docsNo)){
                    return element;
                }
            });
            setMathDocsList(mathDocsListTmp);
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