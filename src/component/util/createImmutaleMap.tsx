
import * as Immutable from "immutable";

type AllowedValue =
	| string
	| number
	| boolean
	| IAllowedMap
	| IAllowedList
	| IImmutalbeMap<any>
	| { [key: string]: any };


interface IAllowedMap extends Immutable.Map<string, AllowedValue> {}
interface IAllowedList extends Immutable.List<AllowedValue> {}

type MapTypeAllowedData<DataType> = { [K in keyof DataType]: DataType[K] };

declare global {
	interface IImmutalbeMap<DataType extends MapTypeAllowedData<DataType>>
    extends Immutable.Map<keyof DataType, AllowedValue> {
    toJS(): DataType;
    get<K extends keyof DataType>(
      key: K,
      notSetValue?: DataType[K]
    ): DataType[K];
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
	interface IImmutalbeList<DataType extends AllowedValue>
		extends Immutable.List<DataType> {
	}
    
}

const createImmutableMap = <DataType extends MapTypeAllowedData<DataType>>(
	data: DataType
): IImmutalbeMap<DataType> => Immutable.Map(data) as any;

export { createImmutableMap  };
