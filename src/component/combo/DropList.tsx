/**
 * @name 列表下拉框
 * @description description
 * @time 2019-08-15
 */
import * as React from "react";
import wrapComboHQC from "./ComboBasic";
import * as Immutable from "immutable";
import { DropItem, activeStatus } from "./DropItem";
import {drop,ISelected} from "./combo";
import { Search } from "../input/index";

type props = drop<"list">;
type states = {
	immutableData: Immutable.List<IImmutalbeMap<node>>;
	singleClickPre:string; //单选时，记录上一次选择的
	preData:any[];
	preInitComboVal?:{id:string};
	asyncDefaultVal:boolean;// 用来识别异步请求下拉框数据时，第一次是空[],虽然给了默认值，但是不会选中什么，但是当第二次有了数据后，再用这个默认值去选中，但是之后就不再使用这个。
};
type node = {
	[key: string]: any;
	active: activeStatus;
};

interface IDropList {
	initState(props: props): states;
}

type formatterObj = {
	filedObj:props["filedObj"], data:props["data"], initSelect?:props["initSelect"]
};

//格式化数据，添加选中的字段 active ;
const formatterData = function(props: formatterObj,defaultVal:string) {
		const { filedObj, data, initSelect } = props;
		const id = filedObj.get("idField");
		const text = filedObj.get("textField");
		const multiply = filedObj.get("multiply");
		const defaultValArr = defaultVal.split(",");
		if (!multiply && defaultValArr.length > 1) {
			defaultValArr.length = 1;
		}
		//避免改变props里的data
		const copyData = JSON.parse(JSON.stringify(data));
		let listSelect: ISelected[] = [];
		let oldSelected = "";
		const _data = copyData.map((val: node, index: number) => {
			const isDefault = defaultValArr.includes(`${val[id]}`);
			val.active = isDefault
				? activeStatus.select
				: activeStatus.noSelect;
			//初始化默认选中的
			if (isDefault) {
				listSelect.push({ id: val[id], text: val[text] });
				if (!multiply) {
					//单选的时候，才会有上一次保留的节点的索引
					oldSelected = `${index}`;
				}
			}

			return val;
		});
		if (initSelect) {
			initSelect(Immutable.List(listSelect));
		}
		//重置上一次选择的索引
		//this.singleClickPre = oldSelected;
		return {
			data:Immutable.fromJS(_data),
			singleClickPre:oldSelected
		};
	};

