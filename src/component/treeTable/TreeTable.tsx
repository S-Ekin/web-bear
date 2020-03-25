/**
 * @name name
 * @description description
 * @time 2020-03-09
 */
import * as React from "react";
import {GroupCols} from './GroupCols';
import TabView from './TabView';
import {formatterTreeData,activeStatus,cascade} from './formatterTreeData';
import {ICommon} from "./mytreeTable";
type childType =React.ComponentElement<ICommon['groupCol'],any> ;

type Props={
    data: any[];
    children: childType[] | childType;
    noOrder?:boolean;
    height?:number;
    multiply?: boolean;
    itemIcon?: string;
    childField?:string;
	idField: string;//表格的节点标识
	defaultSel?: string;//默认选中的
	tabField?: string;//表格标识
	emptyTxt?: string;//空数据时显示文字
    getCheckFn?:(fn:any)=>void;//获取选中的
    initSelectVal?:{id:string};//通过外界改变表格的选中
    clickOrCheckForbid?:(node:IImmutalbeMap<any>,field?:string)=>boolean;
    bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
};
type States={
    immutabData:IImmutalbeList<IImmutalbeMap<ICommon['node']>>;
    selectArr:IImmutalbeList<string>;
    preData:any[];
    preInitSelect?:{id:string}
};

type config = ICommon['config'];
interface ITreeTable {
    fieldArr:config[];
    fixObj:ICommon['fixObj'];
}
const compareFn = (a:number,b:number)=>a-b;
class TreeTable extends React.PureComponent<Props,States> implements ITreeTable{
    static defaultProps={
        idField:'id',
        childField:"children",
        defaultSel:'',
    };
    static  getDerivedStateFromProps(nextProps:Props,preState:States):Partial<States> | null {
        if(nextProps.data!==preState.preData || nextProps.initSelectVal!==preState.preInitSelect){
            const newData = nextProps.data;
            const {idField,childField,multiply} = nextProps;
            const defaultSel = nextProps.initSelectVal ? nextProps.initSelectVal.id : nextProps.defaultSel!;
            const obj = formatterTreeData({
                idField,childField:childField!,multiply
            },defaultSel,newData);
            return {
                preData:newData,
                immutabData:obj.data,
                preInitSelect:nextProps.initSelectVal,
                selectArr:obj.selectArr
            };

        }else{
            return null ;
        }
    }
    
