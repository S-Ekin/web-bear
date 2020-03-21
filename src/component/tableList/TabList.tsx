/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import * as Immutable from "immutable";
import TabView from './TabView';
import {GroupCols} from './GroupCols';
type common =MyTabListSpace.common;
type childType =React.ComponentElement<common['groupCol'],any> ;
type Props={
	data: any[];
    children: childType[] | childType;
    height?:number;
	noPageNums?: boolean;//页码
	idField: string;//表格的节点标识
	multiply?: boolean;//多选
	defaultSel?: string;//默认选中的
	tabField?: string;//表格标识
	emptyTxt?: string;//空数据时显示文字
    getCheckFn?:(fn:any)=>void;//获取选中的
    initSelectVal?:{id:string};//通过外界改变表格的选中
    bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
};
type States={
    immutabData:IImmutalbeList<IImmutalbeMap<any>>;
    selectArr:IImmutalbeList<string>;
    preData:any[];
    preInitSelect?:{id:string}
};
type config = common['config'];
type fixObj = {
    tabField:string;
    emptyTxt:string;
    idField:string;
    multiply?:boolean;
    defaultSel:string;
};
interface ITabList {
    fieldArr:config[];
    fixObj:fixObj;
}

const tableInitData=(data:Props["data"],defaulSel:string,idField:string)=>{
        const defaulSelArr = `${defaulSel}`.split(",");
        return  Immutable.fromJS(data,(_key,val,_path)=>{
                if(Immutable.isKeyed(val)){
                   // 对象
                    let obj = val.toOrderedMap();
                    const id = val.get(idField);
                    //添加选中的字段
                    obj = obj.set("checked",defaulSelArr.includes(`${id}`));
                    return obj ;
                }else{
                    //数组
                    return val.toList();
                }
        });
    };
class TabList extends React.PureComponent<Props,States> implements ITabList{

      static  getDerivedStateFromProps(nextProps:Props,preState:States):Partial<States> | null {
        if(nextProps.data!==preState.preData || nextProps.initSelectVal!==preState.preInitSelect){
            const newData = nextProps.data;
            const {idField} = nextProps;
            const defaultSel = nextProps.initSelectVal ? nextProps.initSelectVal.id : nextProps.defaultSel!;
            const data= tableInitData(newData,defaultSel,idField);
            return {
                preData:newData,
                immutabData:data,
                selectArr:Immutable.List([]),
            };

        }else{
            return null ;
        }
    }

    fieldArr:ITabList['fieldArr'];
    fixObj:ITabList['fixObj'];
    tabMainTabBodyDomArr:HTMLDivElement[] = [];
    constructor(props:Props){
        super(props);
        const {children,data,idField,defaultSel,initSelectVal} = this.props;
        this.fieldArr = this.getFieldArr(children);

        const immutabData= tableInitData(data,defaultSel!,idField);
        this.fixObj = this.initFixObj();
        this.state = {
            immutabData,
            preData:data,
            selectArr:Immutable.List(),
            preInitSelect:initSelectVal
        };
        
    } 
    getFieldArr(arr:Props['children']){

       return React.Children.map(arr,function(val){

            const {children,forzen} = val.props ;
            let widTotal = 0;
            const child = React.Children.map(children,function(node){
                const {children,width,field,formatter} = node.props ;
                widTotal += width;
                return {
                    width,field,formatter,text:children
                };
            });

            return {
                child,
                width:widTotal,
                forzen
            };

        });     
    } 
    initFixObj(){
        const {tabField,idField,multiply,defaultSel,emptyTxt} = this.props;
        return {
            tabField:tabField!,
            emptyTxt:emptyTxt!,
            idField:idField!,
            multiply,
            defaultSel:defaultSel!,
        };
    } 
    setTabBodyDom=(dom:HTMLDivElement,index:number)=>{

        this.tabMainTabBodyDomArr[index] = dom ;
        
    }
    changeScrollTop=(top:number,index:number)=>{

        this.tabMainTabBodyDomArr.map((val,oindex)=>{
            if(oindex !== index){
                val.scrollTop = top;
            }
        });
    } 
    changeState:common['changeState']=(path,key)=>{
        // if(key==="expand"){
        //     this.expand(path);          
        // }else if(key==="active"){
        //     this.checkChild(path);
        // }else if(key==='checkPar'){
        //     this.checkPar(path);
        // }
    }
    viewMap(){
        const {} = this.props;
        const {immutabData} = this.state;
        return this.fieldArr.map((group,index)=>{
            return (
                <TabView
                    config={group} 
                    key={index}
                    setTabBodyDom={this.setTabBodyDom}
                    changeScrollTop={this.changeScrollTop}
                    data={immutabData}
                    viewIndex={index}
                    changeState={this.changeState}
                    fixObj={this.fixObj}
                />
            );
       });
    }
    render(){
        const {} = this.props;

        const {height} = this.props;
        return (
            <div className="treeTap-wrap" style={{height: height,}}>
                 <div className="treeTab">
                    {this.viewMap()}
                </div>
            </div>
           
        );
    }
}


export  {TabList,GroupCols};