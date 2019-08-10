
import * as React from "react";
import * as Immutable from "immutable";
import { VelocityComponent } from "velocity-react";
import Search from "@js/common/SearchCom";
//import "@css/common/combobox.scss";
import { ComboInp } from "@js/common/InputBtn";
import Drop from "./Drop";

enum CheckStatus {
	checked = "checked",
	hasCheck = "hasCheck",
	uncheck = "uncheck",
}

type slecteItem= { text: string; id: string; };

type props = {
	data: any[];
	idField?: string;
	childField?: string;
	textFiled?: string;
	icon?: string;
	checkbox?: boolean,
	formatter?: (node: any) => React.ElementType;
	width: number;
	maxHeight: number;
	defaultSel?: string;
	hasSlideIcon?: boolean;
	filed: string;
	clickCallback?: (slecte: Readonly<slecteItem[]>, field: string, node?: Readonly<any>, ) => void;
	pannelWidth?: number;
	parAbleClick?:boolean;
	init?:boolean;
	autoHInp?:boolean;
	dirctionUp?:boolean;
}


type states = {
	selected: Immutable.List<slecteItem>;
	drop: boolean;
	treeData: Immutable.List<Immutable.Map<string, any>>
};

export default class ComTreeBox extends React.PureComponent<props, states> implements ComTreeboxSpace.comTreeboxAPI {

	static defaultProps = {
		idField: "id",
		childField: "children",
		textFiled: "text",
		icon: "fa fa-file-o",
		checkbox: false,
		width: 300,
		maxHeight: 300,
		defaultSel: "",
		hasSlideIcon: true,
		init:false
	}

	wrapDomRef: React.RefObject<HTMLDivElement> = React.createRef();

	constructor(props: props) {
		super(props);

		let initSelectArr: any[] = [];

		const defaultSelArr = (props.defaultSel+"").split(",");

		const treeData = this.addStaTusField(props.data, defaultSelArr, initSelectArr);

		this.state = {
			drop: false,
			selected: Immutable.List(initSelectArr),
			treeData
		}

		this.getInitPath(this.props.data, this.props.defaultSel!);
	}


	public prePath?: (number | string)[];

	getFieldVal = (field: ComTreeboxSpace.field) => {

		return this.props[field] as string;

	}

	getCommonMethod = <K extends ComTreeboxSpace.commonMethodName>(methodName: ComTreeboxSpace.commonMethodName): ComTreeboxSpace.comTreeboxAPI[K] => {

		return this[methodName as K];

	}

	getCheckBox = (checkStatus: string, path: string, is_par: boolean) => {



		const { checkbox } = this.props;

		if (checkbox) {

			const isChecked = checkStatus === CheckStatus["checked"];
			const hasChecked = checkStatus === CheckStatus["hasCheck"];

			return (
				<label className="m-label m-lab-checkbox" >
					<input
						type="checkbox"
						className={hasChecked ? "has-check" : ""}
						checked={isChecked}
						data-path={path}
						onChange={is_par ? this.parCheck : this.childCheck}
					/>
				</label>

			)
		} else {

			return ""
		}

	}


	componentWillReceiveProps(nextProp: props) {

		//父组件
		if (nextProp.data != this.props.data || nextProp.defaultSel!=this.props.defaultSel || nextProp.init!=this.props.init) {
			const initSlectedArr: any[] = [];
			const treeData = this.addStaTusField(nextProp.data, (nextProp.defaultSel+"")!.split(","), initSlectedArr);
			this.setState({
				treeData,
				selected: Immutable.List(initSlectedArr)
			});

			this.getInitPath(nextProp.data, nextProp.defaultSel!);

		}


	}
	getInitPath(data: any[], selectedId: string) {
		
		if (this.props.checkbox) {
			return;
		}
		this.prePath=[];
		if (!selectedId) {
			
			return;
		}
		const { idField, childField } = this.props;

		const findTreePath = function (data: any[], id: string, pathArr: (number | string)[]): boolean {

			return data.some((val: any, index: number) => {
				const child = val[childField!];
				if (child.length) {
					const parStatus = findTreePath(child, id, pathArr);
					parStatus && pathArr.push(index, childField!);
					return parStatus;
				} else {
					const status = val[idField!] == id;
					if (status) {
						pathArr.push(index, childField!);
					}
					return status
				}
			})
		};

		let pathArr: (number | string)[] = [];
		findTreePath(data, selectedId, pathArr);
		pathArr = pathArr.reverse();
		pathArr.shift();
		this.prePath = pathArr;
	}


