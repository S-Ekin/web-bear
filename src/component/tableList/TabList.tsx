/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import * as Immutable from "immutable";
import TabView from './TabView';
import {GroupCols} from './GroupCols';
import {Empty} from "../icon/index";
type common =MyTabListSpace.common;
type childType =React.ComponentElement<common['groupCol'],any> ;
type Props={
	data: any[];
    children: childType[] | childType;
    height?:number;
    noOrder?:boolean;
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
    static defaultProps = {
        height:300
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
        const {noOrder,multiply} = this.props;
       return React.Children.map(arr,function(val,index){

            const {children,forzen,} = val.props ;
            let widTotal = 0;
            const child = React.Children.map(children,function(node){
                const {children,width,field,formatter,align} = node.props ;
                widTotal += width;
                return {
                    width,field,formatter,text:children,align
                };
            });

           
            if(!noOrder && index === 0){
                  const orderCol:any = {
                      width:60,
                      field:"order",
                      text:'序号' ,
                      formatter:undefined, 
                      align:'center'
                   };
                   child.unshift(orderCol); 
                   widTotal+=60;
            }
            if(multiply && index === 0 ){
                 const checkCol:any = {
                      width:60,
                      field:"check",
                      text:'全选' ,
                      formatter:undefined, 
                      align:'center'
                   };
                   child.unshift(checkCol); 
                   widTotal+=60;
            }
            
            return {
                child,
                width:widTotal,
                forzen
            };

        });     
    } 
    initFixObj(){
        const {tabField,idField,multiply,defaultSel,emptyTxt,noOrder} = this.props;
        return {
            tabField:tabField!,
            emptyTxt:emptyTxt!,
            idField:idField!,
            multiply,
            noOrder,
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
        const index = ~~path - 1 ;
        if(key==='active'){
            this.setState(pre=>{
                return {
                    immutabData:pre.immutabData.updateIn([index],node=>{

                        const status = node.get('checked');

                        return node.set('checked',!status)
                    })
                }
            })
        }
       
        
    }
    //比对所有区域的高度，设置为一样高
    setSameH(){
        let domArr = this.tabMainTabBodyDomArr;
        
        if(domArr.length < 2){
            return ;
        }   
      
       const tabDom = domArr.map(val=>{
            return val.firstElementChild!;
        });

        const tabHArr = tabDom.map(val=>val.clientHeight).sort();
        const tabHMax = tabHArr[tabHArr.length - 1];
        if(tabHArr[0]!== tabHMax){

            const trDomArr = tabDom.map(val=>val.lastElementChild!.children);

            [...trDomArr[0]].forEach((val,index)=>{

                const trCompareDom = trDomArr.map(val=>{

                    return val[index];
                });

                const trHArr = trCompareDom.map(val=>val.clientHeight).sort();
                const trHMax = trHArr[trHArr.length -1];
                if(trHMax !== trHArr[0]){
                    trCompareDom.forEach(element => {
                            [...(element as HTMLTableRowElement).children]!.forEach(td => {
                                    
                                (td as HTMLTableCellElement).style.height = `${trHMax}px`

                            });
                    });
                }




            })

        }


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
    componentDidMount(){
        this.setSameH();

        this.setTabViewBottomFixHeight();
    }
    setTabViewBottomFixHeight(){
        const arr = this.fieldArr;
        const res = this.tabMainTabBodyDomArr.findIndex((val,index)=>{
            let status = false ;
            if(!arr[index].forzen){ //有横的滚动条
              status =   val.scrollWidth > val.clientWidth ;
            }

           return status ;

        })

        if(res !== -1){
            this.tabMainTabBodyDomArr.forEach((val,index)=>{

                if(arr[index].forzen){
                    val.style.paddingBottom = '17px'
                }else if (res!== index){
                    if(val.scrollWidth <= val.clientWidth){
                        val.style.paddingBottom = '17px'
                    }
                }
            })
        }
    }
    render(){
        const {height,emptyTxt,} = this.props;
        const {immutabData} = this.state;
        const hasData = !!immutabData.size;
        const body =  hasData ? this.viewMap() : <Empty txt={emptyTxt} />
        return (
            <div className="treeTap-wrap" style={{height: height,}}>
                 <div className="treeTab">
                    {body}
                </div>
            </div>
           
        );
    }
}


export  {TabList,GroupCols};