const clickFn = function(index: string,props:props,state :states) {

		const { filedObj, selected, changeSelect } = props;
		const multipy = filedObj.get("multiply");
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const clickForbid = filedObj.get("clickOrCheckForbid");
		const comField = filedObj.get("field");
		let oldSelectedIndex = state.singleClickPre;
				
		const data = state.immutableData;

				let _data = data;
				let _select = selected;
				let newNode: IImmutalbeMap<node> = _data.getIn([index]);
				if(!newNode){
					return undefined;
				}
				//判断是否禁止编辑
				if (clickForbid(newNode,comField)) {
						return undefined;
				}

				//单选清除以前选中的
				if (!multipy) {
					if (oldSelectedIndex === index) {
						//点击的是同一个
						return {
							immutableData: _data,
						};
					}
					if (oldSelectedIndex) {
						_data = _data.updateIn(
							[oldSelectedIndex],
							(val: IImmutalbeMap<node>) => {
								return val && val.set("active", activeStatus.noSelect);
							}
						);
					}

					_select = _select.clear();
				}
				_data = _data.updateIn([index], (val: IImmutalbeMap<node>) => {
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
				// 改变父类的props
				changeSelect(_select, newNode);
				if (!multipy) {
					oldSelectedIndex = index;
				}
				return {
					data: _data,
					singleClickPre:oldSelectedIndex
				};
			
	};

class DropList extends React.PureComponent<props, states> implements IDropList {
	static getDerivedStateFromProps(nextProps:props,preState:states):null | Partial<states>{
		const {preData,preInitComboVal,asyncDefaultVal} = preState;
		if(nextProps.data !== preData){

			let defaultVal = "";
			if (nextProps.initComboVal !== preInitComboVal) {
				defaultVal = nextProps.initComboVal ? nextProps.initComboVal.id : "";
			} else {
				if (asyncDefaultVal) {
					defaultVal = nextProps.filedObj.get("defaultVal")!;
				} else {
					defaultVal = nextProps.selected.map(val => val.id).join(",");
				}
			}
			// 判断 initCOmVal有没改变，initComVal是完全只用这个值去初始化选择的。
			// 考虑异步请求的情况
			// 否则先保留之前选择的。
			// 当是单选时，存在一个问题，是要保留已经选择的还是用initComboVal?有时会同时改变数据和initComboVal!（比如新增一个下拉选项，并且要选中这个新的）

			const { filedObj,initSelect,data } = nextProps;
			const resObj = formatterData({ filedObj,data,initSelect },defaultVal);
			return {
				preData:nextProps.data,
				immutableData:resObj.data!,
				asyncDefaultVal: false,
				singleClickPre:resObj.singleClickPre!,
			};
		}else if(nextProps.initComboVal !== preInitComboVal){
			const defaultVal = nextProps.initComboVal ? nextProps.initComboVal.id : "";
			const { filedObj,initSelect,data } = nextProps;
			const resObj = formatterData({ filedObj,data,initSelect },defaultVal);
				return {
					preInitComboVal:nextProps.initComboVal,
					immutableData:resObj.data!,
					singleClickPre:resObj.singleClickPre
				};
		}

		// tslint:disable-next-line: no-null-keyword
		return null ;

	}
	state: states = this.initState(this.props);
	asyncDefaultVal = !!this.props.data.length; 
	constructor(props: props) {
		super(props);
		this.state = this.initState(props);
		//暴露点击方法
		const { clickMethod } = props;
		clickMethod(this.clikItem);
	}
	initState(props: props) {
		const {filedObj,data,initComboVal,initSelect} = props;
		const defaultVal = filedObj.get("defaultVal")!;
		const obj = formatterData({
			filedObj,data,initSelect
		},defaultVal);
		return {
			immutableData: obj.data! ,
			preData:data,
			preInitComboVal:initComboVal,
			singleClickPre:obj.singleClickPre,
			asyncDefaultVal:data.length===0,
		};
	}
	clear() {
		const { changeSelect, selected, filedObj } = this.props;
		let _selected = selected;
		const idField = filedObj.get("idField");

		this.setState(pre => {
			let _data = pre.immutableData;

			_data = _data.withMutations(list => {
				return list.map(val => {
					const has = _selected.find(
						select => `${select.id}` === `${val.get(idField)}`
					);

					if (has) {
						return val.set("active", activeStatus.noSelect);
					} else {
						return val;
					}
				});
			});

			return {
				immutableData: _data,
				singleClickPre:'',
			};
		});
		changeSelect(Immutable.List([]));
	}
	clikItem = (id?: string) => {
		if (!id) {
			this.clear();
			return;
		}
		const { immutableData } = this.state;
		const { filedObj } = this.props;
		const idField = filedObj.get("idField");
		const index = immutableData.findIndex(
			val => `${val.get(idField)}` === `${id}`
		);
		if (index !== -1) {
			this.clickFnForListMethod(`${index}`);
		}
	}

	clickFnForListMethod = (index: string) => {
		this.setState(pre => {

			const obj = clickFn(index,this.props,pre);
			
			if(obj){
				return {
					immutableData:obj.data!,
					singleClickPre:obj.singleClickPre!,
				};
			}else{
				// tslint:disable-next-line: no-null-keyword
				return null ;
			}
			
		});
		
	}
	closeFn = () => {
		const {data,selected,filedObj} = this.props;
		const defaultVal = selected.map(val=>val.id).join(",");
		const {data:immutableData, singleClickPre} = formatterData({filedObj,data},defaultVal);

		this.setState({
			immutableData,
			singleClickPre
		});
	}
	searchFn = (key: string) => {

		const { filedObj,data,selected } = this.props;
		const textField = filedObj.get("textField");
		let searchResult =  data.filter(val => val[textField].includes(key));
		
		const defaultVal = selected.map(val=>val.id).join(",");
		const {data:immutableData,singleClickPre} = formatterData({
			data: searchResult,filedObj
		},defaultVal);
		 this.setState({
			immutableData,
			singleClickPre,
		 });
	}
	render() {
		const { immutableData } = this.state;
		const { filedObj, dropStyle, formatterDropItem } = this.props;
		const idField = filedObj.get("idField");
		const noSearch = filedObj.get("noSearch");
		const com = immutableData.map((node, index) => {
			return (
				<DropItem
					key={node.get(idField)}
					clickFn={this.clickFnForListMethod}
					node={node}
					formatterDropItem={formatterDropItem}
					fieldObj={filedObj}
					index={`${index}`}
				/>
			);
		});
		const searchCom = !noSearch ? (
			<div style={{ paddingBottom: "0.5em",}}>
				<Search
					field="search"
					searchHandle={this.searchFn}
					closeHandle={this.closeFn}
				/>
			</div>
			) :undefined;
		return (
			<div className="drop-main">
				{searchCom}
				<ul style={dropStyle} className="drop-ul">
					{com}
				</ul>
			</div>
			
		);
	}
}

export default wrapComboHQC<"list">(DropList, "list");
