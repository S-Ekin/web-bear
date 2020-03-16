/**
 * @name name
 * @description description
 * @time 2020-03-09
 */
import * as React from "react";
import {GroupCols} from './GroupCols';
import TabView from './TabView';
import {formatterTreeData,activeStatus,cascade} from './formatterTreeData';
type common = MyTreeTabSpace.common;
type childType =React.ComponentElement<common['groupCol'],any> ;

type Props={
    data: any[];
    children: childType[] | childType;
    multiply?: boolean;
    itemIcon?: string;
    childField?:string;
	idField: string;//表格的节点标识
	defaultSel?: string;//默认选中的
	tabField?: string;//表格标识
	emptyTxt?: string;//空数据时显示文字
    getCheckFn?:(fn:any)=>void;//获取选中的
    initSelectVal?:{id:string};//通过外界改变表格的选中
    clickOrCheckForbid?:(node:IImmutalbeMap<any>,field:string)=>boolean;
    bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
};
type States={
    immutabData:IImmutalbeList<IImmutalbeMap<common['node']>>;
    selectArr:IImmutalbeList<string>;
    preData:any[];
};

type config = common['config'];
interface ITreeTable {
    fieldArr:config[];
    fixObj:common['fixObj'];
}
class TreeTable extends React.PureComponent<Props,States> implements ITreeTable{
    static defaultProps={
        idField:'id',
        childField:"children",
        defaultSel:'',
    };
    static  getDerivedStateFromProps(nextProps:Props,preState:States):Partial<States> | null {
        if(nextProps.data!==preState.preData){
            const newData = nextProps.data;
            const {idField,childField,multiply} = nextProps;
            const obj = formatterTreeData({
                idField,childField:childField!,multiply
            },nextProps.defaultSel!,newData);
            return {
                preData:newData,
                immutabData:obj.data,
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
        const {children,data,childField,idField,multiply,defaultSel} = this.props;
        this.fieldArr = this.getFieldArr(children);

        const obj = formatterTreeData({childField:childField!,idField,multiply},defaultSel!,data);
        this.fixObj = this.initFixObj();
        this.state = {
            immutabData:obj.data,
            preData:data,
            selectArr:obj.selectArr
        };
        
    }
    getFieldArr(arr:Props['children']){

       return React.Children.map(arr,function(val){

            const {children,width,forzen} = val.props ;

            const child = React.Children.map(children,function(node){
                const {children,width,field,formatter} = node.props ;
                return {
                    width,field,formatter,text:children
                };
            });

            return {
                child,
                width,
                forzen
            };

        });     
    }
    click(path:string){
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
                immutabData:pre.immutabData.updateIn(arr,(val:IImmutalbeMap<common['node']>)=>{
                    const expand = val.get('expand');
                    return val.set('expand',!expand);
                })
            };
        });
    }
    checkChild(path:string){
        const {childField,idField} = this.props;
        const {selectArr,immutabData} = this.state;
        const arr = path.split(',').join(`,${childField},`).split(',');
        let _select = selectArr;

        let newNode = immutabData.getIn(arr);
        //错误兼容
        if(!newNode){
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
        const {childField} = this.props;
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
		this.setState(pre => {
			const data = pre.immutabData;

			let _data = data;
			_data = _data.updateIn(indexArr, (val: IImmutalbeMap<common['node']>) => {
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
    changeState:common['changeState']=(path,key)=>{
        if(key==="expand"){
            this.click(path);          
        }else if(key==="active"){
            this.checkChild(path);
        }else if(key==='checkPar'){
            this.checkPar(path);
        }
    }
    initFixObj(){
        const {tabField,idField,multiply,defaultSel,childField,emptyTxt,itemIcon} = this.props;
        return {
            tabField,emptyTxt,itemIcon,
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
    render(){
        return (
            <div className="treeTap-wrap">
                 <div className="treeTab">
                    {this.viewMap()}
                </div>
            </div>
           
        );
    }
}


export  {TreeTable , GroupCols};