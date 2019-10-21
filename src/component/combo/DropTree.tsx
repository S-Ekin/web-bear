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
type props = ComboSpace.drop<"tree">;
type states = {
	immutableData: Immutable.List<IImmutalbeMap<node>>;
};
type node = {
	[key: string]: any;
	active: activeStatus;
	expand: boolean;
};

interface IDropTree {
	oldSelectedIndex: string;
	searchPreData: undefined | states["immutableData"];
	initState(props: props): states;
	//格式化数据，添加选中的字段 active ;
	formatterData(props: props): Immutable.List<IImmutalbeMap<node>>;
	//点击的时候改变数据

	componentWillReceiveProps(props: props): void;
}
class DropTree extends React.PureComponent<props, states> implements IDropTree {
	oldSelectedIndex = "";
	searchPreData: IDropTree["searchPreData"] = undefined;
		constructor(props:props){
		super(props);

		this.state= this.initState(props);
		//暴露点击方法
		const {clickMethod} = props;
		if(clickMethod){
			clickMethod(this.clickItem);
		}
	}
	initState(props: props) {
		return {
			immutableData: this.formatterData(props),
		};
	}
	
	clear(){
		
		this.setState({
			immutableData:this.initState(this.props).immutableData
		});

	}
	clickItem=(id?:string)=>{
		if(!id){
			this.clear();
		}else{
			console.log(1);
		}

	}
	formatterData(props: props) {
		const { filedObj, data, initSelect } = props;
		const id = filedObj.get("idField");
		const text = filedObj.get("textField");
		const childField = filedObj.get("childField");
		const defaultVal = `${filedObj.get("defaultVal")}`;
		let defaultValArr = defaultVal.split(",");

		const multiply = filedObj.get("multiply");
		if (!multiply && defaultValArr.length > 1) {
			defaultValArr.length = 1;
		}
		let oldSelectedIndex = "";
		const listSelected: ComboSpace.Iselected[] = [];

		const immutableData: states["immutableData"] = Immutable.fromJS(
			data as node[],
			function(_key, val, path) {
				if (Immutable.isKeyed(val)) {
					let node = (val as Immutable.Collection.Keyed<
						string,
						any
					>).toOrderedMap();
					let children = node.get(childField!) as Immutable.List<any>;
					if (!children) {
						children = Immutable.List([]);
						node = node.set(childField!, children);
					}
					//执行目录和文件两种情况 添加是否:expand展开和是否选中：active的状态
					let active: activeStatus;
					if (children.size) {
						if (multiply) {
							const hasSelected = children.some(
								(val: IImmutalbeMap<any>) => {
									return (
										val.get("active") ===
										activeStatus.hasSelect
									);
								}
							);

							if (hasSelected) {
								active = activeStatus.hasSelect;
							} else {
								let selectCount = children.reduce(
									(cur, val: IImmutalbeMap<any>) => {
										let total = cur;
										if (
											val.get("active") ===
											activeStatus.select
										) {
											total++;
										}

										return total;
									},
									0
								);
								const childSize = children.size;
								if (selectCount === childSize) {
									active = activeStatus.select;
								} else if (selectCount === 0) {
									active = activeStatus.noSelect;
								} else {
									active = activeStatus.hasSelect;
								}
							}
						} else {
							active = activeStatus.noSelect;
						}
					} else {
						const isDefault = defaultValArr.includes(
							`${node.get(id)}`
						);
						active = isDefault
							? activeStatus.select
							: activeStatus.noSelect;
						if (isDefault) {
							listSelected.push({
								id: node.get(id),
								text: node.get(text),
							});
							if (!multiply) {
								//记录单选时的索引
								oldSelectedIndex = path!.join(",");
							}
						}
					}
					//添加字段
					node = node.withMutations(map => {
						return map.set("active", active).set("expand", true);
					});
					return node;
				} else {
					return val.toList();
				}
			}
		);

		//重置之前选择的
		this.oldSelectedIndex = oldSelectedIndex;
		//显示默认选中的
		initSelect(Immutable.List(listSelected));
		return immutableData;
	}
	componentWillReceiveProps(nextProps: props) {
		if (nextProps.data !== this.props.data) {
			this.setState({
				immutableData: this.initState(nextProps).immutableData,
			});
		}
	}
	//级联选中
	cascade(
		pathIndex: string,
		data: states["immutableData"],
		childField: string
	) {
		let _data = data;
		let pathArr = pathIndex.split(",");
		pathArr.pop();

		_data = _data.withMutations(list => {
			let _list = list;

			//检查上一级的状态
			while (pathArr.length) {
				const path = pathArr.join(`,${childField},`).split(",");

				_list = _list.updateIn(path, node => {
					let _node = node;
					const child = _node.get(
						childField
					) as states["immutableData"];

					const hasSelect = child.some(
						val => val.get("active") === activeStatus.hasSelect
					);
					let active: activeStatus;
					if (hasSelect) {
						active = activeStatus.hasSelect;
					} else {
						const selectCount = child.reduce((cur, val) => {
							let total = cur;
							if (val.get("active") === activeStatus.select) {
								total++;
							}

							return total;
						}, 0);
						const childSize = child.size;

						if (selectCount === childSize) {
							active = activeStatus.select;
						} else if (selectCount === 0) {
							active = activeStatus.noSelect;
						} else {
							active = activeStatus.hasSelect;
						}
					}

					return _node.set("active", active);
				});

				//删除最后一个路径，获取上一级的节点
				pathArr.pop();
			}

			return _list;
		});

		return _data;
	}

