export const str1 = `//表格头部作为子组件渲染，把表格的配置组件化
// interface IColumnItem {
// 		field:string;
// 		width?:number;
// 		isRowSpanField?:boolean;//是否为合并字段
// 		align?:"center"|"left"|"right";//默认center
// 		formatter?:(
// 				node: IImmutalbeMap<any>, //节点
// 				index: string, //节点索引
// 				tabField?: string //表格标识
// 			) => React.ReactChild;
// 	}
<Table
    key={refreshId}
    data={tableData}
    {...config}
    initSelectVal={selectTableVal}
    bindGetSelectedFn={this.bindgetTableSelecte}
>
    ...
    <Table.colItem
    width={140}
    align="left"
    field="a_SHANGBAOSHIJIAN"
    formatter={this.formatterObj.date}
    >
    上报日期
    </Table.colItem>
    ...
    <Table.colItem width={120} field="status_name" isRowSpanField={true}>
    处理状态
    </Table.colItem>
    ...
    <Table.colItem
    width={200}
    field="opt"
    formatter={this.formatterObj.opt}
    >
    操作
    </Table.colItem>
</Table>
`;

