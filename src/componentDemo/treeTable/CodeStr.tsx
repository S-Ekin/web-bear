const str1 = `/* data: any[];
  //外部通过这个值来控制下拉框的选中,多个id用字符串分隔
  initSelectVal?:{id:string};
  */
 `;
const str2 = `
 .g-content {
    flex: 1;/* 很重要，为auto的话，即使兄弟元素固定宽度，只要它缩放会影响兄弟元素 */
    overflow: hidden; // 防止子元素过宽，不能隐藏
    //  min-width: 1000px;
    min-height: 600px;
    height: 100%;
  }
  .tab-head-wrap {
    position: relative;
    overflow: hidden;

    .tab-head {
      float: left;
    }
  }
 `;
const str3 = `// 递归比较dom里table、tr高度
 function mapDom(domArr:HTMLDivElement[]){
        
        const tableArr = domArr.map(val=>val.firstElementChild!);
        const tabHArr = tableArr.map(val=>val.clientHeight).sort();
        
        if(tabHArr[0] !== tabHArr[tabHArr.length-1]){ // 高度不同

            let viewTrArr = tableArr.map(val=>{
                return val.lastElementChild!.children;
            });

            [...viewTrArr[0]].map((val,index)=>{

                const trHdom = viewTrArr.map(trArr=>{
                    return trArr[index];
                });
                const trH = trHdom.map(val=>val.clientHeight).sort();
                const trHMax = trH[trH.length-1];

                if(trH[0]!== trHMax){ // 高度不同
                    if(val.classList.contains('tree-td')){
                        const domArr = trHdom.map(val=>{
                            return val.firstChild!.firstChild! as HTMLDivElement;
                        });
                        this.mapDom(domArr);
                            
                    }else{
                            //设置高度
                            trHdom.forEach(tr=>{
                                [...tr.children].forEach(td=>{

                                    (td as HTMLTableCellElement).style.height = trHMax+"px";
                                });
                            });
                        }
                    }
            });
        }
    }`;
const str4 = ` 
//用while代替递归
    function whilefn () {
        const rootRoot = this.tabMainTabBodyDomArr;
        let domArr = [rootRoot] ;

        while (domArr.length) {
         
           const contains:any[] = [];
           domArr.forEach(arr=>{

                const tabDomArr =  arr.map(val=>{
                  return val.firstElementChild!;
                });

                const tabHArr = tabDomArr.map(val=>{
                    return val.clientHeight;
                }).sort();
                const maxH = tabHArr[tabHArr.length-1];

                if(tabHArr[0]!==maxH){ // 高度不同
                    // tslint:disable-next-line: variable-name
                    const trArr_Arr = tabDomArr.map(val=>{
                            return val.lastElementChild!.children;
                    });

                    [...trArr_Arr[0]].forEach((tr,index)=>{

                        const trDomArr = trArr_Arr.map(trArr=>{
                            return trArr[index];
                        });

                        const trHArr = trDomArr.map(val=>{
                            return val.clientHeight;
                        }).sort();

                        const trHMax = trHArr[trHArr.length-1];
                        if(tr.classList.contains('tree-td')){
                           const childDomArr = trDomArr.map(val=>{
                                return val.firstChild!.firstChild!;
                            });
                            contains.push(childDomArr);
                        }else{
                            trDomArr.forEach(val=>{
                                (val as HTMLElement).style.height = trHMax + px;
                            });
                        }
                    });
                }
           });    
           
           domArr = contains;
        }
    }`;
