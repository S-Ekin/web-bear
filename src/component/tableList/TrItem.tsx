/**
 * @name name
 * @description description
 * @time 2020-03-19
 */
import * as React from "react";
import {SvgIcon} from '@component/icon/index';
type common = MyTabListSpace.common;
type Props={
 cols:common['col'][];
  node:IImmutalbeMap<common['node']>;
  fixObj:common['fixObj'];
  index:string; // 节点的索引
  isMainView?:boolean;
  changeState:common['changeState'];
};
type States={

};
interface ITrItem {

    getCheck():JSX.Element | undefined;

}
class TrItem extends React.PureComponent<Props,States> implements ITrItem{


    state:States={

    };
   getCheck(){
        const {fixObj:{multiply}} = this.props;
        if(multiply){
            const {node} = this.props;
            const active = node.get('checked') ? 
            'checkbox-has-selected' : 'checkbox-blank';
            return ( <SvgIcon className={active}/>);
        }else{
            return undefined;
        }
       
    }
    clickFn=(e:React.MouseEvent<HTMLDivElement>)=>{
       
        const index = e.currentTarget.dataset.index!;
        const {changeState} = this.props;
        changeState(index,'expand');
    }
    checkFn=(e:React.MouseEvent<HTMLSpanElement>)=>{
        e.stopPropagation();
        const dom = e.currentTarget;
        const index = dom.parentElement!.dataset.index;
        const {changeState} = this.props;
        changeState(index!,'active');
    }
    getFirstText(text:string){
        const {index,fixObj:{multiply}} = this.props;
        const check= multiply ? this.checkFn : undefined;
        const checkName = multiply ? 'tree-check' : undefined;
        return (
            <div onClick={this.clickFn} data-index={index}>
                <span onClick={check} className={checkName}>
                    <span />
                    {this.getCheck()}
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


export default TrItem;