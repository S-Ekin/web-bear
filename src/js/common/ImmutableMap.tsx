import * as Immutable from "immutable";


type AllowedValue =
  string |
  number |
  boolean |
  AllowedMap |
  AllowedList |
  {[key:string]:any} |
  TypedMap<any> ;


interface AllowedList extends Immutable.List<AllowedValue> {}

interface AllowedMap extends Immutable.Map<string, AllowedValue> {}


type MapTypeAllowedData<DataType> = {
  [K in keyof DataType]: AllowedValue;
};

declare global{
	
		interface TypedMap<DataType extends MapTypeAllowedData<DataType>> extends Immutable.Map<keyof DataType, AllowedValue> {
		  toJS(): DataType;
		  get<K extends keyof DataType>(key: K, notSetValue?: DataType[K]): DataType[K];
		  set<K extends keyof DataType>(key: K, value: DataType[K]): this;
		}
}


const createTypedMap = <DataType extends MapTypeAllowedData<DataType>>(data: DataType):TypedMap<DataType> => Immutable.Map(data) as any;




export {createTypedMap};
