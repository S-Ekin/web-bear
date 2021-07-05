import * as Immutable from "immutable";
import {Idrop, ISelected, Inode} from "./combo";
import {IImmutalbeMap, IImmutalbeList} from "../util/immutableUtil";
// eslint-disable-next-line no-shadow
enum activeStatus {
  select = "selected",
  hasSelect = "hasSelect",
  noSelect = "noSelect",
}
type Iprops<T> = {
  filedObj:Idrop<"tree", T>['filedObj'];
  initSelect:Idrop<'tree', T>['initSelect'];
} ;

type states<T> = {
  immutableData: Immutable.List<IImmutalbeMap<Inode & T>>;
};
// 当由外部控制选什么的时候，defaultVal,是又外部输入的,data:可以传入
const formatterTreeData = function <K extends AnyObj> (props: Iprops<K>, defaultVal:string, data:K[], noInitState?:boolean) {
  const { filedObj, initSelect } = props;
  const id = filedObj.get("idField");
  const text = filedObj.get("textField");
  const childField = filedObj.get("childField");
  let defaultValArr = defaultVal.split(",");

  const multiply = filedObj.get("multiply");
  if (!multiply && defaultValArr.length > 1) {
    defaultValArr.length = 1;
  }
  let oldSelectedIndex = "";
  let listSelected: ISelected[] = [];

  const immutableData: states<K>["immutableData"] = Immutable.fromJS(data as AnyObj[], function (_key, val, path) {
    if (Immutable.isKeyed(val)) {
      let node = (val as IImmutalbeMap<Inode>).toOrderedMap() as IImmutalbeMap<Inode & K>;
      let children = node.get(childField!) as IImmutalbeList<IImmutalbeMap<Inode & K>>;
      if (!children) {
        children = Immutable.List([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node = node.set(childField!, children as any);
      }
      // 执行目录和文件两种情况 ,添加,是否展开:expand和是否选中：active的状态
      let active: activeStatus;
      if (children.size) {
        if (multiply) {
          const hasSelected = children.some(
            (child: IImmutalbeMap<Inode & K>) => (
              child.get("active") === activeStatus.hasSelect
            )
          );

          if (hasSelected) {// 子文件里面有点节点是有选的状态
            active = activeStatus.hasSelect;
          } else {
            // 根据子文件的选择情况来做对应的选中状态
            let selectCount = children.reduce((cur, child) => {
              let total = cur;
              if (child.get("active") === activeStatus.select) {
                total++;
              }
              return total;
            },
            0
            );
            const childSize = children.size;
            if (selectCount === childSize) {
              active = activeStatus.select;
            } else if (selectCount === 0) {
              active = activeStatus.noSelect;
            } else {
              active = activeStatus.hasSelect;
            }
          }
        } else {
          // 单选
          active = activeStatus.noSelect;
        }
      } else {
        // 文件
        const isDefault = defaultValArr.includes(
          `${node.get(id) as string}`
        );
        active = isDefault
          ? activeStatus.select
          : activeStatus.noSelect;
        if (isDefault) {
          listSelected.push({
            id: node.get(id),
            text: node.get(text),
          });
          if (!multiply) {
            // 记录单选时的索引
            oldSelectedIndex = path!.join(",");
          }
        }
      }
      // 添加字段
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node = node.withMutations((map) => map.set("active", active as any).set("expand", true as any));
      return node;
    } else {
      return val.toList();
    }
  }
  );

  // 重置之前选择的
  // this.oldSelectedIndex = oldSelectedIndex;

  // 显示默认选中的,并且按照默认的顺序显示
  if (defaultVal) {
    const initDefaultSelectArr = defaultValArr.map((select) =>
      // tslint:disable-next-line: triple-equals
      listSelected.find((val) => val.id == select)!
    ).filter((val) => val);

    listSelected = initDefaultSelectArr;
  }
  // 显示默认选中的
  if (!noInitState) {
    initSelect(Immutable.List(listSelected));
  }

  return {
    data: immutableData,
    oldSelectedIndex: oldSelectedIndex
  };
};

// 级联选中
const cascade = function<T extends AnyObj> (
  pathIndex: string,
  data: states<T>["immutableData"],
  childField: string
) {
  let _data = data;
  let pathArr = pathIndex.split(",");
  pathArr.pop();

  _data = _data.withMutations((list) => {
    let _list = list;

    // 检查上一级的状态
    while (pathArr.length) {
      const path = pathArr.join(`,${childField},`).split(",");

      _list = _list.updateIn(path, (node) => {
        let _node = node;
        const child = _node.get(
          childField
        ) as states<T>["immutableData"];

        const hasSelect = child.some(
          (val) => val.get("active") === activeStatus.hasSelect
        );
        let active: activeStatus;
        if (hasSelect) {
          active = activeStatus.hasSelect;
        } else {
          const selectCount = child.reduce((cur, val) => {
            let total = cur;
            if (val.get("active") === activeStatus.select) {
              total++;
            }

            return total;
          }, 0);
          const childSize = child.size;

          if (selectCount === childSize) {
            active = activeStatus.select;
          } else if (selectCount === 0) {
            active = activeStatus.noSelect;
          } else {
            active = activeStatus.hasSelect;
          }
        }

        return _node.set("active", active);
      });

      // 删除最后一个路径，获取上一级的节点
      pathArr.pop();
    }

    return _list;
  });

  return _data;
};

export {formatterTreeData, cascade};
