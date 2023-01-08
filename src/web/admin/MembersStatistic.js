import React, {useState, useEffect} from 'react';
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin} from 'js/common/common_nb.js';
import "css/admin/admin.css";
import StatisticTable from 'web/common/StatisticTable'

const MembersStatistic = () => {
    let isAdmin = nb_isAdmin();
    const [isShow, setIsShow] = useState(false);
    
    const [membersInfoKey, setMembersInfoKey] = useState(new Array());
    const [membersInfo, setMembersInfo] = useState(new Array());
    const [membersCntByAge, setMembersCntByAge] = useState(new Array());
    const [membesrCntByHourPeriod, setMembesrCntByHourPeriod] = useState(new Array());
    const [membesrCntByProAndHourPeriod, setMembesrCntByProAndHourPeriod] = useState(new Array());
    const [membesrCntByProfile, setMembesrCntByProfile] = useState(new Array());
    const [membesrCntBySignupDate, setMembesrCntBySignupDate] = useState(new Array());

    const [dailyLoginUserCnt, setDailyLoginUserCnt] = useState(new Array());
    const [reLoginRatioPerMonth, setReLoginRatioPerMonth] = useState(new Array());

    const [docsUsage, setDocsUsage] = useState(new Array());
    const [docsUsageByProfile, setDocsUsageByProfile] = useState(new Array());
    const [docsUsageByProfileAndDay, setDocsUsageByProfileAndDay] = useState(new Array());
    const [docsUsageByDay, setDocsUsageByDay] = useState(new Array());
    const [fileConvertStatistic, setFileConvertStatistic] = useState(new Array());

    const [memberMathContentsCnt, setMemberMathContentsCnt] = useState(new Array());


    useEffect(() => {
        if(!isAdmin) window.location.href = "/";
        const asyncUseEffect = async () =>{
            let statistic1 = await nb_dataFetch("/takeMembersStatistic", true);
            let statistic2 = await nb_dataFetch("/mathDocs/mathDocsUsageStatistic", true);
            let statistic3 = await nb_dataFetch("/mathInfo/mathContentsStatistic", true);
            let statistic4 = await nb_dataFetch("/convert/fileConvertStatistic", true);

            setMembersInfoKey(1);
            setMembersInfo(statistic1.membersInfo)
            setMembersCntByAge(statistic1.membersCntByAge)
            setMembesrCntByHourPeriod(statistic1.membesrCntByHourPeriod)
            setMembesrCntByProAndHourPeriod(statistic1.membesrCntByProAndHourPeriod)
            setMembesrCntByProfile(statistic1.membesrCntByProfile)
            setMembesrCntBySignupDate(statistic1.membesrCntBySignupDate)
            setDailyLoginUserCnt(statistic1.dailyLoginUserCnt);
            setReLoginRatioPerMonth(statistic1.reLoginRatioPerMonth);

            setMemberMathContentsCnt(statistic3.memberMathContentsCnt);
            setFileConvertStatistic(statistic4.fileConvertStatistic);

            setDocsUsage(statistic2.docsUsage);
            setDocsUsageByProfile(statistic2.docsUsageByProfile)
            setDocsUsageByProfileAndDay(statistic2.docsUsageByProfileAndDay);
            setDocsUsageByDay(statistic2.docsUsageByDay);
            setIsShow(true)
        }
        asyncUseEffect();
    },[]);

    const sortByDateTime = async (mode) => {
        let orderedDate = membersInfo.sort((a, b) => {
            if(a.nbCol1 === "이메일" && b.nbCol1 === "이메일"){
                return 0;
            }
            if(mode === "loginDate"){
                let datetime = a.nbCol4.split(" ");
                let datetime2 =  b.nbCol4.split(" ");
                let newDateTime = datetime[0].replaceAll("년", "").replaceAll("월", "").replaceAll("일", "");
                let newDateTime2 = datetime2[0].replaceAll("년", "").replaceAll("월", "").replaceAll("일", "");
                return new Date(newDateTime2)-new Date(newDateTime)
            }else {
                let datetime = a.nbCol5.split(" ");
                let datetime2 =  b.nbCol5.split(" ");
                let newDateTime = datetime[0].replaceAll("년", "").replaceAll("월", "").replaceAll("일", "");
                let newDateTime2 = datetime2[0].replaceAll("년", "").replaceAll("월", "").replaceAll("일", "");
                return new Date(newDateTime2)-new Date(newDateTime)
            }
        });

        setMembersInfo(orderedDate);
        setMembersInfoKey(membersInfoKey+1);
        if(mode === "signupDate"){
            document.getElementById("sortBySignup").classList.add("active");
            document.getElementById("sortByLoginiDate").classList.remove("active");
        }else{
            document.getElementById("sortBySignup").classList.remove("active");
            document.getElementById("sortByLoginiDate").classList.add("active");
        }
    }
    return (
        <div className="MembersStatisticRootDiv">
            {isShow &&

            <div>
                <div>
                    <span id="" className='customBtn' onClick={()=>{document.getElementById("lastSignupUser").classList.remove("hide")}}>최신 가입자 정보 조회</span>
                </div>
                <div id="lastSignupUser" className='blindBox hide'>
                    <div className='statisticFixedDiv'>
                        <div className='closeBtn' onClick={()=>{document.getElementById("lastSignupUser").classList.add("hide")}}>X</div>
                        <div className='alignLeft'>
                            <span id="sortByLoginiDate" className='customBtn4' onClick={()=>{sortByDateTime("loginDate")}}>최신 로그인 순</span>
                            <span id="sortBySignup" className='customBtn4 active' onClick={()=>{sortByDateTime("signupDate")}}>최신 가입자 순</span>
                        </div>
                        <StatisticTable title="최근 가입자 100명 정보 조회" key={membersInfoKey} statisticArr={membersInfo} hasRowName={false} unit='' totalOpt={false} ratioOpt={false}></StatisticTable>
                    </div>
                </div>
                <div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;회원 분포 통계&gt;</div>
                        <StatisticTable title="연령별 회원 분포" statisticArr={membersCntByAge} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                        <StatisticTable title="프로필별 회원 분포" statisticArr={membesrCntByProfile} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                    </div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;가입자 분포 통계&gt;</div>
                        <StatisticTable title="시간대별 가입자 분포" statisticArr={membesrCntByHourPeriod} hasRowName={false} unit='명' totalOpt={true} ratioOpt={true}></StatisticTable>
                        <StatisticTable title="프로필/시간대별 가입자 분포" statisticArr={membesrCntByProAndHourPeriod} hasRowName={true} unit='명' totalOpt={true} ratioOpt={false}></StatisticTable>
                        <StatisticTable title="날짜별 가입자 분포" statisticArr={membesrCntBySignupDate} hasRowName={false} unit='명' totalOpt={false} ratioOpt={false}></StatisticTable>
                    </div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;접속자 분포 통계&gt;</div>
                        <StatisticTable title="일일 접속자 분포" statisticArr={dailyLoginUserCnt} hasRowName={false} unit='명' totalOpt={false} ratioOpt={false}></StatisticTable>
                        <StatisticTable title="월별 가입자 재접속 비율" statisticArr={reLoginRatioPerMonth} hasRowName={false} unit='%' totalOpt={false} ratioOpt={false}></StatisticTable>
                    </div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;학습지 분포 통계&gt;</div>
                        <StatisticTable title="학습지 사용률" statisticArr={docsUsage} hasRowName={false} unit='번' totalOpt={false} ratioOpt={false}></StatisticTable>
                        <StatisticTable title="요일별 학습지 사용률" statisticArr={docsUsageByDay} hasRowName={false} unit='번' totalOpt={true} ratioOpt={true}></StatisticTable>
                        <StatisticTable title="프로필별 학습지 사용률" statisticArr={docsUsageByProfile} hasRowName={false} unit='번' totalOpt={true} ratioOpt={true}></StatisticTable>
                        <StatisticTable title="프로필/요일별 학습지 사용률" statisticArr={docsUsageByProfileAndDay} hasRowName={true} unit='번' totalOpt={true} ratioOpt={false}></StatisticTable>
                    </div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;문제 제작 분포 통계&gt;</div>
                        <StatisticTable title="문제 제작 사용자" statisticArr={memberMathContentsCnt} hasRowName={false} unit='' totalOpt={false} ratioOpt={false}></StatisticTable>
                    </div>
                    <div className='statisticGrpDiv'>
                        <div className='statisticGrpTitle'>&lt;파일변환 사용 통계&gt;</div>
                        <StatisticTable title="프로필별 파일변환 사용 통계" statisticArr={fileConvertStatistic} hasRowName={false} unit='' totalOpt={true} ratioOpt={false}></StatisticTable>
                    </div>
                </div>
            </div>
            }
        </div>
    );

}

export default MembersStatistic;