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
                    <div className="g-item-show">
                        <TreeTable data={data} idField="id" tabField="tree" multiply={true}>
                        <GroupCols forzen={true} width={300}>
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' >列2</GroupCols.colItem>
                        </GroupCols> 
                        <GroupCols >
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' width={240} >列2</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='begin'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='end'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='progress'>列3</GroupCols.colItem>
                        </GroupCols>
                        <GroupCols forzen={true} width={240}>
                            <GroupCols.colItem  field='progress'>列3</GroupCols.colItem>
                        </GroupCols>
                   
                    </TreeTable>
                    </div>

                    <div className="g-item-show" style={{height: 300,}}>
                        <TreeTable data={data} key="ty">
                          <GroupCols forzen={true} width={300}>
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' >列2</GroupCols.colItem>
                        </GroupCols> 
                        <GroupCols >
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' width={240} >列2</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='begin'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='end'>列3</GroupCols.colItem>
                        </GroupCols>
                   
                        </TreeTable>
                    </div>
                  
                    <div className="g-item-show" style={{height: 300,}}>
                        <TreeTable data={data} key="yu">
                        
                        <GroupCols >
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' width={240} >列2</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='begin'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='end'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='progress'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='state'>列3</GroupCols.colItem>
                        </GroupCols>
                   
                        </TreeTable>
                    </div>
                   
                    <div className="g-item-show" >
                        <TreeTable data={data} key="er">
                          <GroupCols forzen={true} width={300}>
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' >列2</GroupCols.colItem>
                        </GroupCols> 
                        <GroupCols >
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' width={240} >列2</GroupCols.colItem>
                            <GroupCols.colItem width={140} field='begin'>列3</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='progress'>列3</GroupCols.colItem>
                        </GroupCols>
                        <GroupCols forzen={true} width={240}>
                            <GroupCols.colItem  field='progress'>列3</GroupCols.colItem>
                        </GroupCols>
                         <GroupCols >
                            <GroupCols.colItem width={240} field="name">列1</GroupCols.colItem>
                            <GroupCols.colItem field='persons' width={240} >列2</GroupCols.colItem>
                            <GroupCols.colItem width={240} field='begin'>列3</GroupCols.colItem>
                        </GroupCols>
                        </TreeTable>
                    </div>
              
                </div>
            </div>
        );
    }
}


export default Demo;