import * as Immutable from "immutable";
import { activeStatus} from "./DropItem";
type props = ComboSpace.drop<"tree">;
type node = {
	[key: string]: any;
	active: activeStatus;
	expand: boolean;
};
type states = {
	immutableData: Immutable.List<IImmutalbeMap<node>>;
};
    //当由外部控制选什么的时候，defaultVal,是又外部输入的,data:可以传入
const formatterTreeData = function (props: props,defaultVal:string,data:any[],noInitState?:boolean) {
		const { filedObj, initSelect } = props;
		const id = filedObj.get("idField");
		const text = filedObj.get("textField");
		const childField = filedObj.get("childField");
		let defaultValArr = defaultVal.split(",");

		const multiply = filedObj.get("multiply");
		if (!multiply && defaultValArr.length > 1) {
			defaultValArr.length = 1;
		}
		let oldSelectedIndex = "";
		let listSelected: ComboSpace.Iselected[] = [];

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
					//执行目录和文件两种情况 ,添加,是否展开:expand和是否选中：active的状态
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

							if (hasSelected) {//子文件里面有点节点是有选的状态
								active = activeStatus.hasSelect;
							} else {
								//根据子文件的选择情况来做对应的选中状态
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
							//单选
							active = activeStatus.noSelect;
						}
					} else {
						//文件
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
        //this.oldSelectedIndex = oldSelectedIndex;
        
		//显示默认选中的,并且按照默认的顺序显示
		if(defaultVal){
			const initDefaultSelectArr = defaultValArr.map(select=>{
				// tslint:disable-next-line: triple-equals
				return listSelected.find(val=>val.id == select)!;
			}).filter(val=>val);

			listSelected = initDefaultSelectArr ;
		}
		//显示默认选中的
		if(!noInitState){
			initSelect(Immutable.List(listSelected));
		}
		
		return {
            data:immutableData,
            oldSelectedIndex: oldSelectedIndex
        };
    };

    //级联选中
const cascade = function(
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
	};
    
    export {formatterTreeData ,cascade};