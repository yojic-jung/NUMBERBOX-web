import React, {useState, useEffect} from 'react';
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin} from 'js/common/common_nb.js';
import "css/admin/admin.css";

const StatisticTable = ({title, statisticArr, hasRowName, unit, totalOpt, ratioOpt}) => {
    const [statisticArray, setStatisticArray] = useState(new Array());
    useEffect(() => {
        setStatisticArray(statisticArr);
    },[statisticArray]);

    let col2Hide=""
    let col3Hide= "";
    let col4Hide= "";
    let col5Hide= "";
    let col6Hide= "";
    let col7Hide= "";
    let col8Hide= "";
    let col9Hide= "";
    let col10Hide= "";
    
    const StatisticTd = statisticArray.map((rowObj, idx) => { 
        let headerClass= ""
        let colUnit = "";
        let lastColName;
        let nbColRatio1=0, nbColRatio2=0, nbColRatio3=0, nbColRatio4=0, nbColRatio5=0, nbColRatio6=0, nbColRatio7=0,nbColRatio8=0, nbColRatio9=0, nbColRatio10 = 0;
        let isRatioShow = false;
        if(idx === 0){
            headerClass= "statisticTableHeader "
            if(rowObj.nbCol2 === null){
                col2Hide= "hide";
            }
            
            if(rowObj.nbCol3 === null){
                col3Hide= "hide";
            }
            
            if(rowObj.nbCol4 === null){
                col4Hide= "hide";
            }
            
            if(rowObj.nbCol5 === null){
                col5Hide= "hide";
            }
            
            if(rowObj.nbCol6 === null){
                col6Hide= "hide";
            }
            
            if(rowObj.nbCol7 === null){
                col7Hide= "hide";
            }
            
            if(rowObj.nbCol8 === null){
                col8Hide= "hide";
            }
    
            if(rowObj.nbCol9 === null){
                col9Hide= "hide";
            }
            
            if(rowObj.nbCol10 === null){
                col10Hide= "hide";
            }
            colUnit="";
            lastColName="전체";
        }else{
            colUnit=unit;
            lastColName=0;
            let totalCnt=rowObj.nbCol1+rowObj.nbCol2+rowObj.nbCol3+rowObj.nbCol4+rowObj.nbCol5+rowObj.nbCol6+rowObj.nbCol7+rowObj.nbCol8+rowObj.nbCol9+rowObj.nbCol10;
            if(typeof(rowObj.nbCol1) === "number"){
                lastColName+=rowObj.nbCol1;
                nbColRatio1=Math.floor(rowObj.nbCol1/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol2) === "number"){
                lastColName+=rowObj.nbCol2;
                nbColRatio2=Math.floor(rowObj.nbCol2/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol3) === "number"){
                lastColName+=rowObj.nbCol3;
                nbColRatio3=Math.floor(rowObj.nbCol3/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol4) === "number"){
                lastColName+=rowObj.nbCol4;
                nbColRatio4=Math.floor(rowObj.nbCol4/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol5) === "number"){
                lastColName+=rowObj.nbCol5;
                nbColRatio5=Math.floor(rowObj.nbCol5/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol6) === "number"){
                lastColName+=rowObj.nbCol6;
                nbColRatio6=Math.floor(rowObj.nbCol6/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol7) === "number"){
                lastColName+=rowObj.nbCol7;
                nbColRatio7=Math.floor(rowObj.nbCol7/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol8) === "number"){
                lastColName+=rowObj.nbCol8;
                nbColRatio8=Math.floor(rowObj.nbCol8/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol9) === "number"){
                lastColName+=rowObj.nbCol9;
                nbColRatio9=Math.floor(rowObj.nbCol9/totalCnt*100)+"%"
            }
            if(typeof(rowObj.nbCol10) === "number"){
                lastColName+=rowObj.nbCol10;
                nbColRatio10=Math.floor(rowObj.nbCol10/totalCnt*100)+"%"
            }
            
            if(idx !==0 && ratioOpt) isRatioShow = true;
        }

        return (<tbody key={idx}>
                <tr className={headerClass}>
                    <td >{rowObj.nbCol1}{hasRowName ? "" : colUnit}</td>
                    <td className={headerClass + col2Hide}>{rowObj.nbCol2}{colUnit}</td>
                    <td className={headerClass + col3Hide}>{rowObj.nbCol3}{colUnit}</td>
                    <td className={headerClass + col4Hide}>{rowObj.nbCol4}{colUnit}</td>
                    <td className={headerClass + col5Hide}>{rowObj.nbCol5}{colUnit}</td>
                    <td className={headerClass + col6Hide}>{rowObj.nbCol6}{colUnit}</td>
                    <td className={headerClass + col7Hide}>{rowObj.nbCol7}{colUnit}</td>
                    <td className={headerClass + col8Hide}>{rowObj.nbCol8}{colUnit}</td>
                    <td className={headerClass + col9Hide}>{rowObj.nbCol9}{colUnit}</td>
                    <td className={headerClass + col10Hide}>{rowObj.nbCol10}{colUnit}</td>
                    {totalOpt && <td className={headerClass}>{lastColName}{colUnit}</td>}
                </tr> 
                {isRatioShow &&
                <tr key={idx+"aaa"}>
                    <td >{nbColRatio1}</td>
                    <td className={col2Hide}>{nbColRatio2}</td>
                    <td className={col3Hide}>{nbColRatio3}</td>
                    <td className={col4Hide}>{nbColRatio4}</td>
                    <td className={col5Hide}>{nbColRatio5}</td>
                    <td className={col6Hide}>{nbColRatio6}</td>
                    <td className={col7Hide}>{nbColRatio7}</td>
                    <td className={col8Hide}>{nbColRatio8}</td>
                    <td className={col9Hide}>{nbColRatio9}</td>
                    <td className={col10Hide}>{nbColRatio10}</td>
                    {totalOpt && <td>100%</td>}
                </tr> 
                }
                </tbody>)
    })

    return (
        <div className='statisticTableWrap'>
            <div>{title}</div>
            <table className='statisticTable'>
                    {StatisticTd}
            </table>
        </div>
    );

}

export default StatisticTable;