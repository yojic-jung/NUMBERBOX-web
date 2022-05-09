import React from 'react';

const CustomSelectBox = ({id, className, name, firstVal, optList, val, parentKey, mainVal, displayMode, changeHandler}) => {

    let uniqueArr = [];

    optList.filter((element, index) => {
        if(index!==0){
            if(optList[index-1][mainVal] !== element[mainVal]){
                uniqueArr.push(element);
            }
        }else{
            uniqueArr.push(element);
        }
    });
    
    return (
        <select id={id} name={name} className={className} onChange={changeHandler}>
                <option key="001" value="0" className={displayMode}>{firstVal}</option>
		        {uniqueArr.map((item, index)=>(
			        <option className={displayMode} key={item.key} value={item[val]} data-parent-key={item[parentKey]}>{item[mainVal]}</option>
		        ))}
       </select>
    );

}

export default CustomSelectBox;