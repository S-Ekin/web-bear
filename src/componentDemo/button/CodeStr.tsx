export const str1 = `function btnHandle(e:React.MouseEvent<HTMLButtonElement>){
	const dom  = e.currentTarget;
	const val = dom.value;
	const dataSet = dom.dataset;
	const className = [...dom.classList.values()];
	const name = dom.name;
	console.log(val,dataSet,className,name);
}`;

export const str2 = `groupFn=(field: string)=> {
		console.log(field);
    } `;
    
export const str3 = `interface IGroupBtnsitem{
	id:string;
	text:string;
	icon?:string;
}
const list:IGroupBtnsitem[] = [
	{ id: "normal-btn", text: "normal" },
	{ id: "line-btn", text: "line" },
	{ id: "dashed-btn", text: "dashed" },
]; `;
interface IGroupBtnsitem{
	id:string;
	text:string;
	icon?:string;
}
export const list:IGroupBtnsitem[] = [
	{ id: "normal-btn", text: "normal" ,icon:"setting"},
	{ id: "line-btn", text: "line" },
	{ id: "dashed-btn", text: "dashed" },
];