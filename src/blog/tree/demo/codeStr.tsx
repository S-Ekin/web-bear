/**
 * @name name...
 * @description ...
 */

const str1 = `class CreateTree {

    // 递归
    mapTreeFn(data: any[], childId: number) {

		const resData: any[] = [];
		const childArr = data.filter(val => {
			
			const isPar = val.PAR_CATEGORY_ID === childId ;

			if (!isPar) {
				// 筛选没有用到的
				resData.push(val);
			}

			return isPar ;
		
		
		});
		if (!childArr.length) {
			return [] ;
		}	
		const res = childArr.map(val => {

			const {CATEGORY_ID, CATEGORY_NAME, PAR_CATEGORY_ID, TYPE_ID} = val ;

			const child:any[] = this.mapTreeFn(resData , CATEGORY_ID);
			const node = {
				id: CATEGORY_ID,
				type_id: TYPE_ID,
				name: '',
				text: CATEGORY_NAME,
				par_id: PAR_CATEGORY_ID,
				hierarchy: 1,
				children: child,
			} ;
			return node ;
		});

		return res;

    }
    
    treeByObj (data:any[]) {
	
			const orgObject: {[key: string]: any} = {};
			const resData: any[] = [];
			// 以id 和 node 作为键值对 ，
			// 通过node 的par_id在orgObject里找匹配的父节点，
			// 又有对象的引用关系，就可以构建tree
			data.forEach(node => {
				const { ID, NAME, PAR_ID, TYPE, USER_NUMBER, STATUS } = node;

				const item = {
					id: ID,
					status: STATUS,
					name: NAME,
					par_id: PAR_ID,
					type: TYPE,
					user_number: USER_NUMBER,
					children: [],
				};
				orgObject[ID] = item;

				if (PAR_ID === -2) {// 根目录
					resData.push(item);
				}
			});

			const orgArrValues: any[] = Object.values(orgObject);

			orgArrValues.forEach(val => {
				const { par_id } = val ;
				const par = orgObject[par_id] ;
				if (par) {
					par.children.push(val);
				}
			});


			return resData[0] ;
		
	}

}
`;

const str2 = `
	// 找到某个节点拥有的总的最底层的子节点数（即所有的叶子节点不包括目录）
    mapFindNodeChildTotal (total, arr) {
        let leg = total;
        arr.map(val => {
            const { children } = val;
            if (children && children.length) {
              leg = leg + this.mapFindNodeChildTotal(total, children);
            } else {
                leg = leg + 1;
            }
        });
        return leg;
    }

	// 找出最大的层级 和 设置每个节点总共拥有的最底层的字节点的数（即所有的叶子节点不包括目录）
    mapTreeSetChildTotalAndFindMaxLev (arr, levObj, lev) {
        let leg = 0;
        lev = lev + 1;
        arr.map(val => {
            const { children } = val;
            const childLeg = children ? children.length : 0;
            if (childLeg) {
              const totalLeg = this.mapTreeSetChildTotalAndFindMaxLev(children, levObj, lev);
              val._leg = totalLeg;
              leg = leg + totalLeg;
            } else {
              val._leg = 0;
              leg = leg + 1;
              if (levObj.lev < lev) {
                levObj.lev = lev;
              }  
            }
        });
        return leg;
    }

	// 通过tree创建合并的表格
    mapCreateTd (arr, lev, childrenArr) {
            const curLev = lev + 1;
            return arr.map((val) => { 
                const { children } = val;
                const leg = children ? children.length : 0;
                const node = {
                        val,
                        hasExist: false,
                };
                childrenArr[curLev] = node;
                if (leg) {
                    const trs = this.mapCreateTd(children, curLev, childrenArr);
                    return trs.join("");
                } else {
                    // 最后一级，也是每行最后的td,开始拼接 tr -td
                    const childrenArrLeg = childrenArr.length;
                    const tds = childrenArr.map((td, oindex) => {
                        const { val, hasExist } = td;
                        const { kpi_name: KpiName } = val;
                        if (oindex === childrenArrLeg - 1) {
                            return <td>{KpiName}</td>·;
                        } else {
                            let str = "";
                            if (!hasExist) {
                                const legTotal = val._leg;
                                const rowspan = legTotal ? "rowspan='{legTotal}'" : "";
                                str = <td {rowspan}>{KpiName}</td>;
                                td.hasExist = true;
                                return str;
                            }
                        }
                    });
                    return <tr>{tds.join("")}</tr>;
                }
            });
    }
`;

const str3 = `

const compareFn = (a:number,b:number)=>a-b;
const  whileDomH = () => {
        const rootRoot = document.getElementsByClassName("tree")!;
        let domArr = [[...rootRoot]] ;

        while (domArr.length) {
         
           const contains:any[] = [];
           domArr.forEach(arr=>{

                const tabDomArr =  arr.map(val=>{
                  return val.firstElementChild!;
                });

                const tabHArr = tabDomArr.map(val=>{
                    return val.clientHeight;
                }).sort(compareFn);
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
                        }).sort(compareFn);

                        const trHMax = trHArr[trHArr.length-1];
                        if(tr.classList.contains('tree-td')){
                           const childDomArr = trDomArr.map(val=>{
                                return val.firstChild!.firstChild!;
                            });
                            contains.push(childDomArr);
                        }else{
                            trDomArr.forEach(val=>{
                                (val as HTMLElement).style.height = "{trHMax}px";
                            });
                        }
                    });
                }
           });    
           
           domArr = contains;
        }
    }`;

export { str1, str2, str3 };
