/**
 * @name 表格区域视图
 * @description 可以区分固定列和活动列
 * @time 2020-03-13
 */
import * as React from "react";
import ParTree from './ParTree';
import TrItem from './TrItem';
type common = MyTreeTabSpace.common;
type Props={
    data:common['data'];
    cols:common['col'][];
    fixObj:common['fixObj'];
    viewIndex:number;
    changeState:common['changeState'];
};
type States={

};
interface ITabView {
    getBody():JSX.Element;
}
class TabView extends React.PureComponent<Props,States> implements ITabView{


    state:States={

    }; 
    gethead(){
        const {cols} = this.props;
        const tds = cols.map(val=>{
            const {text,width,field} = val ;
            return (
                <th style={{width: width,}} className="td-border" key={field}>{text}</th>
            );
        });
        return (
            <div className="tab-head">
                 <table>
                     <thead>
                         <tr>{tds}</tr>
                     </thead>
                </table>
            </div>
        );
    }
    createColgroup(){
        const {cols} = this.props;
        const arr = cols.map(val=>{
            const {width,field} = val ;
            const style = width ? {width} : undefined;
            return (
                <col style={style} key={field}/>
            );
        });
        return (
            <colgroup>
                {arr}
            </colgroup>
        );

    }
    getBody(){
        const {data,fixObj,fixObj:{idField,childField},cols,viewIndex,changeState} = this.props;
        const trs = data.map((val,index)=>{
            const arr = val.get(childField);
            const id = val.get(idField);
            const isMainView= viewIndex === 0 ;
            if(arr && arr.size){
                return (
                    <ParTree
                        key={id}
                        changeState={changeState}
                        lev={0}
                        index={`${index}`}
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
                        node={val}
                        index={`${index}`}
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
        return (
            <div className="tab-body">
                <table>
                    {colgroup}
                    <tbody>
                        {trs} 
                    </tbody>
                </table>
            </div>
        );
    }

    render(){

        return (
            <div className="tab-viewBody" >
                <div className="tab-head-wrap">
                    {this.gethead()}
                </div>
                <div className="tab-body-wrap">
                    {this.getBody()}
                </div>
            </div>
        );
    }
}


export default TabView;