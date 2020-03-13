/**
 * @name 父子节点组件
 * @description description
 * @time 2020-03-13
 */
import * as React from "react";

type common = MyTreeTabSpace.common;
type Props={
    cols:common['col'][];
    node:IImmutalbeMap<common['node']>;
    fixObj:common['fixObj'];
};
type States={

};
interface IParTree {
    getTds():JSX.Element;
    getSubBody():IImmutalbeList<JSX.Element>;
}
class ParTree extends React.PureComponent<Props,States> implements IParTree{


    state:States={

    };
    getTds(){
        const {cols,node,fixObj:{tabField}} = this.props;
        const tds= cols.map((td,index)=>{
            const {field,formatter} = td;
            const text = formatter ? formatter(node,index,tabField) : node.get(field);
            return (
                <td key={field}>{text}</td>
            );
        });

        return (
            <tr>
                {tds}
            </tr>
        );
    }
    getSubBody(){

        const {node,fixObj,fixObj:{childField},cols}  = this.props;
        
        const arr:common['data'] = node.get(childField);
        return arr.map(val=>{
            const children = val.get(childField);
            if(children && children.length){
                    return (
                        <ParTree
                            node={val}
                            cols={cols}
                            fixObj={fixObj}
                        />
                    );
            }else{
                return this.getTds();
            }
        }); 

    }
    render(){
        const {cols} = this.props;
        const tds = this.getTds();
        return (
            <>
                {tds}
                <tr>
                    <td colSpan={cols.length}>
                        <div className="tab-body">
                            <table>
                                {this.getSubBody()}
                            </table>
                        </div>
                    </td>
                </tr> 
            </>
            
        );
    }
}


export default ParTree;