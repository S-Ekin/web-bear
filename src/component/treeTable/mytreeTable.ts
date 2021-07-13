import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
export interface IColumnItem<T> {
  field:string;
  children:string;
  align?:"center" | "left" | 'right';
  width:number;// 必须给个值，号计算不同区域的表格宽度，这样才可以让可以滚动的区域自适应宽度。
  formatter?:(
    node: IImmutalbeMap<Inode & T>, // 节点
    index: number, // 列的索引
    tabField?: string // 表格标识
  ) => React.ReactChild;
}

type group<T> = React.ComponentElement<IColumnItem<T>, React.ComponentState>;

export interface Inode {
  active: 'selected' | 'hasSelect' | 'noSelect';
  expand: boolean;
}

export interface ICommon<T> {
  node: Inode & T;
  data:IImmutalbeList<IImmutalbeMap<ICommon<T>['node']>>;
  col :(Omit<IColumnItem<T>, 'children'> & {text:string});
  groupCol :{
    children:group<T>[] | group<T>;
    forzen?:boolean;
    width?:number;
  };
  config:Omit<ICommon<T>['groupCol'], 'children'> & {
    child:ICommon<T>['col'][];
    width:number;
  };
  fixObj: {
    childField:string;
    noOrder?:boolean;
    multiply?: boolean;
    itemIcon?: string;
    idField: string;// 表格的节点标识
    defaultSel?: string;// 默认选中的
    tabField?: string;// 表格标识
    emptyTxt?: string;// 空数据时显示文字

  };
  changeState(path:string, key:'expand'|'active'|'checkPar'):void;

}

export type fieldObj<T> = {
  column: IColumnItem<T>[]; // 列头定义
  idField: string; // 表格的节点标识
  noOrder?: boolean; // 序号
  checkbox?: boolean; // 多选
  tabField?: string; // 表格标识
};
