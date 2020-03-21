/**
 * @name 一般的td
 * @description description
 * @time 2020-03-14
 */
import * as React from "react";
import { SvgIcon } from "@component/icon";
import {activeStatus} from './formatterTreeData';
type common = MyTreeTabSpace.common;
type Props={
  cols:common['col'][];
  node:IImmutalbeMap<common['node']>;
  fixObj:common['fixObj'];
  lev:number;//层级
  index:string; // 节点的索引
  isPar?:boolean;
  order:{order:number};
  isMainView?:boolean;
  changeState:common['changeState'];
};
type States={

};
interface IItem {
    getFirstText(text:string):JSX.Element;
}
class Item extends React.PureComponent<Props,States> implements IItem{

    state:States={

    };

    getCheck(){
        const {fixObj:{multiply}} = this.props;
        if(multiply){
            const {node} = this.props;
            const active = node.get('active') === activeStatus.hasSelect ? 
            'checkbox-has-selected' :
             node.get('active') === activeStatus.noSelect ? 'checkbox-blank' :'checkbox-marked';
            return ( <SvgIcon className={active}/>);
        }else{
            return undefined;
        }
       
    }
    getIcon(){
        const {node,isPar,fixObj:{itemIcon='file'}} = this.props;
        if(isPar){ 
            const expand = node.get('expand');
           return (
               <>
                <SvgIcon className={expand ? "minus":"plus"}/>
                <SvgIcon className={expand ? "folder-open":"folder"}/>
               </>
           );
        }else{
            return <SvgIcon className={itemIcon}/>;
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
        const {changeState,isPar} = this.props;
        changeState(index!,isPar?'checkPar':'active');
    }
    getFirstText(text:string){
        const {lev,isPar,index,fixObj:{multiply}} = this.props;
        const fn = isPar ? this.clickFn :undefined;
        const className = isPar ? "tree-par" : undefined;
        const check= multiply ? this.checkFn : undefined;
        const checkName = multiply ? 'tree-check' : undefined;
        return (
            <div onClick={fn} className={className} data-index={index}>
                <span onClick={check} className={checkName}>
                    <span style={{paddingRight: lev*14,}} />
                    {this.getCheck()}
                    {this.getIcon()}
                    {text}
                </span>
            </div>
        );
    }

    getOrder(){
        const {order} = this.props;
        order.order ++ ;
        return order.order;
    }
    
    render(){
        const {cols,node,fixObj:{tabField,noOrder},isMainView} = this.props;
        
        const tds= cols.map((td,index)=>{
            const {field,formatter,align} = td;
            const text = formatter ? formatter(node,index,tabField) : node.get(field);
            let str ;
            let alignName = align ? `td-${align}` : '';
            if(isMainView){
                if(noOrder){
                    str = index === 0 ? this.getFirstText(text) : text;
                }else{
                    str = index === 0 ? this.getOrder() : index === 1 ? this.getFirstText(text) : text;
                    alignName = index === 1 ? "" : alignName;
                }   
            }else{
                
                str = text ;
            }
            return (
                <td key={field} className={`td-border ${alignName}`} >
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


export default Item;