import {Link} from "react-router-dom";

const MyPageList = ()=>{
    return (
            <>
                <div className="myPageMenuDIv">
                    <div className="myPageMenuWrap">
                        <Link className='linkNoneCss' to="/myContentsList"><span id="myPageProd" className="myPageMenu"><span className="myPageMenuTitle myProd">나의 제작문제</span></span></Link> 
                        <Link className='linkNoneCss' to="/myRepository"><span id="myPageRepo" className="myPageMenu"><span className="myPageMenuTitle myRepo">나의 저장소</span></span></Link>
                        <span className="myPageMenu"><span id="myPageTestPaper" className="myPageMenuTitle myWorkSheet">학습지</span></span>
                    </div>
                </div>
            </>

    )
}

export default MyPageList;