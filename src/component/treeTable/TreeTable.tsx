/**
 * @name name
 * @description description
 * @time 2020-03-09
 */
import * as React from "react";
import {GroupCols} from './GroupCols';
import TabView from './TabView';
import {formatterTreeData} from '../combo/formatterTreeData';

type common = MyTreeTabSpace.common;
type childType =React.ComponentElement<common['groupCol'],any> ;

type Props={
    data: any[];
    children: childType[] | childType;
    multiply?: boolean;
    itemIcon?: string;
    defaultVal?: string;
    childField?:string;
	idField: string;//表格的节点标识
	defaultSel?: string;//默认选中的
	tabField?: string;//表格标识
	emptyTxt?: string;//空数据时显示文字
    getCheckFn?:(fn:any)=>void;//获取选中的
    initSelectVal?:{id:string};//通过外界改变表格的选中
    clickOrCheckForbid:(node:IImmutalbeMap<any>,field:string)=>boolean;
    bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
};
type States={
    immutabData:IImmutalbeList<IImmutalbeMap<common['node']>>;
};

type col = (Omit<MyTreeTabSpace.columnItem,'children'> & {text:string});
type config = Omit<common['groupCol'],'children'> & {
    child:col[]
};

interface ITreeTable {
    fieldArr:config[];
}
class TreeTable extends React.PureComponent<Props,States> implements ITreeTable{

    static defaultProps={
        idField:'id',
        childField:"children",
    };
    fieldObj:
    state:States={
        immutabData:formatterTreeData({
            filedObj:this.fieldObj,
            initSelect:
        },)
    };
    fieldArr:ITreeTable['fieldArr'];
    constructor(props:Props){
        super(props);
        const {children} = this.props;
        this.fieldArr = this.getFieldArr(children);
    }
    getFieldArr(arr:Props['children']){

       return React.Children.map(arr,function(val){

            const {children,align,forzen} = val.props ;

            const child = React.Children.map(children,function(node){
                const {children,width,field,formatter} = node.props ;
                return {
                    width,field,formatter,text:children
                };
            });

            return {
                child,
                align,
                forzen
            };

        });     
    }


    viewMap(){
        const {} = this.props;
       return this.fieldArr.map((group,index)=>{

           const {child} = group ;
        return (
            <TabView
                key={index}
                data={}
                cols={child}
                fixObj={this.fieldObj}
            
            />
        );

       });

        
    }
    render(){
        return (
            <div className="treeTab">
                {this.viewMap()}
            </div>
        );
    }
}


export  {TreeTable , GroupCols};