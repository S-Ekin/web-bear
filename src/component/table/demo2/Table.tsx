/**
 * @name name
 * @description description
 * @time 2020-02-25
 */
import * as React from "react";

type listItem = {
    field:string;
    children:React.ReactNode;
    align?:'center' | 'left' | 'right';
    width?:number;
    isRowSpanField?:boolean;//是否为合并字段
    formatter?:(
			node: IImmutalbeMap<any>, //节点
			index: string, //节点索引
			tabField?: string //表格标识
        ) => React.ReactChild;
};

type Props={
    children:React.ReactElement<listItem>[]
};
type States={

};
interface ITable {
    fieldArr: listItem[];
}

class Table extends React.PureComponent<Props,States> implements ITable{

    static colItem:React.SFC<listItem> = ({width,children})=>{
        return (
            <th  style={{width: width,}}>{children}</th>
        );
    }
    fieldArr:ITable['fieldArr'] = [];
    state:States={

    };
    constructor(props:Props){
        super(props);
        const { children } = props;

        const arr = children.map( val =>{
            
            const {children ,...obj} = val.props;
            return obj;
        });

        console.log(arr);
        

    }
    componentDidMount(){
        const { children } = this.props;
        console.log(children);
        
    }
    render(){
       const {children} = this.props;
        return (
                <table>
                    <tr>
                        {children}
                    </tr>
                </table>
        );
    }
}


export default Table;