    fixObj:ITreeTable['fixObj'];
    tabMainTabBodyDomArr:HTMLDivElement[] = [];
    fieldArr:ITreeTable['fieldArr'];
    constructor(props:Props){
        super(props);
        const {children,data,childField,idField,multiply,defaultSel,initSelectVal} = this.props;
        this.fieldArr = this.getFieldArr(children);

        const obj = formatterTreeData({childField:childField!,idField,multiply},defaultSel!,data);
        this.fixObj = this.initFixObj();
        this.state = {
            immutabData:obj.data,
            preData:data,
            selectArr:obj.selectArr,
            preInitSelect:initSelectVal
        };
        
    }
    getFieldArr(arr:Props['children']){

        const {noOrder} = this.props;

       return React.Children.map(arr,function(val,index){

            const {children,forzen} = val.props ;
            let widTotal = 0 ;

            const child = React.Children.map(children,function(node){
                const {children,width,field,formatter,align} = node.props ;
                widTotal += width ;
                return {
                    width,field,formatter,text:children,align
                };
            });
            if(index === 0 && !noOrder){
                const orderGroup:any = {
                      width:60,
                      field:"order",
                      text:'序号' ,
                      formatter:undefined, 
                      align:'center'
                   };
                   child.unshift(orderGroup); 
                   widTotal+=60;
            }

            return {
                child,
                width:widTotal,
                forzen
            };

        });     
    }
    expand(path:string){
        const {childField} = this.props;
        const arr = path.split(',').join(`,${childField},`).split(',');
        const {immutabData} = this.state;
        let newNode = immutabData.getIn(arr);
        //错误兼容
        if(!newNode){
            return ;
        }
       
        this.setState(pre=>{
            return{
                immutabData:pre.immutabData.updateIn(arr,(val:IImmutalbeMap<ICommon['node']>)=>{
                    const expand = val.get('expand');
                    return val.set('expand',!expand);
                })
            };
        });
    }
    checkChild(path:string){
        const {childField,idField,clickOrCheckForbid,tabField} = this.props;
        const {selectArr,immutabData} = this.state;
        const arr = path.split(',').join(`,${childField},`).split(',');
        let _select = selectArr;

        let newNode = immutabData.getIn(arr);
        //错误兼容
        if(!newNode){
            return ;
        } 
        
        if(clickOrCheckForbid && clickOrCheckForbid(newNode,tabField)){
            return ;
        }
        this.setState(pre=>{

            let data = pre.immutabData;
            data = data.updateIn(arr,val=>{
                const active = val.get('active') === activeStatus.noSelect? 
                activeStatus.select : activeStatus.noSelect;

                if (active === activeStatus.select) {
                    const idVal = val.get(idField) as string;
					_select = _select.push(idVal);
				} else {
					_select = _select.filter(_val => {
						return _val !== val.get(idField);
					});
                }
                
                return val.set('active',active);
            });
            data = cascade(path,data,childField!);
            return {
                immutabData:data,
                selectArr:_select
            };
        });
        
    }   
    mapFn(
		list: IImmutalbeList<IImmutalbeMap<any>>,
		active: activeStatus,
		select: IImmutalbeList<string>,
	) {
		let _select = select;
		const { idField, childField } = this.props;
		const arr = list.map(val => {
			let _child = val.get(childField!) as IImmutalbeList<
				IImmutalbeMap<any>
			>;
			let _node = val;
			if (_child.size) {
				const result = this.mapFn(_child, active, _select);
				_node = _node.set(childField!, result.arr);
				//改变select
				_select = result.selecte;
			} else {
				if (active === activeStatus.select) {
					//清除之前选的这个，现在再选一次这个接着最后，保证选择的顺序
					if (_node.get("active") === activeStatus.select) {
						_select = _select.filter(_val => {
							return _val !== _node.get(idField);
						});
					}

					_select = _select.push( _node.get(idField));
				} else {
					_select = _select.filter(_val => {
						return _val !== _node.get(idField);
					});
				}
			}
			return _node.set("active", active);
		});

		return {
			arr: arr,
			selecte: _select,
		};
	}
    checkPar(path:string){
        const {childField,tabField,clickOrCheckForbid} = this.props;
        const {selectArr,immutabData} = this.state;
		const indexArr = path
			.split(",")
			.join(`,${childField},`)
			.split(",");
       let _select = selectArr;
       let newNode = immutabData.getIn(indexArr);
        //错误兼容
        if(!newNode){
            return ;
        }
        if(clickOrCheckForbid && clickOrCheckForbid(newNode,tabField)){
            return ;
        }
		this.setState(pre => {
			const data = pre.immutabData;

			let _data = data;
			_data = _data.updateIn(indexArr, (val: IImmutalbeMap<ICommon['node']>) => {
				//判断这个node有没有被选中
				let node = val;
				const active =
					node.get("active") === activeStatus.select
						? activeStatus.noSelect
						: activeStatus.select;

				//选中所有的子文件
				node = node.withMutations(map => {
					let _child = map.get(childField!) as IImmutalbeList<
						IImmutalbeMap<any>
					>;
					let _map = map;

					const result = this.mapFn(_child, active, selectArr);
					_map = _map.set(childField!, result.arr);
	                //改变selecte
					_select = result.selecte;
					_map = _map.set("active", active);

					return _map;
				});
				newNode = node;
				return node;
			});
            _data = cascade(path, _data, childField!);
            
			return {
                immutabData: _data,
                selectArr:_select,
			};
		});
    }
    changeState:ICommon['changeState']=(path,key)=>{
        if(key==="expand"){
            this.expand(path);          
        }else if(key==="active"){
            this.checkChild(path);
        }else if(key==='checkPar'){
            this.checkPar(path);
        }
    }
    initFixObj(){
        const {tabField,idField,multiply,defaultSel,childField,emptyTxt,itemIcon,noOrder} = this.props;
        return {
            tabField,emptyTxt,itemIcon,noOrder,
            idField,multiply,defaultSel,childField:childField!,
        };
    }
    changeScrollTop=(top:number,index:number)=>{

        this.tabMainTabBodyDomArr.map((val,oindex)=>{
            if(oindex !== index){
                val.scrollTop = top;
            }
        });
    }
    viewMap(){
        const {} = this.props;
        const {immutabData} = this.state;
        return this.fieldArr.map((group,index)=>{
            return (
                <TabView
                    config={group} 
                    setTabBodyDom={this.setTabBodyDom}
                    key={index}
                    changeScrollTop={this.changeScrollTop}
                    data={immutabData}
                    viewIndex={index}
                    changeState={this.changeState}
                    fixObj={this.fixObj}
                />
            );
       });
    }
    setTabBodyDom=(dom:HTMLDivElement,index:number)=>{

        this.tabMainTabBodyDomArr[index] = dom ;
        
    } 
    setTabViewBottomFixHeight(){
        const arr = this.fieldArr;
        const res = this.tabMainTabBodyDomArr.findIndex((val,index)=>{
            let status = false ;
            if(!arr[index].forzen){ //有横的滚动条
              status =   val.scrollWidth > val.clientWidth ;
            }

           return status ;

        });

        if(res !== -1){
            this.tabMainTabBodyDomArr.forEach((val,index)=>{

                if(arr[index].forzen){
                    val.classList.add('tab-over-wid');
                }else if (res!== index){
                    if(val.scrollWidth <= val.clientWidth){
                        val.classList.add('tab-over-wid');
                    }
                }
            });
        }else{
            this.tabMainTabBodyDomArr.forEach((val)=>{
                val.classList.remove('tab-over-wid');
            });
        }
    }
    componentDidMount(){
      this.setDom();
    }
    //比对所有区域的高度，设置为一样高
    setSameH(){
        let domArr = this.tabMainTabBodyDomArr;
        
        if(domArr.length < 2){
            return ;
        }   
      
        this.mapDom(domArr);

    }
    setDom(){
        this.whileDomH();
        this.setTabViewBottomFixHeight();//  this.setSameH();
    }
    mapDom(domArr:HTMLDivElement[]){
        
        const tableArr = domArr.map(val=>val.firstElementChild!);
        const tabHArr = tableArr.map(val=>val.clientHeight).sort(compareFn);
        
        if(tabHArr[0] !== tabHArr[tabHArr.length-1]){ // 高度不同

            let viewTrArr = tableArr.map(val=>{
                return val.lastElementChild!.children;
            });

            [...viewTrArr[0]].map((val,index)=>{

                const trHdom = viewTrArr.map(trArr=>{
                    return trArr[index];
                });
                const trH = trHdom.map(val=>val.clientHeight).sort(compareFn);
                const trHMax = trH[trH.length-1];

                if(trH[0]!== trHMax){ // 高度不同
                    if(val.classList.contains('tree-td')){
                        const domArr = trHdom.map(val=>{
                            return val.firstChild!.firstChild! as HTMLDivElement;
                        });
                        this.mapDom(domArr);
                            
                    }else{
                            //设置高度
                            trHdom.forEach(tr=>{
                                [...tr.children].forEach(td=>{

                                    (td as HTMLTableCellElement).style.height = `${trHMax}`+"px";
                                });
                            });
                        }
                    }
            });
        }
    }
    //用while代替递归
    whileDomH () {
        const rootRoot = this.tabMainTabBodyDomArr;
        let domArr = [rootRoot] ;

        while (domArr.length) {
         
           const contains:any[] = [];
           domArr.forEach(arr=>{

                const tabDomArr =  arr.map(val=>{
                  return val.firstElementChild!;
                });

                const tabHArr = tabDomArr.map(val=>{
                    return val.clientHeight;
                }).sort(compareFn);
                const maxH = tabHArr[tabHArr.length-1];

                if(tabHArr[0]!==maxH){ // 高度不同
                    // tslint:disable-next-line: variable-name
                    const trArr_Arr = tabDomArr.map(val=>{
                            return val.lastElementChild!.children;
                    });

                    [...trArr_Arr[0]].forEach((tr,index)=>{

                        const trDomArr = trArr_Arr.map(trArr=>{
                            return trArr[index];
                        });

                        const trHArr = trDomArr.map(val=>{
                            return val.clientHeight;
                        }).sort(compareFn);

                        const trHMax = trHArr[trHArr.length-1];
                        if(tr.classList.contains('tree-td')){
                           const childDomArr = trDomArr.map(val=>{
                                return val.firstChild!.firstChild!;
                            });
                            contains.push(childDomArr);
                        }else{
                            trDomArr.forEach(val=>{
                                (val as HTMLElement).style.height = `${trHMax}px`;
                            });
                        }
                    });
                }
           });    
           
           domArr = contains;
        }
    }
    render(){
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


export  {TreeTable , GroupCols};