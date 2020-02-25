/**
 * @name name
 * @description description
 * @time 2020-02-25
 */
import * as React from "react";
import './demo.scss';
import Table from './Table';
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
                <div className="layout-head">
                    <h3>树形表格</h3>
                </div>
                <div className="g-layout-article">
                   
                            <Table>
                                 <Table.colItem field='name' width={40}>一</Table.colItem>
                                 <Table.colItem field='test' >二</Table.colItem>
                                 <Table.colItem field='gh'>三</Table.colItem>
                            </Table>
                </div>
            </div>
        );
    }
}


export default Demo;