const str5 = ` 
class TabView extends React.PureComponent<Props,States> implements ITabView{

getBody(){
        const {data,fixObj,fixObj:{idField,childField},config,viewIndex,changeState} = this.props;
        const {child:cols} = config;
        let order = {order:0} ;
        const trs = data.map((val,index)=>{
            const arr = val.get(childField);
            const id = val.get(idField);
            const isMainView= viewIndex === 0 ;
            if(arr && arr.size){
                return (
                    <ParTree
                        key={id}
                        order={order}
                        changeState={changeState}
                        lev={0}
                        index={index}
                        node={val}
                        cols={cols}
                        isMainView={isMainView}
                        fixObj={fixObj}
                    />
                );
            }else{
                return (
                    <TrItem
                        key={id}
                        order={order}
                        node={val}
                        index={index}
                        changeState={changeState}
                        cols={cols}
                        isMainView={isMainView}
                        lev={0}
                        fixObj={fixObj}
                    />
                );
            }
        });
        const colgroup = this.createColgroup();
        const fn = !config.forzen ? this.scrollFn : undefined;
        const wheel = config.forzen ? this.wheelFn :undefined;
        const makeSignFn = !config.forzen ? this.makeSign :undefined;

        return (
                <div className="tab-body-main" 
                    onScroll={fn} 
                    onWheel={wheel}
                    onMouseEnter={makeSignFn}
                    onMouseLeave={makeSignFn}
                    ref={this.tabBodyRef} 
                >
                    <table>
                        {colgroup}
                        <tbody>
                            {trs} 
                        </tbody>
                    </table>
                </div>
        );
    }
  }

class ParTree extends React.PureComponent<Props,States> implements IParTree{
 getSubBody(){

        const {node,fixObj,fixObj:{childField,idField},cols,lev,isMainView,index,changeState,order}  = this.props;
        const arr:common['data'] = node.get(childField);
        return arr.map((val,oindex)=>{
            const children = val.get(childField);
            const id = val.get(idField);
          
            if(children && children.size){
                    return (
                        <ParTree
                            order={order}
                            key={id}
                            node={val}
                            index={index,oindex}
                            lev={lev+1}
                            changeState={changeState}
                            cols={cols}
                            isMainView={isMainView}
                            fixObj={fixObj}
                        />
                    );
            }else{  
                
                return (
                        <TrItem
                            key={id}
                            order={order}
                            lev={lev+1}
                            node={val}
                            index={index,oindex}
                            changeState={changeState}
                            cols={cols}
                            isMainView={isMainView}
                            fixObj={fixObj}
                        />
                        );
            }
        }); 

    }
    render(){
        const {cols,fixObj,node,lev,isMainView,index,changeState,order} = this.props;
        const colgroup = this.createColgroup();
        const expand = node.get('expand');
       
        return (
            <>
                <TrItem
                    node={node}
                    fixObj={fixObj}
                    cols={cols}
                    lev={lev}
                    order={order}
                    changeState={changeState}
                    index={index}
                    isMainView={isMainView}
                    isPar={true}
                />
                <tr className="tree-td">
                    <td colSpan={cols.length}>
                         <SlideBox slide={expand}>
					<div className="tab-body">
                            <table>
                                {colgroup}
                                <tbody>
                                     {this.getSubBody()}
                                </tbody>
                            </table>
                        </div>
				</SlideBox>
                        
                    </td>
                </tr> 
               
                
            </>
            
        );
    }
}

class Item extends React.PureComponent<Props,States> implements IItem{
getFirstText(text:string){
        const {lev,isPar,index,fixObj:{multiply},order} = this.props;
        const fn = isPar ? this.clickFn :undefined;
        const className = isPar ? "tree-par" : undefined;
        const check= multiply ? this.checkFn : undefined;
        const checkName = multiply ? 'tree-check' : undefined;
        order.order ++ ;
        return (
            <div onClick={fn} className={className} data-index={index}>
                <span onClick={check} className={checkName}>
                    <span style={{paddingRight: lev*14,}} />
                    {this.getCheck()}
                    {this.getIcon()}
                    {order.order}
                    {text}
                </span>
            </div>
        );
    }
    
    render(){
        const {cols,node,fixObj:{tabField},isMainView} = this.props;
        
        const tds= cols.map((td,index)=>{
            const {field,formatter} = td;
            const text = formatter ? formatter(node,index,tabField) : node.get(field);
            const str = isMainView && index === 0 ? this.getFirstText(text) : text ;
            return (
                <td key={field} className="td-border">
                    {str}
                </td>
            );
        });

        return (
            <tr >
                {tds}
            </tr>
        );
    }
  }
`;
const str6 = `const formatterTreeData = function (fixObj: filedObj,defaultVal:string,data:any[]){
const { idField:id,childField,multiply } = fixObj;
let defaultValArr = defaultVal.split(",");
//单选保证只用一个默认值
if (!multiply && defaultValArr.length > 1) {
    defaultValArr.length = 1;
}
        
let oldSelectedIndex = "";
let listSelected:IImmutalbeList<string> = Immutable.List([]);
let oindex = 0 ;
let prePath:any = [];
const immutableData: states["immutableData"] = Immutable.fromJS(
    data as node[],
    function(_key, val, path:any) {
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
            //执行目录和文件两种情况 ,添加,是否展开:expand和是否选中：active的状态
            let active: activeStatus;
            if (children.size) {
                if (multiply) {
                    const hasSelected = children.some(
                        (val: IImmutalbeMap<any>) => {
                            return (
                                val.get("active") ===
                                activeStatus.hasSelect
                            );
                        }
                    );

                    if (hasSelected) {//子文件里面有点节点是有选的状态
                        active = activeStatus.hasSelect;
                    } else {
                        //根据子文件的选择情况来做对应的选中状态
                        let selectCount = children.reduce(
                            (cur, val: IImmutalbeMap<any>) => {
                                let total = cur;
                                if (
                                    val.get("active") ===
                                    activeStatus.select
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
                    //单选
                    active = activeStatus.noSelect;
                }
            } else {
                //文件
                const isDefault = defaultValArr.includes(
                    node.get(id)
                );
                active = isDefault
                    ? activeStatus.select
                    : activeStatus.noSelect;
                if (isDefault) {
                    const idVal = node.get(id) as string;
                    listSelected.push(idVal);
                    if (!multiply) {
                        //记录单选时的索引
                        oldSelectedIndex = path!.join(",");
                    }
                }
            }
            // 计算索引
            oindex +=1;
            let countIndex:any ;
            // 判断当前的与上一个的路径是不是父子关系
            const parArr = prePath!.slice(0,prePath.length-2);
            if(path!.join(',')===parArr.join(',')){
                //父子关系,是目录
                countIndex =  children.get(0).get('order') - 1; 
            }else{
                countIndex = oindex + (path!.length - 1 ) / 2 ;
            }
            prePath = path ;
            // 节点路径
            const nodePath = path!.filter((str:string|number)=>{
                return typeof str  === 'number';
            }).join(',');
            // 节点层级
            const nodeLev = ((path!.length as number) + 1 ) / 2 ;
            //添加字段
            node = node.withMutations(map => {
                return map.set("active", active).set("expand", true)
                .set('order',countIndex).set('nodePath',nodePath).set('nodeLev',nodeLev);
            });
            return node;
        } else {
            return val.toList();
        }
    }
		);
		
		return {
            data:immutableData,
			oldSelectedIndex: oldSelectedIndex,
			selectArr:listSelected
        };
    };`;

export { str1, str2, str3, str4, str5, str6 };
