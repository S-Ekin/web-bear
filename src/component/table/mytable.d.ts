declare namespace MyTabSpace {
	export interface columnItem {
		text: string; //列头名称
		width?: number | string; //宽度
		field: string;
		formatter?: (
			node: IImmutalbeMap<any>, //节点
			index: string, //节点索引
			tabField?: string //表格标识
		) => React.ReactChild;
		renderTit?: (
			text: string,
			field: string,
			tabField?: string
        ) => React.ReactChild; //列头自定义
        isRowSpanField?:boolean;//是否为合并字段
	}

	export interface fieldObj {
		column: MyTabSpace.columnItem[]; //列头定义
		idField: string; //表格的节点标识
		noOrder?: boolean; //序号
		checkbox?: boolean; //多选
		tabField?: string; //表格标识
		noPageNums?:boolean;//页码
	}

	export interface tableStates {
		perNums: number; //每页条数
		curPage: number; //当前页数
		tableData: IImmutalbeList<IImmutalbeMap<any>>;
		curPageCheckAll: "hasCheck" | "noChecked" | "checked";
	}
	export interface tableFn {
		changeState<P extends keyof tableStates>(
			field: P,
			data: tableStates[P]
		): void;
	}
}
