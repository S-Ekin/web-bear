/**
 * @name name
 * @description description
 * @time 2020-02-25
 */
import * as React from "react";
import './demo.scss';
import { GroupCols,TreeTable } from '../TreeTable';
import data from './data';
type Props={

};
type States={
};

class Demo extends React.PureComponent<Props,States> {

    
    state:States={
    };
   
    render(){

        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    <h3>树形表格</h3>
                </div>
                <div className="g-layout-article">
                    <TreeTable data={data} idField="id" tabField="tree" multiply={true}>
                        <GroupCols align="left">
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' >列2</GroupCols.colItem>
                            <GroupCols.colItem field='begin'>列3</GroupCols.colItem>
                        </GroupCols> 
                        <GroupCols align="right">
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' >列2</GroupCols.colItem>
                            <GroupCols.colItem field='begin'>列3</GroupCols.colItem>
                            <GroupCols.colItem field='end'>列3</GroupCols.colItem>
                            <GroupCols.colItem field='progress'>列3</GroupCols.colItem>
                        </GroupCols>
                    </TreeTable>
                   
                </div>
            </div>
        );
    }
}


export default Demo;