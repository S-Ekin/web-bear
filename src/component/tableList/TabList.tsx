/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import * as Immutable from "immutable";
import TabView from './TabView';
import {GroupCols} from './GroupCols';
import {Empty} from "../my-icon/index";
import PageSize from './PageSize';
import {ICommon} from "./mytablist";

type childType =React.ComponentElement<ICommon['groupCol'], any> ;
type Props={
  data: AnyObj[];
  children: childType[] | childType;
  height?:number;
  noOrder?:boolean;
  noPageNums?: boolean;// 页码
  idField: string;// 表格的节点标识
  multiply?: boolean;// 多选
  defaultSel?: string;// 默认选中的
  tabField?: string;// 表格标识
  emptyTxt?: string;// 空数据时显示文字
  getCheckFn?:(fn:any)=>void;// 获取选中的
  initSelectVal?:{id:string};// 通过外界改变表格的选中
  bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<AnyObj>>)=>void;// 把获取选中的项的函数传递给外部
};
type States={
  immutabData:IImmutalbeList<IImmutalbeMap<AnyObj>>;
  selectArr:IImmutalbeList<string>;
  perNums: number; // 每页条数
  curPage: number; // 当前页数
  tableData: IImmutalbeList<IImmutalbeMap<AnyObj>>;
  preData:AnyObj[];
  preInitSelect?:{id:string}
};
type config =ICommon['config'];
type fixObj = {
  tabField:string;
  emptyTxt:string;
  idField:string;
  multiply?:boolean;
  defaultSel:string;
};
interface ITabList {
  fieldArr:config[];
  fixObj:fixObj;
}
const compareFn = (a:number, b:number) => a - b;
const tableInitData = (data:Props["data"], defaulSel:string, idField:string) => {
  const defaulSelArr = `${defaulSel}`.split(",");
  return  Immutable.fromJS(data, (_key, val) => {
    if (Immutable.isKeyed(val)) {
      // 对象
      let obj = val.toOrderedMap();
      const id = val.get(idField) as string;
      // 添加选中的字段
      obj = obj.set("checked", defaulSelArr.includes(`${id}`));
      return obj;
    } else {
      // 数组
      return val.toList();
    }
  });
};
class TabList extends React.PureComponent<Props, States> implements ITabList {
  static defaultProps = {
    height: 300
  };
  static  getDerivedStateFromProps (nextProps:Props, preState:States):Partial<States> | null {
    if (nextProps.data !== preState.preData || nextProps.initSelectVal !== preState.preInitSelect) {
      const newData = nextProps.data;
      const {idField} = nextProps;
      const defaultSel = nextProps.initSelectVal ? nextProps.initSelectVal.id : nextProps.defaultSel!;
      const data = tableInitData(newData, defaultSel, idField);
      return {
        preData: newData,
        immutabData: data,
        selectArr: Immutable.List([]),
        curPage: 1,
      };

    } else {
      return null;
    }
  }

