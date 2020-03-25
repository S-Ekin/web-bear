/**
 * @name 树形下拉框
 * @description description
 * @time 2019-08-17
 */
import * as React from "react";
import * as Immutable from "immutable";
import { activeStatus, DropItem } from "./DropItem";
import ParTreeItem from "./ParTreeItem";
import wrapComboHQC from "./ComboBasic";
import { CheckBox, Search } from "../input/index";
import {formatterTreeData,cascade} from './formatterTreeData';
import {drop,ISelected} from "./combo";
type props = drop<"tree">;
type states = {
	immutableData: Immutable.List<IImmutalbeMap<node>>;
	preData:any[];
	preInitComboVal:props['initComboVal'] ;
	oldSelectedIndex:string;
};
type node = {
	[key: string]: any;
	active: activeStatus;
	expand: boolean;
};

interface IDropTree {
	initState(props: props): states;
}
class DropTree extends React.PureComponent<props, states> implements IDropTree {

	static  getDerivedStateFromProps(nextProps:props,preState:states):Partial<states> | null {

		if (nextProps.data !== preState.preData || nextProps.initComboVal!==preState.preInitComboVal) {

			let initComboVal:any = nextProps.initComboVal ;
				initComboVal = initComboVal ? initComboVal.id :"";
			const {data,oldSelectedIndex} = formatterTreeData(nextProps,`${initComboVal}`,nextProps.data);
			return {
				immutableData:data ,
				oldSelectedIndex,
				preData:nextProps.data,
				preInitComboVal:nextProps.initComboVal
			};
		}else{
			return null ;
		}
	}
	constructor(props:props){
		super(props);
		this.state= this.initState(props);
		const { clickMethod } = props;
		clickMethod(this.clickItem);
	}
	initState(props: props):states {
		const defaultVal = props.filedObj.get("defaultVal") || "";
		const obj = formatterTreeData(props,defaultVal,props.data);
		return {
			immutableData: obj.data ,
			preData:props.data,
			preInitComboVal:props.initComboVal,
			oldSelectedIndex:obj.oldSelectedIndex
		};
	}
	
	clear(){
		const {data,oldSelectedIndex} = formatterTreeData(this.props,"",this.props.data);
		
		this.setState({
			immutableData:data,
			oldSelectedIndex
		});

	}
	clickItem=(id?:string)=>{
		if(!id){
			this.clear();
		}else{
			// 重新把数据格式化一篇得原因是，清楚已经选的，只选择传入得id，
			const {data,oldSelectedIndex} = formatterTreeData(this.props,id,this.props.data);
			this.setState({
				immutableData:data,
				oldSelectedIndex,
			});
		}

	}
	searchMap(
		data: any[],
		childField: string,
		key: string,
		textField: string
	):any[] {
		return data.filter(val=>{

			const itemText = val[textField] as string;
			const isContainer = itemText.includes(key);
			const child  = val[childField] as any[];
			
			if(child && child.length){

				if(isContainer){
					return true ;
				}else{
					const arr = this.searchMap(child,childField,key,textField);
					val[childField] = arr ;
					return arr.length ;
				}
			}else{

				return isContainer;
			}
		});
	}
	searchFn = (key: string) => {

		const { filedObj,data,selected } = this.props;
		const childField = filedObj.get("childField")!;
		const textField = filedObj.get("textField");
		const copyData = JSON.parse(JSON.stringify(data));
		let searchReswult = this.searchMap(copyData,childField,key,textField);
		
		const defaultVal = selected.map(val=>val.id).join(",");
		const {data:immutableData,oldSelectedIndex} = formatterTreeData(this.props,defaultVal,searchReswult,true);
		 this.setState({
			immutableData,
			oldSelectedIndex,
		 });
	}

	clickFnForTreeMethod=(path:string)=>{
		this.clickFn(path);
	}

