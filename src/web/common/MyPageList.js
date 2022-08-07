import {Link} from "react-router-dom";

const MyPageList = ()=>{
    return (
            <>
                <div className="myPageMenuDIv">
                    <div className="myPageMenuWrap">
                        <Link className='linkNoneCss' to="/myContentsList"><span id="myPageProd" className="myPageMenu"><span className="myPageMenuTitle myProd">나의 제작문제</span></span></Link> 
                        <Link className='linkNoneCss' to="/myRepository"><span id="myPageRepo" className="myPageMenu"><span className="myPageMenuTitle myRepo">저장소</span></span></Link>
                        <Link className='linkNoneCss' to="/myMathDocs"><span id="myMathDocs" className="myPageMenu"><span className="myPageMenuTitle myDocs">학습지</span></span></Link>
                        <Link className='linkNoneCss' to="/myResource"><span id="myResource" className="myPageMenu"><span className="myPageMenuTitle myResource">컨텐츠</span></span></Link>
                    </div>
                </div>
            </>

    )
}

export default MyPageList;