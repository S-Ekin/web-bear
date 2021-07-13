
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
export interface IColumnItem<T> {
  field:string;
  children:string;
  width:number;
  align?:"center" | "left" | 'right';
  formatter?:(
    node: IImmutalbeMap<Inode & T>, // 节点
    index: number, // 列的索引
    tabField?: string // 表格标识
  ) => React.ReactChild;
}

type group<T> = React.ComponentElement<IColumnItem<T>,  React.ComponentState>;


export interface Inode {
  checked: boolean;
}

export interface ICommon<T> {
  node: Inode & T;
  col :(Omit<IColumnItem<T>, 'children'> & {text:string});
  data:IImmutalbeList<IImmutalbeMap<ICommon<T>['node']>>;
  groupCol :{
    children:group<T>[] | group<T>;
    forzen?:boolean;
    width?:number;
  };
  config:{
    child:ICommon<T>['col'][];
    width:number;
    forzen?:boolean;
  };
  fixObj: {
    multiply?: boolean;
    idField: string;// 表格的节点标识
    defaultSel: string;// 默认选中的
    tabField: string;// 表格标识
    emptyTxt: string;// 空数据时显示文字
    noOrder?:boolean;
  };
  changeState(path:string, key:''|'active'|'checkPar'):void;

}

export type fieldObj<T> = {
  column:IColumnItem<T>[]; // 列头定义
  idField: string; // 表格的节点标识
  noOrder?: boolean; // 序号
  checkbox?: boolean; // 多选
  tabField?: string; // 表格标识
};