	clickFn(index: string){
		const { filedObj, selected,changeSelect } = this.props as props;
		const multipy = filedObj.get("multiply");
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const childField = filedObj.get("childField");
		const clickForbid = filedObj.get("clickOrCheckForbid")!;
		const comField = filedObj.get("field");
		const indexArr = index
			.split(",")
			.join(`,${childField},`)
			.split(",");
		const indexArrString = indexArr.join(",");
		this.setState(
			pre => {
				const data = pre.immutableData;

				let oldSelectedIndex = pre.oldSelectedIndex;
				let _data = data;
				let _select = selected;
				let newNode: IImmutalbeMap<node> = _data.getIn(indexArr);
				if(!newNode){
					return null;
				}
				//判断是否禁止点击
				if (clickForbid(newNode,comField)) {
					return null;
				}
				//单选清除以前选中的
				if (oldSelectedIndex === indexArrString) {
					//点击的是同一个
					return null ;
				}
				if (oldSelectedIndex) {
					_data = _data.updateIn(
						oldSelectedIndex.split(","),
						(val: IImmutalbeMap<node>) => {
							return val.set("active", activeStatus.noSelect);
						}
					);
				}
				_select = _select.clear();
				_data = _data.updateIn(indexArr, (val: IImmutalbeMap<node>) => {
					//判断这个node有没有被选中
					const active =
						val.get("active") === activeStatus.select
							? activeStatus.noSelect
							: activeStatus.select;

					if (active === activeStatus.select) {
						_select = _select.push({
							id: val.get(idField),
							text: val.get(textField),
						});
					} else {
						if (multipy) {
							_select = _select.filter(_val => {
								return _val.id !== val.get(idField);
							});
						}
					}
					const node = val.set("active", active);
					newNode = node;
					return node;
				});

				changeSelect(_select, newNode);
				return {
					immutableData: _data,
					oldSelectedIndex: indexArrString
				};
			}
		);
	}
	checkMethod=(path:string)=>{
		this.checkFn(path);
	}
	checkFn(value: string){
		const { filedObj, selected } = this.props;

		const childField = filedObj.get("childField")!;
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const clickForbid = filedObj.get("clickOrCheckForbid")!;
		const comField = filedObj.get("field");
		const indexArr = value
			.split(",")
			.join(`,${childField},`)
			.split(",");

		this.setState(pre => {
			const data = pre.immutableData;

			let _data = data;
			let _select = selected;
			let newNode = _data.getIn(indexArr);
			if(!newNode){
				return null;
			}
			//判断是否禁止点击
			if(clickForbid(newNode,comField)){
				return null;
			}

			_data = _data.updateIn(indexArr, (val: IImmutalbeMap<node>) => {
				//判断这个node有没有被选中
				const active =
					val.get("active") === activeStatus.select
						? activeStatus.noSelect
						: activeStatus.select;

				if (active === activeStatus.select) {
					_select = _select.push({
						id: val.get(idField),
						text: val.get(textField),
					});
				} else {
					_select = _select.filter(_val => {
						return _val.id !== val.get(idField);
					});
				}
				const node = val.set("active", active);
				newNode = node;
				return node;
			});
			_data = cascade(value, _data, childField);
			this.props.changeSelect(_select, newNode);

			return {
				immutableData: _data,
			};
		});
	}
	mapFn(
		list: IImmutalbeList<IImmutalbeMap<any>>,
		active: activeStatus,
		select: IImmutalbeList<ISelected>,
		filedObj: {
			idField: string;
			textField: string;
			childField: string;
		}
	) {
		let _select = select;
		const { idField, childField, textField } = filedObj;
		const arr = list.map(val => {
			let _child = val.get(childField) as IImmutalbeList<
				IImmutalbeMap<any>
			>;
			let _node = val;
			if (_child.size) {
				const result = this.mapFn(_child, active, _select, filedObj);
				_node = _node.set(childField, result.arr);
				//改变select
				_select = result.selecte;
			} else {
				if (active === activeStatus.select) {
					//清除之前选的，现在再选一次，保证选择的顺序
					if (_node.get("active") === activeStatus.select) {
						_select = _select.filter(_val => {
							return _val.id !== _node.get(idField);
						});
					}

					_select = _select.push({
						id: _node.get(idField),
						text: _node.get(textField),
					});
				} else {
					_select = _select.filter(_val => {
						return _val.id !== _node.get(idField);
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
	checkForPar=(value:string)=>{
		this.checkForParFn(value);
	}
	checkForParFn(value: string){
		const { filedObj, selected } = this.props;
		const childField = filedObj.get("childField")!;
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const clickForbid = filedObj.get("clickOrCheckForbid")!;
		const comField = filedObj.get("field");
		const indexArr = value
			.split(",")
			.join(`,${childField},`)
			.split(",");

		this.setState(pre => {
			const data = pre.immutableData;

			let _data = data;
			let _select = selected;
			let newNode = _data.getIn(indexArr);

			if(!newNode){
				return null;
			}
			//判断是否禁止点击
			if(clickForbid(newNode,comField,selected)){
				return null;
			}
			_data = _data.updateIn(indexArr, (val: IImmutalbeMap<node>) => {
				//判断这个node有没有被选中
				let node = val;
				const active =
					node.get("active") === activeStatus.select
						? activeStatus.noSelect
						: activeStatus.select;

				//选中所有的子文件
				node = node.withMutations(map => {
					let _child = map.get(childField) as IImmutalbeList<
						IImmutalbeMap<any>
					>;
					let _map = map;

					const result = this.mapFn(_child, active, selected, {
						idField,
						childField,
						textField,
					});
					_map = _map.set(childField, result.arr);

					_map = _map.set("active", active);

					//改变selecte
					_select = result.selecte;

					return _map;
				});
				newNode = node;
				return node;
			});
			_data = cascade(value, _data, childField);
			this.props.changeSelect(_select, newNode);

			return {
				immutableData: _data,
			};
		});
	}
	closeFn = () => {
		const {data,selected} = this.props;
		const defaultVal = selected.map(val=>val.id).join(",");
		const {data:immutableData,oldSelectedIndex} = formatterTreeData(this.props,defaultVal,data,true);

		this.setState({
			immutableData,
			oldSelectedIndex
		});
	}
	toggleExpand = (index: string) => {
		const { filedObj } = this.props;
		let indexArr: any = index.split(",");
		indexArr = indexArr.join(`,${filedObj.get("childField")},`);
		indexArr = indexArr.split(",");

		this.setState(pre => {
			const data = pre.immutableData;
			const _data = data.updateIn(
				indexArr,
				(node: IImmutalbeMap<node>) => {

					if(!node){
						return ;
					}
					const expand = !node.get("expand");
					const _node = node.set("expand", expand);

					return _node;
				}
			);

			return {
				immutableData: _data,
			};
		});
	}
	render() {
		const { immutableData } = this.state;
		const { filedObj, dropStyle ,formatterDropItem} = this.props;
		const idField = filedObj.get("idField");
		const childField = filedObj.get("childField");
		const multiply = filedObj.get("multiply");

		const com = immutableData.map((node, index) => {
			const child = node.get(childField!) as states["immutableData"];
			const id = node.get(idField);
			return child.size ? (
				<ParTreeItem
					key={id}
					node={node}
					fieldObj={filedObj}
					clickFn={this.clickFnForTreeMethod}
					index={`${index}`}
					lev={0}
					formatterDropItem={formatterDropItem}
					checkForPar={this.checkForPar}
					checkMethod={this.checkMethod}
					toggleExpand={this.toggleExpand}
				/>
			) : (
				<DropItem
					key={id}
					node={node}
					fieldObj={filedObj}
					index={`${index}`}
					checkMethod={this.checkMethod}
					formatterDropItem={formatterDropItem}
					lev={0}
					clickFn={this.clickFnForTreeMethod}
					CheckBox={multiply ? CheckBox : undefined}
				/>
			);
		});
		return (
			<>
				<div style={{ paddingBottom: "0.5em",}}>
					<Search
						field="search"
						searchHandle={this.searchFn}
						closeHandle={this.closeFn}
					/>
				</div>
				<ul style={dropStyle} className="drop-ul">
					{com}
				</ul>
			</>
		);
	}
}
export {DropTree};
export default wrapComboHQC<"tree">(DropTree, "tree");
