/**
 * @name 表格
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import * as Immutable from "immutable";
import {Empty} from "../my-icon/index";
import {CheckBox} from "../input/index";
import {ScrollBox} from "../scroll/index";
import PageSize from "./PageSize";
import TabBody from "./TBody";
import {IColumnItem, ITableStates, fieldObj, Inode} from "./mytable";

type Props<T>={
  data: T[];
  children:(React.ReactElement<IColumnItem<T>> | undefined)[];
  hasBorder?:boolean;
  height?:number;
  noPageNums?: boolean;// 页码
  idField: string;// 表格的节点标识
  checkbox?: boolean;// 多选
  defaultSel?: string;// 默认选中的
  tabField?: string;// 表格标识
  emptyTxt?: string;// 空数据时显示文字
  initSelectVal?:{id:string};// 通过外界改变表格的选中
  bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<Inode & T>>)=>void;// 把获取选中的项的函数传递给外部
};
type States<T>= ITableStates<T> ;
interface ITable<T> {
  fieldObj:fieldObj<T>;// 一些固定不变的属性，用于传给子组件
}
// eslint-disable-next-line no-shadow
enum checkAllStataus {
  hasChecked="hasCheck",
  checked="checked",
  noChecked="noChecked",
}


const tableInitData = <T extends AnyObj>(data:Props<T>["data"], defaulSel:string, idField:string) => {
  const defaulSelArr = `${defaulSel}`.split(",");
  return  Immutable.fromJS(data, (_key, val) => {
    if (Immutable.isKeyed(val)) {
      // 对象
      let obj = val.toOrderedMap();
      const id = val.get(idField) as string;
      const has = defaulSelArr.includes(`${id}`);
      // 添加选中的字段
      obj = obj.set("checked", has).set("selected", has);
      return obj;
    } else {
      // 数组
      return val.toList();
    }
  });
};

const initCurPage = <T extends AnyObj>(props: Props<T>, perNums:number, curOptId?:string) => {
  const {data, idField} = props;
  if (!curOptId) {
    return 1;
  } else {
    // 当有默认选中的时候，通过这个选中的数的序号看它是在几页
    const index = data.findIndex((val) => String(val[idField!]) === String(curOptId));
    const pages = index > -1 ? Math.ceil((index + 1) / perNums) : 1;
    return pages;
  }
};
class Table<T extends AnyObj> extends React.PureComponent<Props<T>, States<T>> implements ITable<T> {

  static defaultProps={
    defaultSel: "",
    emptyTxt: "当前没有数据！",
  };

  static colItem = <K extends AnyObj>({width, children, align = "td-left"}: React.PropsWithChildren<IColumnItem<K>>) => (
    <th  style={{width: width, }} className={`${align}`}>{children}</th>
  )


  static getDerivedStateFromProps (nextProps:Props<AnyObj>, preState:States<AnyObj>):null | Partial<States<AnyObj>> {

    if (nextProps.data !== preState.preData) {
      const {defaultSel, data, idField} = nextProps;
      const val = preState.curOptId || defaultSel!;
      return {
        tableData: tableInitData(data, val, idField),
        curPage: initCurPage(nextProps, preState.perNums, preState.curOptId),
        preData: data,
      };
    }

    if (nextProps.initSelectVal !== preState.preInitSelectVal) {

      const {data, idField, initSelectVal} = nextProps;
      const val = initSelectVal ? initSelectVal.id : "";
      return {
        tableData: tableInitData(data, val, idField),
        preInitSelectVal: initSelectVal,
        curPage: initCurPage(nextProps, preState.perNums, val),
        curOptId: val,
      };

    } else {
      // tslint:disable-next-line: no-null-keyword
      return null;
    }
  }

  fieldObj = this.initFixObj();
  tableContainer: React.RefObject<HTMLDivElement> = React.createRef();
  scrollRef: React.RefObject<ScrollBox> = React.createRef();

  constructor (props:Props<T>) {
    super(props);
    const {data, defaultSel, idField, initSelectVal, bindGetSelectedFn} = props;
    this.state = {
      perNums: 20,
      curPage: initCurPage(props, 20, defaultSel!),
      tableData: tableInitData(data, defaultSel!, idField),
      preData: data,
      curOptId: defaultSel!,
      preInitSelectVal: initSelectVal
    };

    if (bindGetSelectedFn) {
      bindGetSelectedFn(this.getSelected);
    }
  }
  getSelected=() => {
    const {tableData} = this.state;
    return tableData.filter((val) => val.get("checked"));
  }
  componentDidMount () {
    const {defaultSel} = this.props;
    if (defaultSel) {
      this.scrollToSeletItem();
    }
  }
  getSnapshotBeforeUpdate (preProps:Props<T>) {
    const {data, initSelectVal} = this.props;
    if (preProps.data !== data || initSelectVal !== preProps.initSelectVal) {
      return true;
    } else {
      // tslint:disable-next-line: no-null-keyword
      return null;
    }

  }
  componentDidUpdate (_preProps:Props<T>, _preState:States<T>, snapshot:AnyObj) {

    if (snapshot) {
      const {defaultSel, initSelectVal} = this.props;
      const val = initSelectVal ? initSelectVal.id : defaultSel;
      if (val) {
        this.scrollToSeletItem();
      }
    }

  }
  initFixObj () {
    const {idField, checkbox, children: arr, tabField, noPageNums} = this.props;

    const column:IColumnItem<T>[] = arr.filter((val) => val).map((val) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {children, ...obj} = val!.props as {children:React.ReactChildren} & IColumnItem<T>;
      return obj;
    });

    return {
      idField,
      checkbox,
      column,
      tabField,
      noPageNums,
    };
  }

  scrollToSeletItem () {

    // tslint:disable-next-line: triple-equals
    const item = this.tableContainer.current!.querySelector(".selected") as HTMLTableRowElement;
    if (!item) {
      return;
    }
    // 滚动到指定位置
    const top = item.offsetTop - 12;
    window.setTimeout(() => {
      this.scrollRef.current!.scrollToTop(Math.max(0, top));
    }, 10);
  }
  getColGroupCom () {
    const {column, checkbox} = this.fieldObj;
    const list =  column.map(({ width, field }) => {
      let wObj;
      if (width) {
        const unit = (`${width}`).includes("%") ? "" : "px";
        wObj = width ? { width: `${width}` + unit } : undefined;
      } else {
        wObj = undefined;
      }
      return <col key={field} style={wObj} />;
    });
    const orderWid = checkbox ? 80 : 60;
    return (
      <colgroup>
        <col style={{ width: orderWid, }} key="order" />
        {list}
      </colgroup>
    );
  }
  checkCurPageAll=(e:React.ChangeEvent<HTMLInputElement>) => {

    const inpDom = e.currentTarget;
    const checked = inpDom.checked;

    const {tableData, curPage, perNums} = this.state;
    const {noPageNums} = this.props;
    let num:number;
    if (!noPageNums) {
      // 看最后一页是不是满的
      const rest = curPage * perNums - tableData.size;
      num = rest > 0 ? perNums - rest : perNums;
    } else {

		    num = tableData.size;
    }
    this.setState((pre) => {
      let newData = pre.tableData;
      Array.from({ length: num }).forEach((_val, index) => {
        // 计算要从当前页的起始位置开始
        newData = newData.updateIn(
          [index + (curPage - 1) * perNums],
          (val) => val.set("checked", checked)
        );
      });
      return {
			    tableData: newData,
      };
    });
  }
  getCurPageData () {
    const {tableData, curPage, perNums} = this.state;
    const {noPageNums} = this.props;
    const startIndex = (curPage - 1) * perNums;
    // 当前页的数据
    return  !noPageNums
      ? tableData.slice(startIndex, startIndex + perNums)
      : tableData;
  }
  countCurPageTotalStatus () {
    const {tableData} = this.state;
    if (tableData.size === 0) {
      return checkAllStataus.noChecked;
    } else {
      const  curPageData = this.getCurPageData();
      const allCheck =   curPageData.every((val) => val.get("checked"));
      if (allCheck) {
        return checkAllStataus.checked;
      } else {
        const hasCheck = curPageData.some((val) => val.get("checked"));
        return hasCheck ? checkAllStataus.hasChecked : checkAllStataus.noChecked;
      }
    }
  }

  getFixHead () {

    const {checkbox, children} = this.props;
    const curPageCheckAll = this.countCurPageTotalStatus();
    const colgroupCom = this.getColGroupCom();
    const checkCom = checkbox ? (
      <CheckBox
        type="checkbox"
        changeHandle={this.checkCurPageAll}
        checked={curPageCheckAll === checkAllStataus.checked}
        name="checkAll"
        hasChecked={curPageCheckAll === checkAllStataus.hasChecked}
      />
    ) : undefined;
    return (
      <table>
        {colgroupCom}
        <thead>
          <tr>
							    <th key="order" className="td-left">{checkCom}序号</th>
            {children}
          </tr>
        </thead>
      </table>

    );
  }

  changeState=<P extends keyof ITableStates<T>>(field:P, data:States<T>[P]) => {
    this.setState({
      [field as "curPage"]: data as number
    });
  }

  getTableBody () {

    const {curPage, tableData, perNums} = this.state;
    return (
      <ScrollBox ref={this.scrollRef} className="m-fixTabBody">
        <table >
          {this.getColGroupCom()}
          <tbody>
            <TabBody
              curPage={curPage}
              perNums={perNums}
              selectfn={this.selectedHandle}
              changeHandle={this.changeState}
              tableData={tableData}
              fileObj={this.fieldObj}
            />
          </tbody>
        </table>
      </ScrollBox>
    );
  }
  selectedHandle = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const index = e.currentTarget!.dataset.index!;
    const {idField} = this.props;
    this.setState((pre) => {
      const data = pre.tableData;
      const seleted = data.findIndex((val) => val.get("selected"));

      const tableData =
				seleted === -1
				  ? data.setIn([+index - 1, "selected"], true)
				  : data
				    .setIn([seleted, "selected"], false)
				    .setIn([+index - 1, "selected"], true);
      const curOptId =
				seleted === -1
				  ? data.getIn([+index - 1, idField])
				  : data.getIn([seleted, idField]);
      return {
        tableData,
        curOptId,
      };
    });
  }
  render () {
    const {
      noPageNums,
      emptyTxt,
      hasBorder,
      height
    } = this.props;
    const { perNums, curPage, tableData } = this.state;
    const totalPages = Math.ceil(tableData.size / perNums);

    const mianBody = tableData.size ? this.getTableBody() : (
      <div className="m-fixTabBody">
        <Empty
          txt={emptyTxt}
        />
      </div>
    );

    const pageSize = !noPageNums && tableData.size ? (
      <PageSize
        changeHandle={this.changeState}
        curPage={curPage}
        tableData={tableData}
        totalPages={totalPages}
        perNums={perNums}
      />
    ) : undefined;
    const borderName = hasBorder ? "g-tab-border" : "";
    const style = height ? {height: height} : undefined;
    return (
      <div className={`g-table-wrap ${borderName}`} style={style}>
        <div className="g-table" ref={this.tableContainer}>
          <div className={"m-fixTabHead "}>
            {this.getFixHead()}
          </div>
          {mianBody}
          {pageSize}
        </div>
      </div>
    );
  }
}

export default Table;