	addStaTusField(data: any[], selected: string[], initSlectedArr?: any[]) {


		const { idField, childField, textFiled ,parAbleClick} = this.props;


		const copyData = JSON.parse(JSON.stringify(data), function (...ars) {
			const [, val] = ars;
			if (val && (Object.prototype.toString.call(val) === "[object Object]")) {


				val.state = true;//展开

				const sub: any[] = val[childField!];


				

				if (sub.length === 0) { //文件
					
					const hasIndex = selected.findIndex(node => node == val[idField!]) > -1;
					val.checkStatus = hasIndex ? "checked" : "uncheck";

					initSlectedArr && hasIndex && initSlectedArr.push({ id: val[idField!], text: val[textFiled!] });
				

				} else { //目录

					

					if(parAbleClick){

						const hasIndex = selected.findIndex(node => node == val[idField!]) > -1;
						val.checkStatus = hasIndex ? "checked" : "uncheck";

						initSlectedArr && hasIndex && initSlectedArr.push({ id: val[idField!], text: val[textFiled!] });

					}

					if(val.checkStatus!=="checked"){
						let hasCheckStatus = sub.some(val => val.checkStatus === CheckStatus["hasCheck"]);
						const total = sub.length;

						if (hasCheckStatus) {
							val.checkStatus = CheckStatus["hasCheck"];
						} else {
							let hasAllCheckCount = 0;
							sub.forEach(val => (val.checkStatus === CheckStatus["checked"] && hasAllCheckCount++));
							const rest = total - hasAllCheckCount;
							if (rest == 0) {
								val.checkStatus = CheckStatus["checked"];
							} else if (rest == total) {
								val.checkStatus = CheckStatus["uncheck"];
							} else {
								val.checkStatus = CheckStatus["hasCheck"];
							}
						}
					}

					

			
				}

			} 


			return val;

		});
		return Immutable.fromJS(copyData);
	}

	cascade(treeData: states["treeData"], pathArr: any[]) {

		let leg = pathArr.length - 2;
		pathArr.length = Math.max(leg, 0);
		const childField = this.props.childField!;
		while (leg > 0) {


			const par: Immutable.Map<string, any> = treeData.getIn(pathArr);

			const has_check: boolean = par.get(childField).some(function (val: any) {
				return val.get("checkStatus") == CheckStatus["hasCheck"];
			});

			if (has_check) {
				treeData = treeData.updateIn(pathArr, (val: any) => {
					return val.set("checkStatus", CheckStatus["hasCheck"])
				});
			} else {
				const sub = par.get(childField);
				const total = sub.size;
				const all_checked: number = sub.count(function (val: any) {
					return val.get("checkStatus") == CheckStatus["checked"];
				});
				const rest = total - all_checked;

				treeData = treeData.updateIn(pathArr, (val: any) => {

					const status = rest === 0 ? CheckStatus["checked"] : rest === total ? CheckStatus["uncheck"] : CheckStatus["hasCheck"];
					return val.set("checkStatus", status);
				});
			}

			leg = pathArr.length - 2;
			pathArr.length = Math.max(leg, 0);

		}
		return treeData;

	}

	getPath(path: string) {
		let pathArr: any[] = [];
		const arr = path.split("@");
		const leg = arr.length - 1;
		
			arr.forEach((val, index) => {
				leg > index ? pathArr.push(+val, this.props.childField) : pathArr.push(+val);
			});
		
		

		return pathArr;
	}

	childCheck = (e: React.ChangeEvent<HTMLInputElement>) => {

		const path = e.currentTarget.dataset.path;

		if (!path) {
			return;
		}
		const pathArr = this.getPath(path);
		const { idField, textFiled } = this.props;

		let cur_node :any;

		this.setState(preState => {


			let _node: any;
			let immuTreeData = preState.treeData.updateIn(pathArr, node => {

				let status = node.get("checkStatus");
				status = status === CheckStatus["checked"] ? CheckStatus["uncheck"] : CheckStatus["checked"];
				const newNode = node.set("checkStatus", status);
				//更新所选的

				const id = newNode.get(idField!);
				const text = newNode.get(textFiled!);
				_node = this.updateSelectList(preState.selected, id, text, status === CheckStatus["checked"]);
				cur_node = newNode.toJS();
				return newNode;


			})

			return {
				treeData: this.cascade(immuTreeData, pathArr),
				selected: _node,
			}

		},()=>{

			const {clickCallback,filed} = this.props
			const {selected} = this.state;

			if(clickCallback){

				clickCallback(selected.toJS(),filed,cur_node);

			}

		})


	}

