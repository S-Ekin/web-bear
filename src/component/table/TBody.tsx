/**
 * @name 表格主体
 * @description description
 * @time 2019-09-19
 */
import {fieldObj, ITableFn, Inode} from "./mytable";
import * as React from "react";
import { CheckBox } from "../input/index";
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";

type Props<T> = {
  curPage:number;// 当前页码
  perNums:number;// 当前每页显示的条数
  tableData: IImmutalbeList<IImmutalbeMap<Inode & T>>; // 当前页的数据
  fileObj:fieldObj<T>;
  changeHandle: ITableFn<T>["changeState"];
  selectfn:(e:React.MouseEvent<HTMLTableCellElement>)=>void;
};
interface ITBody {
  rowSpanNum : number; // 要合并的行
  isSame: string; // 中间变量用于保存要合并的行的某个列的名称
}
// tslint:disable-next-line: variable-name
const TdCheckBox:React.FunctionComponent<{
  checked:boolean;
  index:string;
  changeFn:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}> = ({changeFn, index, checked}) => (
  <CheckBox
    checked={checked}
    value={index}
    type="checkbox"
    changeHandle={changeFn}
  />
);
type TbodyState = {
  preTableData:IImmutalbeList<IImmutalbeMap<AnyObj>>;
};
class TBody<T extends AnyObj> extends React.PureComponent<Props<T>, TbodyState> implements ITBody {
  isSame=""; // 比较第一个要合并的列的内容是否相同
  rowSpanNum = 0; // 每次要合并的行
  getCheckCom (checkbox?:boolean) {
    return checkbox ?  TdCheckBox : () => <></>;
  }
  checkFn = (e:React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const value  = dom.value;
    const checked = dom.checked;
    const {tableData, changeHandle} = this.props;
    const newData = tableData.setIn([value, "checked"], checked);
    changeHandle<"tableData">("tableData", newData);

  }
  getTrCom (dataItem:IImmutalbeMap<Inode & T>, startIndex:number, index:number, curData:IImmutalbeList<IImmutalbeMap<Inode & T>>) {

    const order = `${startIndex + 1 + index}`;
    const {fileObj, selectfn} = this.props;
    const {column, tabField} = fileObj;

    return  column.map((node) => {
      const { field, formatter, isRowSpanField, align = "td-left", } = node;
      const text = formatter
        ? formatter(dataItem, order, tabField)
        : dataItem.get(field);

      if (isRowSpanField) {
        const textName = dataItem.get(field);
        // 判断是不是相同的行,相同就不要返回这个td
        if (this.isSame !== textName) {
          // 重新赋值，便于后面的比较
          this.isSame = textName;

          if (this.rowSpanNum < 2) {
            // 这是第一个要合并的列，是主合并列，其他的要合并的列，根据这个合并数来合并。
            // 找到需要合并的行数,从当前行开始往下找,找到第一个与它不一样的，
            let countRowSpan = 1;
            curData.slice(index + 1).findIndex((val) => {
              const status = val.get(field) !== this.isSame;
              if (!status) {
                countRowSpan++;
              }

              return status;
            });
            this.rowSpanNum = countRowSpan;
          }

          return (
            <td
              key={field}
              className={`${align}`}
              rowSpan={this.rowSpanNum}>
              {text}
            </td>
          );
        } else {
          this.rowSpanNum = 0; // 用于每次遍历一行时，用于判断是否需要再次合并，为 0,说明这个td是被上一级合并的，不需要显示
          return undefined;
        }

      } else {
        return (
          <td
            key={field}
            data-field={field}
            className={`${align}`}
            data-index={order}
            onClick={field === "opt" ? selectfn : undefined}>
            {text}
          </td>
        );
      }
    });
  }
  render () {
    const { perNums, curPage, fileObj, tableData } = this.props;

    const { idField, checkbox, noPageNums } = fileObj;
    const startIndex = (curPage - 1) * perNums;

    // 当前页的数据
    const curData = (!noPageNums
      ? tableData.slice(startIndex, startIndex + perNums)
      : tableData);

    // tslint:disable-next-line: variable-name
    const CheckBoxOrNull = this.getCheckCom(checkbox);

    const tBody = curData.map((dataItem, index) => {
      const order = `${startIndex + 1 + index}`;
      const checked = dataItem.get("checked");
      const selected = dataItem.get("selected");
      const selectName =  selected ? "selected" : undefined;

      const trCom = this.getTrCom(dataItem, startIndex, index, curData);

      return (
        <tr key={dataItem.get(idField)} className={selectName}>

          <td className="td-left">
            <span>
              <CheckBoxOrNull
                checked={checked}
                changeFn={this.checkFn}
                index={`${index + startIndex}`}
              />
              {order}
            </span>
          </td>
          {trCom}
        </tr>
      );
    });

    this.isSame = "";

    return tBody;
  }
}

export default TBody;
