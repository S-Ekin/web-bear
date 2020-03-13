declare namespace MyTreeTabSpace {

	export interface columnItem {
		field:string;
		children:string;
		width?:number;
		formatter?:(
				node: IImmutalbeMap<any>, //节点
				index: number, //列的索引
				tabField?: string //表格标识
			) => React.ReactChild;
	}

	export interface common {
		col :(Omit<columnItem,'children'> & {text:string});
		groupCol :{
			children:React.ComponentElement<MyTreeTabSpace.columnItem,any>[];
			align:'left' | 'center' | 'right';
			forzen?:boolean;
		}
		fixObj: {
			childField:string;
			idField:string;
			tabField?:string;
		};
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
