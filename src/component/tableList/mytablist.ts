
	export interface IColumnItem {
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

	type group = React.ComponentElement<IColumnItem,any>;

	export interface ICommon {
		node:{
			[key: string]: any;
			checked: boolean;
		};
		col :(Omit<IColumnItem,'children'> & {text:string});
		data:IImmutalbeList<IImmutalbeMap<ICommon['node']>>;
		groupCol :{
			children:group[] | group;
			forzen?:boolean;
		};
		config:{
			child:ICommon['col'][];
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
		changeState(path:string,key:''|'active'|'checkPar'):void;
		
	}
	
	export type fieldObj = {
		column:IColumnItem[]; //列头定义
		idField: string; //表格的节点标识
		noOrder?: boolean; //序号
		checkbox?: boolean; //多选
		tabField?: string; //表格标识
	};