	checkAllChild(sub: states["treeData"], childField: string, status: string, selected: any[]): states["treeData"] {




		const List = sub.map(val => {
			const child = val!.get(childField) as states["treeData"];

			const node = val!.set("checkStatus", status);
			if (child.size) {
				const childArr = this.checkAllChild(child, childField, status, selected);
				return node.set(childField, childArr);
			} else {
				//更新所选的
				const { idField, textFiled } = this.props;
				const id = node.get(idField!);
				const text = node.get(textFiled!);
				selected.push({ id, text });
				return node;
			}

		});

		return List

	}

	parCheck = (e: React.ChangeEvent<HTMLInputElement>) => {

		const path = e.currentTarget.dataset.path;

		if (!path) {
			return;
		}

		const { childField } = this.props;
		const pathArr = this.getPath(path);
		let is_check = false;
		let curNode :any;
		this.setState(preState => {
			const list: any[] = [];
			let immuTreeData = preState.treeData.updateIn(pathArr, node => {

				let status = node.get("checkStatus");
				is_check = status === CheckStatus["checked"];

				status = is_check ? CheckStatus["uncheck"] : CheckStatus["checked"];

				let newNode = node.set("checkStatus", status);



				const sub = this.checkAllChild(newNode.get(childField), childField!, status, list);

				newNode = newNode.set(childField, sub);

				curNode = newNode.toJS();

				return newNode;

			});

			let selectList = preState.selected;

			list.forEach(val => {
				const id = val.id;
				const text = val.text;
				selectList = this.updateSelectList(selectList, id, text, !is_check);
			});

			return {
				treeData: this.cascade(immuTreeData, pathArr),
				selected: selectList,
			}
		},()=>{

			const {clickCallback,filed} = this.props
			const {selected} = this.state;

			if(clickCallback){

				clickCallback(selected.toJS(),filed,curNode);

			}

		})
	}

	expandToggle = (e: React.MouseEvent<HTMLElement>) => {
		const path = e.currentTarget.dataset.path;
		if (!path) {
			return;
		}


		this.setState(preState => {
			const pathArr = this.getPath(path);
			let immuTreeData = preState.treeData.updateIn(pathArr, node => {

				const state = node.get("state");
				return node.set("state", !state);
			});
			return {
				treeData: immuTreeData
			}
		})

	}

	clickItem = (e: React.MouseEvent<HTMLElement>) => {

		const path = e.currentTarget.dataset.index;

		if (!path) {
			return;
		}

		const { idField, textFiled } = this.props;
		const pathArr = this.getPath(path);
		const id = this.state.treeData.getIn(pathArr.concat(idField!));
		const has_id = this.state.selected.some(val => val!.id === id);

		if (has_id) {
			return;
		};

		let curNode :any;

		this.setState(preState => {

			const treeData = preState.treeData;

			let immuTreeData = treeData;
			let prePath = this.prePath;

			let _node: any;
				//清除已经选择的
			if (prePath && prePath.length) {
				prePath = prePath.slice();
				let _leg = prePath.length;
				while (_leg > 0) {

					immuTreeData = immuTreeData.updateIn(prePath, node => {
						let newNode = node ? node.set("checkStatus", CheckStatus["uncheck"]) : node;
						return newNode;
					});
					_leg -= 2;
					prePath.length = Math.max(_leg, 0);
				}
			};
			//选中目标
			let pathArr_copy = pathArr.slice();
			let leg = pathArr_copy.length;
			immuTreeData = immuTreeData.updateIn(pathArr_copy, node => {
				let status = node.get("checkStatus");
				status = status === CheckStatus["checked"] ? CheckStatus["uncheck"] : CheckStatus["checked"];
				let newNode = node.set("checkStatus", status);
				const id = newNode.get(idField!);
				const text = newNode.get(textFiled!);

				_node = { id, text };
				curNode = newNode.toJS();
				return newNode;
			});
			if(leg-2 >= 0){ //不是根目录的情况，选中目标父节点
				pathArr_copy.length = leg - 2;
				leg -= 2;
				while (leg > 0) {

					immuTreeData = immuTreeData.updateIn(pathArr_copy, node => {
						let newNode = node.set("checkStatus", CheckStatus["hasCheck"]);
						return newNode;
					});
					leg -= 2;
					pathArr_copy.length = Math.max(leg, 0);

				}
			}
			

			this.prePath = pathArr;

			return {
				treeData: immuTreeData,
				selected: Immutable.List([_node])
			}

		},()=>{

			const {clickCallback,filed} = this.props
			const {selected} = this.state;

			if(clickCallback){

				clickCallback(selected.toJS(),filed,curNode);

			}

		});

	}


