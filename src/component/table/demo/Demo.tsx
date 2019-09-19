/**
 * @name name
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import data from "./data";
import Table from "../index";
import {Button} from "@component/button/index";
type Props={

};
type States={

};
interface IDemo {
 column:MyTabSpace.columnItem[];
}
type report ={
    a_FASHENGSHIJIAN: string
    a_SHANGBAOREN: string
    a_SHANGBAOSHIJIAN: string
    b_SHIJIANLEIBIE1: string
    category_name: string
    eventNo: string
    event_id: string;
    function_reject: string;
    orgList: any[]
    org_id: string;
    org_name: string
    qc_reject: string
    shijianleixing: string
    status: string;
    status_name: string
    type_id: string;
};
class Demo extends React.PureComponent<Props,States> implements IDemo{
    
    column:IDemo["column"] = [
			{
				text: "事件编号",
				field: "eventNo",
				width: 150,
			},
			{
				text: "事件类型",
				field: "category_name",
				formatter:function(node:IImmutalbeMap<report>){
					return node.get("category_name") || "--";
				}
			},
			{
				text: "上报日期",
				field: "a_SHANGBAOSHIJIAN",
				width: 140,
				formatter: function(node: IImmutalbeMap<report>) {
					let time = node.get("a_SHANGBAOSHIJIAN") || "";
					return `${time.substr(0, 4)}-${time.substr(
						4,
						2
					)}-${time.substr(6, 2)}`;
				},
			},
			{
				text: "上报人",
				field: "a_SHANGBAOREN",
				width: 100,
				formatter: (node: IImmutalbeMap<report>) => {
					return <span>{node.get("a_SHANGBAOREN") || "匿名"}</span>;
				},
			},
			{
				text: "处理状态",
				field: "status_name",
				width: 120,
			},

			{
				text: "上报科室",
				field: "org_name",
				width: 100,
			},
			{
				text: "操作",
				field: "opt",
				width: "200",
				formatter: (node: IImmutalbeMap<report>) => {
					return (
						<span
							className="m-optBtn"
							data-event_id={node.get("event_id")}
							data-status_name={node.get("status_name")}
							data-type_id={node.get("type_id")}>
                                <Button>操作</Button>
						</span>
					);
				},
			},
		];
    state:States={

    };
    render(){
        return (
            <Table
                data={data} 
                idField="event_id"
                checkbox={true}
                column={this.column}
            />
        )
    }
}


export default Demo;