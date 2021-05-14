import * as Immutable from "immutable";
import {ICommon} from "./mytreeTable";
// eslint-disable-next-line no-shadow
enum activeStatus {
  select = "selected",
  hasSelect = "hasSelect",
  noSelect = "noSelect",
}
type filedObj = {
  idField:string;
  multiply?:boolean;
  childField:string;
};

type Inode = ICommon['node'];
type states = {
  immutableData: Immutable.List<IImmutalbeMap<Inode>>;
};

// 当由外部控制选什么的时候，defaultVal,是又外部输入的,data:可以传入
const formatterTreeData = function (fixObj: filedObj, defaultVal:string, data:any[]) {
  const { idField: id, childField, multiply } = fixObj;
  let defaultValArr = defaultVal.split(",");
  // 单选保证只用一个默认值
  if (!multiply && defaultValArr.length > 1) {
    defaultValArr.length = 1;
  }

  let oldSelectedIndex = "";
  let listSelected:IImmutalbeList<string> = Immutable.List([]);
  // let oindex = 0 ;
  // let prePath:any = [];
  const immutableData: states["immutableData"] = Immutable.fromJS(
    data as Inode[],
    function (_key, val, path:any) {
      if (Immutable.isKeyed(val)) {
        let node = (val as Immutable.Collection.Keyed<
        string,
        any
        >).toOrderedMap();
        let children = node.get(childField!) as Immutable.List<any>;
        if (!children) {
          children = Immutable.List([]);
          node = node.set(childField!, children);
        }
        // 执行目录和文件两种情况 ,添加,是否展开:expand和是否选中：active的状态
        let active: activeStatus;
        if (children.size) {
          if (multiply) {
            const hasSelected = children.some(
              (vals: IImmutalbeMap<AnyObj>) => (
                vals.get("active") === activeStatus.hasSelect
              )
            );

            if (hasSelected) {// 子文件里面有点节点是有选的状态
              active = activeStatus.hasSelect;
            } else {
              // 根据子文件的选择情况来做对应的选中状态
              let selectCount = children.reduce(
                (cur, vals: IImmutalbeMap<AnyObj>) => {
                  let total = cur;
                  if (
                    vals.get("active") === activeStatus.select
                  ) {
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
            `${node.get(id)}`
          );
          active = isDefault
            ? activeStatus.select
            : activeStatus.noSelect;
          if (isDefault) {
            const idVal = node.get(id) as string;
            listSelected.push(idVal);
            if (!multiply) {
              // 记录单选时的索引
              oldSelectedIndex = path!.join(",");
            }
          }
        }

        // // 计算索引
        // oindex +=1;
        // let countIndex:any ;
        // // 判断当前的与上一个的路径是不是父子关系
        // const parArr = prePath!.slice(0,prePath.length-2);
        // if(path!.join(',')===parArr.join(',')){
        // 	//父子关系,是目录
        // 	countIndex =  children.get(0).get('order') - 1;
        // }else{
        // 	countIndex = oindex + (path!.length - 1 ) / 2 ;
        // }
        // prePath = path ;
        // // 节点路径
        // const nodePath = path!.filter((str:string|number)=>{
        // 	return typeof str  === 'number';
        // }).join(',');
        // // 节点层级
        // const nodeLev = ((path!.length as number) + 1 ) / 2 ;

        // 添加字段
        node = node.withMutations((map) =>
						 map.set("active", active).set("expand", true)

          // .set('order',countIndex).set('nodePath',nodePath).set('nodeLev',nodeLev);
        );
        return node;
      } else {
        return val.toList();
      }
    }
  );

  return {
    data: immutableData,
    oldSelectedIndex: oldSelectedIndex,
    selectArr: listSelected
  };
};

// 级联选中
const cascade = function (
  path: string,
  data: states["immutableData"],
  childField: string
) {
  let _data = data;
  const pathArr = path.split(',');
  pathArr.pop();

  _data = _data.withMutations((list) => {
    let _list = list;

    // 检查上一级的状态
    while (pathArr.length) {
      const path = pathArr.join(`,${childField},`).split(",");

      _list = _list.updateIn(path, (nodes) => {
        let _node = nodes;
        const child = _node.get(
          childField
        ) as states["immutableData"];

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

export {formatterTreeData, cascade, activeStatus};
