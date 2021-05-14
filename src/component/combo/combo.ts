export interface Inode extends AnyObj{
  active: string;
  expand: boolean;
}
export interface ISelected {
  id:string;
  text:string;
}

export interface IDropObj {
  tree:{
    childField?:string;
    noSearch?:boolean;
    parAbleClick?:boolean;// 文件夹也可以触发点击事件
  };
  list:{

  };
}

export type filedObj<P extends keyof IDropObj> = {
  idField: string;
  textField: string;
  multiply?: boolean;
  noSearch?: boolean;
  itemIcon?: string;
  defaultVal?: string;
  field:string;
  clickOrCheckForbid:(node:IImmutalbeMap<Inode>, field:string, selectedArr?:IImmutalbeList<ISelected>)=>boolean;
} & IDropObj[P];

export interface Idrop<P extends keyof IDropObj>  {
  filedObj: IImmutalbeMap<filedObj<P>>;
  initComboVal?:{id:string};
  disabled?:boolean;
  data:AnyObj[];
  selected:IImmutalbeList<ISelected>;
  dropStyle:{maxHeight:number};
  formatterDropItem?:(node:IImmutalbeMap<Inode>)=>React.ReactNode;
  clickMethod:(clickFn:(path?:string)=>void)=>void;// 暴露点击方法，用于清除所选
  changeSelect:(iselected:IImmutalbeList<ISelected>, node?:IImmutalbeMap<Inode>)=>void;
  initSelect:(iselected:IImmutalbeList<ISelected>)=>void;
}

export interface ICheckboxCom {
  changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  value?: string;
  name?: string;
  hasChecked?: boolean;
  type?: "checkbox" | "radio";
  isControl?: boolean;
}
