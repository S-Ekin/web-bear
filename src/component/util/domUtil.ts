export const closertPar = (el:HTMLElement, parName:string):HTMLElement | null => {
    if (!el) {
        throw new Error("该元素不存在")
    }

    let parEl = el!
    // 对自身也j检查
    while (parEl.tagName !== "BODY" && !parEl.classList.contains(parName)) {
        parEl = parEl.parentElement!
    }
    if (parEl.tagName === "BODY") {
        return null
    }
    return parEl
}
