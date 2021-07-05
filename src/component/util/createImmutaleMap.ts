import * as Immutable from "immutable";
import {MapTypeAllowedData,  IImmutalbeMap} from "./immutableUtil";
const createImmutableMap = <DataType extends MapTypeAllowedData<DataType>>(
  data: DataType
): IImmutalbeMap<DataType> => Immutable.Map(data) as IImmutalbeMap<DataType>;
export { createImmutableMap  };
