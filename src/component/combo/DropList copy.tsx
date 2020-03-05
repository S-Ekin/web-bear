/**
 * @name 列表下拉框
 * @description description
 * @time 2019-08-15
 */
import * as React from "react";
import wrapComboHQC from "./ComboBasic";
import * as Immutable from "immutable";
import { DropItem, activeStatus } from "./DropItem";

type props = ComboSpace.drop<"list">;
type states = {
	immutableData: Immutable.List<IImmutalbeMap<node>>;
	preData:any[];
	preInitComboVal?:{id:string};
};
type node = {
	[key: string]: any;
	active: activeStatus;
};

interface IDropList {
	singleClickPre: string; //单选时，baocun之前选择的
	initState(props: props): states;
	//格式化数据，添加选中的字段 active ;
	formatterData(props: props,defaultVal:string): Immutable.List<IImmutalbeMap<node>>;
	//点击的时候改变数据
	componentWillReceiveProps(props: props): void;
}

class DropList extends React.PureComponent<props, states> implements IDropList {
	
	singleClickPre = "";
	state: states = this.initState(this.props);
	constructor(props: props) {
		super(props);
		this.state = this.initState(props);
		//暴露点击方法
		const { clickMethod } = props;
		clickMethod(this.clikItem);
	}
	initState(props: props) {
		const {filedObj,data,initComboVal} = props;
		const defaultVal = filedObj.get("defaultVal")!;
		return {
			immutableData: this.formatterData(props,defaultVal),
			preData:data,
			preInitComboVal:initComboVal
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

			this.singleClickPre = ""; //清空之前选中的存储值
			return {
				immutableData: _data,
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
			this.clickFn(`${index}`);
		}
	}
	formatterData(props: props,defaultVal:string) {
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
		let listSelect: ComboSpace.Iselected[] = [];
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
		initSelect(Immutable.List(listSelect));
		//重置上一次选择的索引
		this.singleClickPre = oldSelected;
		return Immutable.fromJS(_data);
	}

	componentWillReceiveProps(nextProps: props) {
		if (nextProps.data !== this.props.data) {
			let initComboVal:any = nextProps.initComboVal ;
				initComboVal = initComboVal ? initComboVal.id :"";

			this.setState({
				immutableData: this.formatterData(nextProps,`${initComboVal}`),
			});
		}else if(nextProps.initComboVal!==this.props.initComboVal){
			let id = nextProps.initComboVal ? nextProps.initComboVal.id :"";
			this.clikItem(`${id}`);
		}
	}

	clickFn(index: string) {
		const { filedObj, selected } = this.props;
		const multipy = filedObj.get("multiply");
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const clickForbid = filedObj.get("clickOrCheckForbid");
		const comField = filedObj.get("field");
		let oldSelectedIndex = this.singleClickPre;
		this.setState(
			pre => {
				const data = pre.immutableData;

				let _data = data;
				let _select = selected;
				let newNode: IImmutalbeMap<node> = _data.getIn([index]);
				if(!newNode){
					return null ;
				}
				//判断是否禁止编辑
				if (clickForbid(newNode,comField)) {
						return null;
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

				this.props.changeSelect(_select, newNode);
				if (!filedObj.get("multiply")) {
					this.singleClickPre = index;
				}
				return {
					immutableData: _data,
				};
			}
		);
	}

	clickFnForListMethod = (index: string) => {
		this.clickFn(index);
	}
	render() {
		const { immutableData } = this.state;
		const { filedObj, dropStyle, formatterDropItem } = this.props;
		const idField = filedObj.get("idField");
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
		return (
			<ul style={dropStyle} className="drop-ul">
				{com}
			</ul>
		);
	}
}

export default wrapComboHQC<"list">(DropList, "list");
