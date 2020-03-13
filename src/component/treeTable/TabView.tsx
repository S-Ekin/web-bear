/**
 * @name 表格区域视图
 * @description 可以区分固定列和活动列
 * @time 2020-03-13
 */
import * as React from "react";
import ParTree from './ParTree';
type common = MyTreeTabSpace.common;
type Props={
    data:common['data'];
    cols:common['col'][];
    fixObj:common['fixObj'];
};
type States={

};
interface ITabView {
    getBody():IImmutalbeList<JSX.Element>;
}
class TabView extends React.PureComponent<Props,States> implements ITabView{


    state:States={

    }; 

    gethead(){
        const {cols} = this.props;
        const tds = cols.map(val=>{
            const {text,width,field} = val ;
            return (
                <th style={{width: width,}} key={field}>{text}</th>
            );
        });
        return (
            <div className="tab-head">
                 <table>
                    <tr>{tds}</tr>
                </table>
            </div>
        );
    }

    getBody(){
        const {data,fixObj,fixObj:{idField},cols} = this.props;
       

        return data.map(val=>{

            return (
                <ParTree
                    key={val.get(idField)}
                    node={val}
                    cols={cols}
                    fixObj={fixObj}
                />
            );

        });
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