import React from 'react';

const LicenseUi = ()=>{
return (
                <>
                    <div className='licenseUiTitle'>라이선스 범위</div>
					<table className='licenseTable'>
						<tbody>
							<tr>
								<td><span id='platformShareSttsUi'></span><br/>공&#183;사교육기관에서<br/>상업용 목적 없는 <br/>학습자료로 사용</td>
								<td> <span id='onlineLicSttsUi'></span><br/>외부 동영상 플랫폼에서 사용<br/>(N명의수학 및 닉네임 출처 표시)</td>
								<td><span id='perLicSttsUi'></span><br/>개인 강사 교재<br/>문제 수록</td>
								<td> <span id='entLicSttsUi'></span><br/>기업용 출판 교재<br/>문제 수록</td>
							</tr>
						</tbody>
					</table>
                </>
)
}

export default LicenseUi;