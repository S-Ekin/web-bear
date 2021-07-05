import * as Immutable from "immutable";
export type AllowedValue =
  | string
  | number
  | boolean
  | IAllowedMap
  | IAllowedList
  | IImmutalbeMap<AnyObj>
  | AnyObj;

type IAllowedMap = Immutable.Map<string, AllowedValue>;
type IAllowedList = Immutable.List<AllowedValue>;

export type MapTypeAllowedData<DataType> = { [K in keyof DataType]: DataType[K] };

export interface IImmutalbeMap<DataType extends MapTypeAllowedData<DataType>, origin extends AnyObj = DataType>
  extends Immutable.Map<keyof DataType, AllowedValue> {
  toJS(): origin;
  get<K extends keyof DataType>(key: K, notSetValue?: DataType[K]): DataType[K];
  set<K extends keyof DataType>(key: K, value: DataType[K]): this;
  update<K extends keyof DataType>(
    key: K,
    updater: (value: DataType[K]) => DataType[K]
  ): this;
  update<K extends keyof DataType>(
    key: K,
    notSetValue: DataType[K],
    updater: (value: DataType[K]) => DataType[K]
  ): this;
  update<R>(updater: (value: this) => R): R;
}
export type IImmutalbeList<DataType extends AllowedValue> =
  Immutable.List<DataType>;

// 树形节点
export type immuTreeNode<
  T extends AnyObj,
  K extends string = "children"
> = Omit<T, K> &
{ [f in K]: IImmutalbeList<IImmutalbeMap<immuTreeNode<T, f>, T>> };

// 把那种属性是对象和数组的对象转化为真正一一对应的immutable对象。注意只是转化第一层
export type immuObjArr<T extends AnyObj, K extends keyof T> = Omit<T, K> &
{
  [f in K]: T[f] extends AnyObj[]
    ? IImmutalbeList<IImmutalbeMap<T[f][0]>>
    : IImmutalbeMap<T[f]>;
};


/*

const text = {
  a: {
    a: true,
    b: 12,
    c: "adsf"
  },
  child: [
    {
      a: "地方",
      b: 2,
      child: [
	      {
		a: "地方",
		b: 2,
		child:[
		a: "地方",
		b: 2,
		child:[]
		]

	      },
	      {
		a: "单独"，
		b:12，
		child:[]
	      }
      ]
    }
  ],
  c: [
    {
      a: "12",
      b: 1234,
      c: 21
    }
  ],
  d: true,
};

type T = typeof text;
// 组合出属性含有对象和数组，已经递归的树形节点
type node = immuObjArr<T, "a" | "c">;
type treeNode = immuTreeNode<node, "child">;
const tree:IImmutalbeMap<treeNode, T> = Immutable.fromJS(text);
const keys = tree.get("child").get(0)!.get("child").get(0)!.get("a").toJS();
const trees = tree.toJS();

type testN<a extends string | undefined = undefined> = a extends undefined ? Record<string, never> :  {[f in NonNullable<a>]:string}
type gd = testN & {b:string};
type ghg = gd["b"];
*/
