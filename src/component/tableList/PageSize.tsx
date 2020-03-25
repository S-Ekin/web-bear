/**
 * @name 页码
 * @description description
 * @time 2019-09-19
 */

import * as React from "react";
import { Combobox } from "../combo/index";
import { SvgIcon } from "../icon/index";

type Props = {
	perNums: number; //每页条数
	curPage: number; //当前的页码
	totalPages: number; //总页数
	totalNums: Number; //总条数
    changeHandle(key:'curPage' | "perNums",val:number):void;
};

type States = {};

interface IPageSize {
	pageCodeHandle(e: React.MouseEvent<HTMLElement>):void;
}
const pageNumsArr = [
	{ id: "1", text: "10" },
	{ id: "2", text: "20" },
	{ id: "3", text: "30" },
	{ id: "4", text: "50" },
	{ id: "5", text: "100" },
];

class PageSize extends React.PureComponent<Props, States> implements IPageSize {
	pageCodeHandle = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.currentTarget!;
		if (target.classList.contains("active")) {
			return;
		}
		const { changeHandle } = this.props;
		const num = ~~target.dataset.num!;
		changeHandle("curPage", num);
	}
	curNumInpHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { totalPages, changeHandle } = this.props;

		let val = ~~e.currentTarget!.value.trim();
		val = +val < 1 ? 1 : +val > totalPages ? totalPages : val;
		changeHandle("curPage", val);
	}

	firstPage() {
		const { totalPages, curPage } = this.props;
		const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);

		const first = arr.map(val => (
			<span
				className={"m-page-num " + (val === curPage ? "active" : "")}
				key={val}
				data-num={val}
				onClick={this.pageCodeHandle}>
				{val}
			</span>
        ));
        const className = "m-page-num " + (totalPages === curPage ? "active" : "");
		return (
			<React.Fragment>
				{first}
				<span>...</span>
				<span
					className={className}
					data-num={totalPages}
					onClick={this.pageCodeHandle}>
					{totalPages}
				</span>
			</React.Fragment>
		);
	}
	lastPage() {
		const { totalPages, curPage } = this.props;
		const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);
		const last = arr.map(val => {

            const className = 	"m-page-num " +(totalPages - 5 + val === curPage ? "active" : "");

            return (
                <span
				className={className}
				data-num={totalPages - 5 + val}
				onClick={this.pageCodeHandle}
				key={totalPages - 5 + val}>
				{totalPages - 5 + val}
			</span>
		);
        });
		return (
			<React.Fragment>
				<span
					className={"m-page-num " + (1 === curPage ? "active" : "")}
					data-num={1}
					onClick={this.pageCodeHandle}>
					{1}
				</span>
				<span>...</span>
				{last}
			</React.Fragment>
		);
	}
	centerPage() {
		const { curPage, totalPages } = this.props;
		const arr = Array.from({ length: 5 }, (...args) => args[1] + 1);
				
		const center = arr.map(val => {


            const className = "m-page-num " + (curPage - 3 + val === curPage ? "active" : "");

            return (

                <span
                    data-num={curPage - 3 + val}
                    onClick={this.pageCodeHandle}
                    className={className}
                    key={curPage - 3 + val}>
                    {curPage - 3 + val}
                </span>
            );
        });
        const className = "m-page-num " + (totalPages === curPage ? "active" : "");
		return (
			<React.Fragment>
				<span
					className={"m-page-num " + (1 === curPage ? "active" : "")}
					data-num={1}
					onClick={this.pageCodeHandle}>
					{1}
				</span>
				<span>...</span>
				{center}
				<span>...</span>
				<span
					className={className}
					data-num={totalPages}
					onClick={this.pageCodeHandle}>
					{totalPages}
				</span>
			</React.Fragment>
		);
	}
	normalPage() {
		const { curPage, totalPages } = this.props;

		const arr = Array.from(
			{ length: totalPages },
			(...args) => args[1] + 1
		);
		return arr.map(val => {
            const className = "m-page-num " + (val === curPage ? "active" : "");
			return (
				<span
					className={className}
					data-num={val}
					onClick={this.pageCodeHandle}
					key={val}>
					{val}
				</span>
			);
		});
	}

	controlBtnHandle = (e: React.MouseEvent<HTMLSpanElement>) => {
		const type = e.currentTarget!.dataset.type;
		const { curPage, totalPages, changeHandle } = this.props;
		if (type === "pre") {
			changeHandle("curPage", Math.max(+curPage - 1, 1));
		} else {
			changeHandle(
				"curPage",
				Math.min(+curPage + 1, totalPages)
			);
		}
	}
	perNumComboClick = (selectedArr: any[]) => {
		this.props.changeHandle("perNums", +selectedArr[0].text);
		this.props.changeHandle("curPage", 1);
	}
	render() {
		const { totalPages, curPage, totalNums ,perNums} = this.props;
		let navigatepageCom;

		if (totalPages < 11) {
			navigatepageCom = this.normalPage();
		} else if (curPage - 1 < 4) {
			navigatepageCom = this.firstPage();
		} else if (totalPages - curPage < 4) {
			navigatepageCom = this.lastPage();
		} else {
			navigatepageCom = this.centerPage();
		}
		const perNumId = pageNumsArr.find(val=>~~val.text === perNums)!.id;
		return (
			<div className="g-pageCode">
				<div className="g-pageLeft">
					<div className="m-page-total">
						<span>共 {totalPages} 页</span>

						<span>{totalNums}条</span>
					</div>
					<div style={{ display: "flex", alignItems: "center", }}>
						<span>每页显示：</span>
						<Combobox
							field="pageNums"
							data={pageNumsArr}
							width={100}
							directionUp={true}
							clickCallback={this.perNumComboClick}
							defaultVal={perNumId}
						/>
						<span>&nbsp;条</span>
					</div>
				</div>

				<div className="g-pageRight">
					<div style={{ marginRight: "20px", }}>
						<span>跳转到</span>
						<input
							className="j-jump-page s-inp normal"
							value={curPage}
							type="number"
							min={1}
							onChange={this.curNumInpHandle}
						/>
					</div>

					<div className="m-code-number">
						<span
							className="m-page-num"
							data-type="pre"
							onClick={this.controlBtnHandle}>
							<SvgIcon className="arrow-left-square" size="middle" />
						</span>
						<span>{navigatepageCom}</span>
						<span
							className="m-page-num"
							onClick={this.controlBtnHandle}
							data-type="next">
							<SvgIcon className="arrow-right-square" size="middle"/>

						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default PageSize;
