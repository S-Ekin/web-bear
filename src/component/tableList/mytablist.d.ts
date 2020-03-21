
declare namespace MyTabListSpace {
	export interface columnItem {
		field:string;
		children:string;
		width:number;
		align?:"center" | "left" | 'right';
		formatter?:(
				node: IImmutalbeMap<any>, //节点
				index: number, //列的索引
				tabField?: string //表格标识
			) => React.ReactChild;
	}

	type group = React.ComponentElement<MyTreeTabSpace.columnItem,any>;
	export interface common {
		col :(Omit<columnItem,'children'> & {text:string});
		groupCol :{
			children:group[] | group;
			forzen?:boolean;
		}
		config:{
			child:common['col'][];
			width:number;
			forzen?:boolean;
		};
		fixObj: {
			multiply?: boolean;
			idField: string;//表格的节点标识
			defaultSel: string;//默认选中的
			tabField: string;//表格标识
			emptyTxt: string;//空数据时显示文字
			noOrder?:boolean;
		};
		changeState(path:string,key:'expand'|'active'|'checkPar'):void;
		node:{
			[key: string]: any;
			active: 'selected' | 'hasSelect' | 'noSelect';
			expand: boolean;
		}
		data:IImmutalbeList<IImmutalbeMap<common['node']>>
	}
	
	export interface fieldObj {
		column: MyTabSpace.columnItem[]; //列头定义
		idField: string; //表格的节点标识
		noOrder?: boolean; //序号
		checkbox?: boolean; //多选
		tabField?: string; //表格标识
	}

}
