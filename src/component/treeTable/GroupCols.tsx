/**
 * @name 列头组
 * @description 把固定列分组，好划分区域，最终作用不是生成任何html，只是用作生成配置列头的数据
 * @time 2020-03-10
 */
import * as React from "react";

type Props= MyTreeTabSpace.groupCol;
type States={
		
};

class GroupCols extends React.PureComponent<Props,States> {
    static colItem:React.SFC<MyTreeTabSpace.columnItem & {children:string}> = ()=>{
        return <></>;
    }
    state:States={
    };
    render(){
        return '';
    }
}


export  {GroupCols};