  fieldArr:ITabList['fieldArr'];
  fixObj:ITabList['fixObj'];
  tabMainTabBodyDomArr:HTMLDivElement[] = [];
  constructor (props:Props) {
    super(props);
    const {children, data, idField, defaultSel, initSelectVal, noPageNums} = this.props;
    this.fieldArr = this.getFieldArr(children);

    const immutabData = tableInitData(data, defaultSel!, idField);
    this.fixObj = this.initFixObj();
    this.state = {
      immutabData,
      preData: data,
      selectArr: Immutable.List(),
      preInitSelect: initSelectVal,
      perNums: 20,
      curPage: 1,
      tableData: noPageNums ? immutabData : this.getDataByPageAndPerNum(1, 20, immutabData)
    };

  }
  getDataByPageAndPerNum (curPage:number, perNums:number, immutabData:States['immutabData']) {
    const startIndex = (curPage - 1) * perNums;
    return immutabData.slice(startIndex, perNums + startIndex);
  }
  getFieldArr (arr:Props['children']) {
    const {noOrder, multiply} = this.props;
    return React.Children.map(arr, function (val, index) {

      const {children, forzen, } = val.props;
      let widTotal = 0;
      const child = React.Children.map(children, function (node) {
        const {children, width, field, formatter, align} = node.props;
        widTotal += width;
        return {
          width, field, formatter, text: children, align
        };
      });


      if (!noOrder && index === 0) {
        const orderCol = {
          width: 60,
          field: "order",
          text: '序号',
          formatter: undefined,
          align: 'center'
        };
        child.unshift(orderCol);
        widTotal += 60;
      }
      if (multiply && index === 0) {
        const checkCol:any = {
          width: 60,
          field: "check",
          text: '全选',
          formatter: undefined,
          align: 'center'
        };
        child.unshift(checkCol);
        widTotal += 60;
      }

      return {
        child,
        width: widTotal,
        forzen
      };

    });
  }
  initFixObj () {
    const {tabField, idField, multiply, defaultSel, emptyTxt, noOrder} = this.props;
    return {
      tabField: tabField!,
      emptyTxt: emptyTxt!,
      idField: idField!,
      multiply,
      noOrder,
      defaultSel: defaultSel!,
    };
  }
  setTabBodyDom=(dom:HTMLDivElement, index:number) => {

    this.tabMainTabBodyDomArr[index] = dom;

  }
  changeScrollTop=(top:number, index:number) => {

    this.tabMainTabBodyDomArr.map((val, oindex) => {
      if (oindex !== index) {
        val.scrollTop = top;
      }
    });
  }
  changeState:ICommon['changeState']=(path, key) => {

    const index = ~~path - 1;
    if (key === 'active') {
      this.setState((pre) => {
        const data = pre.immutabData.updateIn([index], (node) => {

          const status = node.get('checked');

          return node.set('checked', !status);
        });

        const pageData = this.getDataByPageAndPerNum(pre.curPage, pre.perNums, data);

        return {
          immutabData: data,
          tableData: pageData
        };
      });
    } else if (key === "checkPar") {

      const {noPageNums} = this.props;
      this.setState((pre) => {
        const {curPage, perNums, immutabData} = pre;
        let num:number;
        if (!noPageNums) {
          // 看最后一页是不是满的
          const rest = curPage * perNums - immutabData.size;
          num = rest > 0 ? perNums - rest : perNums;
        } else {
          num = immutabData.size;
        }
        let newData = pre.immutabData;
        Array.from({ length: num }).forEach((_val, oindex) => {
          // 计算要从当前页的起始位置开始
          newData = newData.updateIn(
            [oindex + (curPage - 1) * perNums],
            (val) => val.set("checked", path !== "true")
          );
        });

        return {
          immutabData: newData,
          tableData: this.getDataByPageAndPerNum(curPage, perNums, newData)
        };
      });
    }
  }
  // 比对所有区域的高度，设置为一样高
  setSameH () {
    let domArr = this.tabMainTabBodyDomArr;
    if (domArr.length < 2) {
      return;
    }
    const tabDom = domArr.map((val) => val.firstElementChild!);
    const tabHArr = tabDom.map((val) => val.clientHeight).sort(compareFn);
    const tabHMax = tabHArr[tabHArr.length - 1];
    if (tabHArr[0] !== tabHMax) {
      const trDomArr = tabDom.map((val) => val.lastElementChild!.children);
      [...trDomArr[0]].forEach((_val, index) => {

        const trCompareDom = trDomArr.map((val) => val[index]);
        const trHArr = trCompareDom.map((val) => val.clientHeight).sort(compareFn);
        const trHMax = trHArr[trHArr.length - 1];
        if (trHMax !== trHArr[0]) {
          trCompareDom.forEach((element) => {
            [...(element as HTMLTableRowElement).children]!.forEach((td) => {

              (td as HTMLTableCellElement).style.height = `${trHMax}px`;
            });
          });
        }
      });
    }
  }
  setDom () {
    this.setSameH();
    this.setTabViewBottomFixHeight();
  }
  viewMap () {
    const {tableData, perNums, curPage} = this.state;
    const startIndex = (curPage - 1) * perNums;
    return this.fieldArr.map((group, index) => (
      <TabView
        config={group}
        key={index}
        setTabBodyDom={this.setTabBodyDom}
        changeScrollTop={this.changeScrollTop}
        data={tableData}
        viewIndex={index}
        startIndex={startIndex}
        changeState={this.changeState}
        fixObj={this.fixObj}
      />
    ));
  }
  componentDidMount () {
    this.setDom();
  }
  setTabViewBottomFixHeight () {
    const arr = this.fieldArr;
    const res = this.tabMainTabBodyDomArr.findIndex((val, index) => {
      let status = false;
      if (!arr[index].forzen) { // 有横的滚动条
        status =   val.scrollWidth > val.clientWidth;
      }
      return status;
    });

    if (res !== -1) {
      this.tabMainTabBodyDomArr.forEach((val, index) => {
        if (arr[index].forzen) {
          val.classList.add('tab-over-wid');
        } else if (res !== index) {
          if (val.scrollWidth <= val.clientWidth) {
            val.classList.add('tab-over-wid');
          }
        }
      });
    } else {
      this.tabMainTabBodyDomArr.forEach((val) => {
        val.classList.remove('tab-over-wid');
      });
    }
  }

  changePageHandle=(key:'curPage' | "perNums", val:number) => {

    if (key === "curPage") {
      this.setState((pre) => {
        const perNums = pre.perNums;
        return {
          curPage: val,
          tableData: this.getDataByPageAndPerNum(val, perNums, pre.immutabData)
        };
      }, () => {
        this.setDom();
      });
    } else if (key === "perNums") {
      this.setState((pre) => ({
        perNums: val,
        curPage: 1,
        tableData: this.getDataByPageAndPerNum(1, val, pre.immutabData)
      }), () => {
        this.setDom();
      });
    }


  }
  render () {
    const {height, emptyTxt, noPageNums} = this.props;
    const {immutabData, curPage, perNums} = this.state;
    const hasData = !!immutabData.size;
    const body =  hasData ? this.viewMap() : <Empty txt={emptyTxt} />;
    const totalPages = Math.ceil(immutabData.size / perNums);
    const page =  !noPageNums ? (
      <PageSize
        curPage={curPage}
        perNums={perNums}
        totalNums={immutabData.size}
        totalPages={totalPages}
        changeHandle={this.changePageHandle}

      />
    ) : undefined;
    const styleObj = height ? {height: height, } : undefined;
    return (
      <div className="treeTap-wrap" style={styleObj}>
        <div className="treeTab">
          {body}
        </div>
        {page}
      </div>

    );
  }
}


export  {TabList, GroupCols};
