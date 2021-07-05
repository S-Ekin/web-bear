import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
export interface Inode {
  checked:boolean;
  selected:boolean;
}
export interface IColumnItem<T> {
  field:string;
  width?:number | string;
  isRowSpanField?:boolean;// 是否为合并字段
  align?: string;
  formatter?:(
    node: IImmutalbeMap<Inode & T>, // 节点
    index: string, // 节点索引
    tabField?: string // 表格标识
  ) => React.ReactChild;
}

export type fieldObj<T> = {
  column: IColumnItem<T>[]; // 列头定义
  idField: string; // 表格的节点标识
  noOrder?: boolean; // 序号
  checkbox?: boolean; // 多选
  tabField?: string; // 表格标识
  noPageNums?:boolean;// 页码
};

export interface ITableStates<T> {
  perNums: number; // 每页条数
  curPage: number; // 当前页数
  tableData: IImmutalbeList<IImmutalbeMap<Inode & T>>;
  preData: T[];
  preInitSelectVal?:{id:string};
  curOptId:string;
}
export interface ITableFn<T> {
  changeState<P extends keyof ITableStates<T>>(
    field: P,
    data: ITableStates<T>[P]
  ): void;
}