	searchMap(
		data: states["immutableData"],
		childField: string,
		key: string,
		textField: string
	) {
		let arr: states["immutableData"] = data;

		data.forEach((_val, _key, iter) => {
			arr = iter.updateIn([_key], node => {
				const child = node.get(childField) as states["immutableData"];
				const isKey = (node.get(textField) as string).includes(key);
				let _node = node;
				if (child.size) {
					if (isKey) {
						return _node;
					} else {
						const _child = this.searchMap(
							child,
							childField,
							key,
							textField
						) as states["immutableData"];
						_node = _node.set(childField, _child);

						return _child.size ? _node : undefined;
					}
				} else {
					return isKey ? _node : undefined;
				}
			});
		});

		return arr;
	}
	searchFn = (key: string) => {
		console.log(key);

		const { immutableData } = this.state;
		const { filedObj } = this.props;
		const childField = filedObj.get("childField")!;
		const textField = filedObj.get("textField");
		//记录搜索前的数据,用于切换回来
		this.searchPreData = immutableData;

		let searchReswult = immutableData.withMutations(list => {
			return this.searchMap(list, childField, key, textField);
		});

		console.log(searchReswult.toJS());

		// this.setState({
		// 	immutableData:searchResult
		// });
	}

	clickFnForTreeMethod=(path:string)=>{
		this.clickFn(path);
	}

	clickFn(index: string){
		const { filedObj, selected } = this.props as props;
		const multipy = filedObj.get("multiply");
		const idField = filedObj.get("idField");
		const textField = filedObj.get("textField");
		const childField = filedObj.get("childField");

		const indexArr = index
			.split(",")
			.join(`,${childField},`)
			.split(",");
		const indexArrString = indexArr.join(",");
		let oldSelectedIndex = this.oldSelectedIndex;
		this.setState(
			pre => {
				const data = pre.immutableData;

				let _data = data;
				let _select = selected;
				let newNode: IImmutalbeMap<node> = _data.getIn(indexArr);
				//单选清除以前选中的
				if (oldSelectedIndex === indexArrString) {
					//点击的是同一个
					return {
						immutableData: _data,
					};
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

				this.props.changeSelect(_select, newNode);
				return {
					immutableData: _data,
				};
			},
			() => {
				this.oldSelectedIndex = indexArrString;
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
		const indexArr = value
			.split(",")
			.join(`,${childField},`)
			.split(",");

		this.setState(pre => {
			const data = pre.immutableData;

			let _data = data;
			let _select = selected;
			let newNode = _data.getIn(indexArr);

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
			_data = this.cascade!(value, _data, childField);
			this.props.changeSelect(_select, newNode);

			return {
				immutableData: _data,
			};
		});
	}
	mapFn(
		list: IImmutalbeList<IImmutalbeMap<any>>,
		active: activeStatus,
		select: IImmutalbeList<ComboSpace.Iselected>,
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
		const indexArr = value
			.split(",")
			.join(`,${childField},`)
			.split(",");

		this.setState(pre => {
			const data = pre.immutableData;

			let _data = data;
			let _select = selected;
			let newNode = _data.getIn(indexArr);

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
			_data = this.cascade!(value, _data, childField);
			this.props.changeSelect(_select, newNode);

			return {
				immutableData: _data,
			};
		});
	}
	closeFn = () => {
		const data = this.searchPreData;
		if (data) {
			this.setState({
				immutableData: data,
			});
		}
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
		const { filedObj, dropStyle } = this.props;
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
					lev={0}
					clickFn={this.clickFnForTreeMethod}
					CheckBox={multiply ? CheckBox : undefined}
				/>
			);
		});
		//#done:搜索方法写好后把搜索框显示，同时修改css文件
		return (
			<>
				<div style={{ paddingBottom: "0.5em", display: "none",}}>
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