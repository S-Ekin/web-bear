/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import CodeBlock from "@container/codeBlock/CodeBlock";

type Props={

};
type States={

};
const str1 =`
class CreateTree {

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

class Demo extends React.PureComponent<Props,States> {


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    创造自由树
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show">
                         <CodeBlock tit='数组创造树的两个方法'>
                        {str1}
                    </CodeBlock>
                    </div>
                    
                </div>
            </div>
           
        );
    }
}


export default Demo;