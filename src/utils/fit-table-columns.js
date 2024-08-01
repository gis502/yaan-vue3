import "@/assets/styles/fit-table-columns.css"

/**
 * 自定义命令-关于el-table列固定(函数指令`v-fit-columns`)
 * @param app
 */
export default (app) => {
    app.directive('fit-columns', {
        // 指令具有一组生命周期钩子：
        // 在绑定元素的 attribute 或事件监听器被应用之前调用
        created() {
        },
        // 在绑定元素的父组件挂载之前调用
        beforeMount() {
        },
        // 在绑定元素的父组件挂载之后调用
        mounted(el, binding) {
            setTimeout(() => {
                adjustColumnWidth(el, binding.value);
            }, 300);
        },
        // 在包含组件的 VNode 更新之前调用
        beforeUpdate() {
        },
        // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
        updated(el, binding) {
            el.classList.add("r-table");
            setTimeout(() => {
                adjustColumnWidth(el, binding.value);
            }, 300);
        },
        // 在绑定元素的父组件卸载之前调用
        beforeUnmount() {
        },
        // 在绑定元素的父组件卸载之后调用
        unmounted() {
        }
    })
}

/**
 * 调整列宽
 * @param table 使用调整列宽命令的table
 * @param padding 0
 */
function adjustColumnWidth(table, padding = 0) {
    const colgroup = table.querySelector("colgroup");
    if (!colgroup) return;

    const colDefs = [...colgroup.querySelectorAll("col")];
    colDefs.forEach((col) => {
        const clsName = col.getAttribute("name");
        const cells = [
            ...table.querySelectorAll(`td.${clsName}`),
            ...table.querySelectorAll(`th.${clsName}`),
        ];

        if (cells[0]?.classList?.contains?.("leave-alone")) {
            return;
        }

        const widthList = cells.map((el) => {
            return el.querySelector(".cell")?.scrollWidth || 0;
        });
        const max = Math.max(...widthList);

        table.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
            const oldWidth = el.getAttribute("width");
            if (max + padding > oldWidth) {
                el.setAttribute("width", max + padding);
            }
        });
    });
}



