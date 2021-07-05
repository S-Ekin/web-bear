/**
 * @name 树形下拉框
 * @description description
 * @time 2019-08-17
 */
import * as React from "react";
import * as Immutable from "immutable";
import { activeStatus, DropItem } from "./DropItem";
import ParTreeItem from "./ParTreeItem";
import wrapComboHQC from "./ComboBasic";
import { CheckBox, Search } from "../input/index";
import {formatterTreeData, cascade} from './formatterTreeData';
import {Idrop, ISelected, Inode} from "./combo";
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
type props<T> = Idrop<"tree", T>;
type states<T> = {
  immutableData: Immutable.List<IImmutalbeMap<Inode & T>>;
  preData: T[];
  preInitComboVal:props<T>['initComboVal'] ;
  oldSelectedIndex:string;
  asyncDefaultVal:boolean;// 用来识别异步请求下拉框数据时，第一次是空[],虽然给了默认值，但是不会选中什么，但是当第二次有了数据后，再用这个默认值去选中，但是之后就不再使用这个。
};
interface IDropTree<T> {
  initState(prop: props<T>): states<T>;
}
class DropTree<T extends AnyObj> extends React.PureComponent<props<T>, states<T>> implements IDropTree<T> {

  static  getDerivedStateFromProps (nextProps:props<AnyObj>, preState:states<AnyObj>):Partial<states<AnyObj>> | null {

    if (nextProps.data !== preState.preData) {

      let defaultVal = "";
      if (nextProps.initComboVal !== preState.preInitComboVal) {
        defaultVal = nextProps.initComboVal ? nextProps.initComboVal.id : "";
      } else {
        if (preState.asyncDefaultVal) {
          defaultVal = nextProps.filedObj.get("defaultVal")!;
        } else {
          defaultVal = nextProps.selected.map((val) => val.id).join(",");
        }
      }

      // 先保留之前选择的，再加上initComVal要选择的，
      // 当是单选时，存在一个问题，是要保留已经选择的还是用initComboVal?有时会同时改变数据和initComboVal!（比如新增一个下拉选项，并且要选中这个新的）
      // 目前的操作时，先保留之前选择的
      const {data, oldSelectedIndex} = formatterTreeData(nextProps, defaultVal, nextProps.data);
      return {
        immutableData: data,
        oldSelectedIndex,
        preData: nextProps.data,
        preInitComboVal: nextProps.initComboVal
      };
    } if (nextProps.initComboVal !== preState.preInitComboVal) {
      const defaultVal = nextProps.initComboVal ? nextProps.initComboVal.id : "";
      const {data, oldSelectedIndex} = formatterTreeData(nextProps, defaultVal, nextProps.data);
      return {
        immutableData: data,
        oldSelectedIndex,
        preData: nextProps.data,
        preInitComboVal: nextProps.initComboVal
      };
    } else {
      return null;
    }
  }
  constructor (prop:props<T>) {
    super(prop);
    this.state = this.initState(prop);
    const { clickMethod } = prop;
    clickMethod(this.clickItem);
  }
  initState (prop: props<T>):states<T> {
    const defaultVal = prop.filedObj.get("defaultVal") || "";
    const obj = formatterTreeData(prop, defaultVal, prop.data);
    return {
      immutableData: obj.data,
      preData: prop.data,
      preInitComboVal: prop.initComboVal,
      oldSelectedIndex: obj.oldSelectedIndex,
      asyncDefaultVal: prop.data.length === 0
    };
  }

  clear () {
    const {data, oldSelectedIndex} = formatterTreeData(this.props, "", this.props.data, true);

    this.setState({
      immutableData: data,
      oldSelectedIndex
    });
    this.props.changeSelect(Immutable.List([]));
  }
  clickItem=(id?:string) => {
    if (!id) {
      this.clear();
    } else {
      // 重新把数据格式化一篇得原因是，清楚已经选的，只选择传入得id，
      const {data, oldSelectedIndex} = formatterTreeData(this.props, id, this.props.data);
      this.setState({
        immutableData: data,
        oldSelectedIndex,
      });
    }

  }
  searchMap (
    data: T[],
    childField: string,
    key: string,
    textField: string
  ):T[] {
    return data.filter((val) => {

      const itemText = val[textField] as string || "";
      const isContainer = itemText.includes(key);
      const child  = val[childField];

      if (child && child.length) {

        if (isContainer) {
          return true;
        } else {
          const arr = this.searchMap(child, childField, key, textField);
          (val as AnyObj)[childField] = arr;
          return arr.length;
        }
      } else {

        return isContainer;
      }
    });
  }
  searchFn = (key: string) => {

    const { filedObj, data, selected, initSelect} = this.props;
    const childField = filedObj.get("childField")!;
    const textField = filedObj.get("textField");
    const copyData = JSON.parse(JSON.stringify(data));
    let searchReswult = this.searchMap(copyData, childField, key, textField);

    const defaultVal = selected.map((val) => val.id).join(",");
    const {data: immutableData, oldSelectedIndex} = formatterTreeData({filedObj, initSelect}, defaultVal, searchReswult, true);
		 this.setState({
      immutableData,
      oldSelectedIndex,
		 });
  }

