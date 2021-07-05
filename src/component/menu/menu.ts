import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
export interface IMenuData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  selected: boolean;
  drop:boolean;
  children: IMenuData[];
}

export interface Inode extends AnyObj {
  children:IImmutalbeList<IImmutalbeMap<IMenuData>>;
  selected: boolean;
}

export type IfieldObj = IImmutalbeMap<{
  id:string;
  text:string;
  url:string;
  icon:string;
}>;
