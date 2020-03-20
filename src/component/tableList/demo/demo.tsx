/**
 * @name name
 * @description description
 * @time 2020-03-20
 */
import * as React from "react";
import {TabList,GroupCols} from '../TabList';
import data from './data';
type Props={

};
type States={

};
interface IDemo {

}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    列表表格
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show">
                        <TabList data={data} idField="event_id" multiply={true}>
                            <GroupCols forzen={true} width={380}>
                                <GroupCols.colItem field="eventNo" width={170}>
                                    事件编号
                                </GroupCols.colItem> 
                                <GroupCols.colItem field="category_name" width={210}>
                                    事件类型
                                </GroupCols.colItem>
                            </GroupCols> 
                            <GroupCols> 
                                <GroupCols.colItem field="eventNo" width={220}>
                                    事件编号
                                </GroupCols.colItem> 
                                <GroupCols.colItem field="a_SHANGBAOSHIJIAN" width={220}>
                                    上报日期
                                </GroupCols.colItem>  
                                <GroupCols.colItem  field="status_name" width={220}>处理状态</GroupCols.colItem>
                                <GroupCols.colItem field="a_SHANGBAOREN" width={220}>
                                    上报人
                                </GroupCols.colItem> 
                                <GroupCols.colItem field="category_name" width={220} >
                                    事件类型
                                </GroupCols.colItem>
                            </GroupCols> 
                             <GroupCols forzen={true} width={320}> 
                                <GroupCols.colItem field="eventNo" width={120}>
                                    事件编号
                                </GroupCols.colItem> 
                                <GroupCols.colItem field="a_SHANGBAOSHIJIAN" width={200}>
                                    上报日期
                                </GroupCols.colItem>  
                               
                              
                            </GroupCols>
                        </TabList>
                    </div>
                </div>
            </div>
        );
    }
}


export default Demo;