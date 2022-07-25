import React, { useState, useEffect } from 'react';
import contentsEmpty from 'img/contentsEmpty.gif';
import paper from 'img/paper.gif';
import myRepoEmpty from 'img/myRepoEmpty.gif';
import squareAndCircle from 'img/squareAndCircle.gif';

const EmptyList = ({msg, imgName, addImgClass})=>{
    const [imgPath, setImgPath] = useState(null);
    let imgClassName = addImgClass+" emptyListImg"
    useEffect(()=>{
        if(imgName==="myContentEmpty"){
            setImgPath(contentsEmpty);
        }else if(imgName==="searchList"){
            setImgPath(paper);
        }else if(imgName === "myRepoEmpty"){
            setImgPath(myRepoEmpty);
        }else if(imgName === "myResourceEmpty"){
            setImgPath(squareAndCircle);
        }
    },[])
   
  return (
    <div className='alignCenter'>
        <div className='emptyListMsg'>{msg}</div>
        <div>
            {imgPath === null ?
                <div></div>
                : <img id="" alt="." src={imgPath} className={imgClassName}/> 
            }
        </div>
    </div>
  );
}

export default EmptyList;