	updateSelectList = (selectList: states["selected"], id: string, text: string, is_sel: boolean) => {
		const index = selectList.findIndex(val => val!.id === id);
		if (is_sel) {

			if (index > -1) {
				return selectList.remove(index).push({ id, text })
			} else {
				return selectList.push({ id, text })
			}

		} else {
			if (index > -1) {
				return selectList.remove(index)
			} else {
				return selectList;
			}
		}

	}

	toggleDrop = () => {
		this.setState(preState => {
			return {
				drop: !preState.drop
			}
		})
	}


	getValue() {

		const { selected } = this.state;
		const arr = selected.map(val => {
			return val!.text;
		});
		return arr.join("，");

	}

	searchHandle = (key: string) => {

		const { data, textFiled, childField, idField } = this.props;
		const { selected } = this.state;

		// 被选中的id 
		const idArr = selected.map(val => val!.id).toArray();

		const dataCopy: any[] = JSON.parse(JSON.stringify(data), function (...args) {
			const [, val] = args;

			if (val) {
				if (Object.prototype.toString.call(val) === "[object Object]") {
					val.checkStatus = CheckStatus["uncheck"];
					val.state = true;
					const sub = val[childField!];


					if (sub.length === 0) {//文件
					const is_searchTarget = val[textFiled!].includes(key);
						const hasIndex = idArr.includes(val[idField!]);
						val.checkStatus = hasIndex ? CheckStatus["checked"] : CheckStatus["uncheck"];
						return is_searchTarget ? val : undefined;

					} else {//目录


						let hasCheckCount = 0;
						let hasCheckStatus = false;

						const child = sub.filter((node: any) => {

							if (node) {

								node.checkStatus === CheckStatus["checked"] && hasCheckCount++;
								if (!hasCheckStatus) {
									hasCheckStatus = node.checkStatus === CheckStatus["hasCheck"];
								}
								return true;

							} else {

								return false;
							};
						});

						const total = child.length;
						if (hasCheckStatus) {
							val.checkStatus = CheckStatus["hasCheck"];
						} else {

							const rest = total - hasCheckCount;
							if (rest == 0) {
								val.checkStatus = CheckStatus["checked"];
							} else if (rest == total) {
								val.checkStatus = CheckStatus["uncheck"];
							} else {
								val.checkStatus = CheckStatus["hasCheck"];
							}

						}




						val[childField!] = child;
						return total ? val : undefined;

					}

				} else {
					return val;
				}
			} else {

				return val;
			}



		});

		const treeData = dataCopy.filter(node => node);

		const selectedId = this.state.selected.get(0);
		this.setState({
			treeData: Immutable.fromJS(treeData),
		});
		if (selectedId) {
			this.getInitPath(treeData, selectedId.id);
		}



	}

	closeHandle = () => {
		const idArr = this.state.selected.map(val => val!.id).toArray();
		this.getInitPath(this.props.data, idArr[0]);
		this.setState({
			treeData: this.addStaTusField(this.props.data, idArr),
		});

	}

	documentClickFn = (e: MouseEvent) => {

		const target = e.target! as HTMLElement;
		const wrap = this.wrapDomRef.current!;
		if (target == wrap || wrap.contains(target)) {

		} else {

			this.setState({
				drop: false
			});
		}




	}

	componentDidMount() {

		document.addEventListener("click", this.documentClickFn);
	}
	componentWillUnmount() {

		document.removeEventListener("click", this.documentClickFn);
	}

	render() {

		const { drop, treeData } = this.state;
		const { checkbox, width, maxHeight, hasSlideIcon, pannelWidth,autoHInp,dirctionUp } = this.props;
		const value = this.getValue();


		return (<div ref={this.wrapDomRef} className={"comTreeBox " + (drop ? "active " : "") + (!value ? "no-fill" : "")} style={{ width: width + "px" }}>
			<ComboInp autoH={autoHInp} multiply={checkbox!} value={value} toggleDrop={this.toggleDrop} drop={drop} hasSlideIcon={hasSlideIcon} />
			<VelocityComponent animation={drop ? "slideDown" : "slideUp"}

				interruptBehavior="queue"

			>
				<div className={"m-drop " + (dirctionUp && "direction-up" || "direction-down")}  style={{ width: (pannelWidth ? pannelWidth : "100%") }}>
					<Search closeHandle={this.closeHandle} searchHandle={this.searchHandle} />
					<ul className="m-tree" style={{ maxHeight: maxHeight + "px" }}>

						<Drop
							data={treeData}
							getFieldVal={this.getFieldVal}
							getCommonMethod={this.getCommonMethod}
						/>
					</ul>

				</div>

			</VelocityComponent>
		</div>);


	}

}

