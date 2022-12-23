import React, {useState, useEffect} from 'react';
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin} from 'js/common/common_nb.js';
import "css/admin/admin.css";
import StatisticTable from 'web/common/StatisticTable'

const MembersStatistic = () => {
    let isAdmin = nb_isAdmin();
    const [isShow, setIsShow] = useState(false);
    const [membersCntByAge, setMembersCntByAge] = useState(new Array());
    const [membesrCntByHourPeriod, setMembesrCntByHourPeriod] = useState(new Array());
    const [membesrCntByProAndHourPeriod, setMembesrCntByProAndHourPeriod] = useState(new Array());
    const [membesrCntByProfile, setMembesrCntByProfile] = useState(new Array());
    const [membesrCntBySignupDate, setMembesrCntBySignupDate] = useState(new Array());
    const [memberMathContentsCnt, setMemberMathContentsCnt] = useState(new Array());
    const [mathDocsUsageStatistic, setMathDocsUsageStatistic] = useState(new Array());
    
    useEffect(() => {
        if(!isAdmin) window.location.href = "/";
        const asyncUseEffect = async () =>{
            let statistic1 = await nb_dataFetch("/takeMembersStatistic", true);
            let statistic2 = await nb_dataFetch("/mathDocs/mathDocsUsageStatistic", true);
            let statistic3 = await nb_dataFetch("/mathInfo/mathContentsStatistic", true);

            setMembersCntByAge(statistic1.membersCntByAge)
            setMembesrCntByHourPeriod(statistic1.membesrCntByHourPeriod)
            setMembesrCntByProAndHourPeriod(statistic1.membesrCntByProAndHourPeriod)
            setMembesrCntByProfile(statistic1.membesrCntByProfile)
            setMembesrCntBySignupDate(statistic1.membesrCntBySignupDate)
            setMemberMathContentsCnt(statistic3.memberMathContentsCnt);
            setMathDocsUsageStatistic(statistic2.mathDocsUsageStatistic);
            setIsShow(true)
        }
        asyncUseEffect();
    },[]);

    return (
        <div className="MembersStatisticRootDiv">
            {isShow &&
            <div>
                <StatisticTable title="연령별 회원 분포" statisticArr={membersCntByAge} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                <StatisticTable title="프로필별 회원 분포" statisticArr={membesrCntByProfile} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                <StatisticTable title="시간대별 가입자 분포" statisticArr={membesrCntByHourPeriod} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                <StatisticTable title="프로필/시간대별 가입자 분포" statisticArr={membesrCntByProAndHourPeriod} hasRowName={true} unit='명' totalOpt={true} ratioOpt={false}></StatisticTable>
                <StatisticTable title="날짜별 가입자 분포" statisticArr={membesrCntBySignupDate} hasRowName={false} unit='명' totalOpt={false} ratioOpt={false}></StatisticTable>
                <StatisticTable title="학습지 사용률" statisticArr={mathDocsUsageStatistic} hasRowName={false} unit='명' totalOpt={false} ratioOpt={false}></StatisticTable>
                <StatisticTable title="문제 제작 사용자" statisticArr={memberMathContentsCnt} hasRowName={false} unit='' totalOpt={false} ratioOpt={false}></StatisticTable>
            </div>
            }
        </div>
    );

}

export default MembersStatistic;