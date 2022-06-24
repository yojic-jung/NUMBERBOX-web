import React from 'react';

const LicenseUi2 = ()=>{
return (
                <>
                    <div className='licenseUiTitle2'>라이선스 범위</div>
					<table className='licenseTable2'>
						<tbody>
							<tr>
								<td><span id='platformShareSttsUi'></span>&nbsp;공&#183;사교육기관에서 상업용 목적 없는 학습자료로 사용</td>
								<td> <span id='onlineLicSttsUi'></span>&nbsp;외부 동영상 플랫폼에서 사용 (넘버링크 및 닉네임 출처 표시)</td>
							</tr>
							<tr>
								<td><span id='perLicSttsUi'></span>&nbsp;개인 강사 교재 문제 수록</td>
								<td> <span id='entLicSttsUi'></span>&nbsp;기업용 출판 교재 문제 수록</td>
							</tr>
						</tbody>
					</table>
                </>
)
}

export default LicenseUi2;