  clickFnForTreeMethod=(path:string) => {
    this.clickFn(path);
  }

  clickFn (index: string) {
    const { filedObj, selected, changeSelect } = this.props;
    const multipy = filedObj.get("multiply");
    const idField = filedObj.get("idField");
    const textField = filedObj.get("textField");
    const childField = filedObj.get("childField");
    const clickForbid = filedObj.get("clickOrCheckForbid")!;
    const comField = filedObj.get("field");
    const indexArr = index
      .split(",")
      .join(`,${childField!},`)
      .split(",");
    const indexArrString = indexArr.join(",");
    this.setState(
      (pre) => {
        const data = pre.immutableData;

        let oldSelectedIndex = pre.oldSelectedIndex;
        let _data = data;
        let _select = selected;
        let newNode: IImmutalbeMap<Inode & T> = _data.getIn(indexArr);
        if (!newNode) {
          return null;
        }
        // 判断是否禁止点击
        if (clickForbid(newNode, comField, selected)) {
          return null;
        }
        // 单选清除以前选中的
        if (oldSelectedIndex === indexArrString) {
          // 点击的是同一个
          return null;
        }
        if (oldSelectedIndex) {
          _data = _data.updateIn(
            oldSelectedIndex.split(","),
            (val: IImmutalbeMap<Inode>) => val.set("active", activeStatus.noSelect)
          );
        }
        _select = _select.clear();
        _data = _data.updateIn(indexArr, (val: IImmutalbeMap<Inode & T>) => {
          // 判断这个node有没有被选中
          const active =
						val.get("active") === activeStatus.select
						  ? activeStatus.noSelect
						  : activeStatus.select;

          if (active === activeStatus.select) {
            _select = _select.push({
              id: val.get(idField),
              text: val.get(textField),
            });
          } else {
            if (multipy) {
              _select = _select.filter((_val) => _val.id !== val.get(idField));
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const node = val.set("active", active as any);
          newNode = node;
          return node;
        });

        changeSelect(_select, newNode);
        return {
          immutableData: _data,
          oldSelectedIndex: indexArrString
        };
      }
    );
  }
  checkMethod=(path:string) => {
    this.checkFn(path);
  }
  checkFn (value: string) {
    const { filedObj, selected } = this.props;

    const childField = filedObj.get("childField")!;
    const idField = filedObj.get("idField");
    const textField = filedObj.get("textField");
    const clickForbid = filedObj.get("clickOrCheckForbid")!;
    const comField = filedObj.get("field");
    const indexArr = value
      .split(",")
      .join(`,${childField},`)
      .split(",");

    this.setState((pre) => {
      const data = pre.immutableData;

      let _data = data;
      let _select = selected;
      let newNode = _data.getIn(indexArr);
      if (!newNode) {
        return null;
      }
      // 判断是否禁止点击
      if (clickForbid(newNode, comField, selected)) {
        return null;
      }

      _data = _data.updateIn(indexArr, (val: IImmutalbeMap<Inode & T>) => {
        // 判断这个node有没有被选中
        const active =
					val.get("active") === activeStatus.select
					  ? activeStatus.noSelect
					  : activeStatus.select;

        if (active === activeStatus.select) {
          _select = _select.push({
            id: val.get(idField),
            text: val.get(textField),
          });
        } else {
          _select = _select.filter((_val) => _val.id !== val.get(idField));
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const node = val.set("active", active as any);
        newNode = node;
        return node;
      });
      _data = cascade(value, _data, childField);
      this.props.changeSelect(_select, newNode);

      return {
        immutableData: _data,
      };
    });
  }
  mapFn (
    list: IImmutalbeList<IImmutalbeMap<Inode & T>>,
    active: activeStatus,
    select: IImmutalbeList<ISelected>,
    filedObj: {
      idField: string;
      textField: string;
      childField: string;
    }
  ) {
    let _select = select;
    const { idField, childField, textField } = filedObj;
    const arr = list.map((val) => {
      let _child = val.get(childField) as IImmutalbeList<
      IImmutalbeMap<Inode & T>
      >;
      let _node = val;
      if (_child.size) {
        const result = this.mapFn(_child, active, _select, filedObj);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _node = _node.set(childField, result.arr as any);
        // 改变select
        _select = result.selecte;
      } else {
        if (active === activeStatus.select) {
          // 清除之前选的，现在再选一次，保证选择的顺序
          if (_node.get("active") === activeStatus.select) {
            _select = _select.filter((_val) => _val.id !== _node.get(idField));
          }

          _select = _select.push({
            id: _node.get(idField),
            text: _node.get(textField),
          });
        } else {
          _select = _select.filter((_val) => _val.id !== _node.get(idField));
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return _node.set("active", active as any);
    });

    return {
      arr: arr,
      selecte: _select,
    };
  }
  checkForPar=(value:string) => {
    this.checkForParFn(value);
  }
  checkForParFn (value: string) {
    const { filedObj, selected } = this.props;
    const childField = filedObj.get("childField")!;
    const idField = filedObj.get("idField");
    const textField = filedObj.get("textField");
    const clickForbid = filedObj.get("clickOrCheckForbid")!;
    const comField = filedObj.get("field");
    const indexArr = value
      .split(",")
      .join(`,${childField},`)
      .split(",");

    this.setState((pre) => {
      const data = pre.immutableData;

      let _data = data;
      let _select = selected;
      let newNode = _data.getIn(indexArr);

      if (!newNode) {
        return null;
      }
      // 判断是否禁止点击
      if (clickForbid(newNode, comField, selected)) {
        return null;
      }
      _data = _data.updateIn(indexArr, (val: IImmutalbeMap<Inode & T>) => {
        // 判断这个node有没有被选中
        let node = val;
        const active =
					node.get("active") === activeStatus.select
					  ? activeStatus.noSelect
					  : activeStatus.select;

        // 选中所有的子文件
        node = node.withMutations((map) => {
          let _child = map.get(childField) as IImmutalbeList<
          IImmutalbeMap<Inode & T>
          >;
          let _map = map;

          const result = this.mapFn(_child, active, selected, {
            idField,
            childField,
            textField,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _map = _map.set(childField, result.arr as any);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          _map = _map.set("active", active as any);

          // 改变selecte
          _select = result.selecte;

          return _map;
        });
        newNode = node;
        return node;
      });
      _data = cascade(value, _data, childField);
      this.props.changeSelect(_select, newNode);

      return {
        immutableData: _data,
      };
    });
  }
  closeFn = () => {
    const {data, selected} = this.props;
    const defaultVal = selected.map((val) => val.id).join(",");
    const {data: immutableData, oldSelectedIndex} = formatterTreeData(this.props, defaultVal, data, true);

    this.setState({
      immutableData,
      oldSelectedIndex
    });
  }
  toggleExpand = (index: string) => {
    const { filedObj } = this.props;
    let indexStrArr = index.split(",");
    const indexArr = indexStrArr.join(`,${filedObj.get("childField")!},`);
    indexStrArr = indexArr.split(",");

    this.setState((pre) => {
      const data = pre.immutableData;
      const _data = data.updateIn(
        indexStrArr,
        (node: IImmutalbeMap<Inode>) => {

          if (!node) {
            return;
          }
          const expand = !node.get("expand");
          const _node = node.set("expand", expand);

          return _node;
        }
      );

      return {
        immutableData: _data,
      };
    });
  }
  main () {
    const { immutableData } = this.state;
    const { filedObj, dropStyle, formatterDropItem} = this.props;
    const idField = filedObj.get("idField");
    const childField = filedObj.get("childField");
    const multiply = filedObj.get("multiply");
    const noSearch = filedObj.get("noSearch");
    const com = immutableData.map((node, index) => {
      const child = node.get(childField!) as states<T>["immutableData"];
      const id = node.get(idField);
      return child.size ? (
        <ParTreeItem
          key={id}
          node={node}
          fieldObj={filedObj}
          clickFn={this.clickFnForTreeMethod}
          index={`${index}`}
          lev={0}
          formatterDropItem={formatterDropItem}
          checkForPar={this.checkForPar}
          checkMethod={this.checkMethod}
          toggleExpand={this.toggleExpand}
        />
      ) : (
        <DropItem
          key={id}
          node={node}
          fieldObj={filedObj}
          index={`${index}`}
          checkMethod={this.checkMethod}
          formatterDropItem={formatterDropItem}
          lev={0}
          clickFn={this.clickFnForTreeMethod}
          CheckBox={multiply ? CheckBox : undefined}
        />
      );
    });
    const searchCom = !noSearch ? (
      <div style={{ paddingBottom: "0.5em", }}>
        <Search
          field="search"
          searchHandle={this.searchFn}
          closeHandle={this.closeFn}
        />
      </div>
    ) : undefined;
    return (
      <div className="drop-main">
        {searchCom}
        <ul style={dropStyle} className="drop-ul">
          {com}
        </ul>
      </div>
    );
  }

  render () {
    return this.props.disabled ? null : this.main();
  }
}
export {DropTree};
export default wrapComboHQC(DropTree, "tree");
