//设置当前学期，和实现更改学期操作

let current_term = '2020-2021'
function change_term() {
    let inputEl = document.getElementById("current_term");
    let addTask = () => {
        current_term = inputEl.value;
        renderList();
    }
    //按ENTER键执行插入操作
    inputEl.onkeypress = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    }
    //点击加号执行插入操作
    let addEl = document.getElementById("change_termbtn");
    addEl.onclick = (e) => {
        addTask();
    }
}

//主页面绘制
async function renderList() {
    let response = await fetch(`/api/course/list`);
    if (!response.ok) {
        console.error(response);
        return;
    }
    let data = await response.json();

    let tbodyEl = document.createElement("tbody");
    for (let item of data) {
        if (item.term === current_term) {
            let trEl = document.createElement("tr");
            tbodyEl.append(trEl);

            let tdEl;
            tdEl = document.createElement("td");
            tdEl.innerText = item.name;
            tdEl.className = "col-cou_name";
            trEl.append(tdEl);

            tdEl = document.createElement("td");
            tdEl.className = "col-cou_no";
            tdEl.innerText = item.no;
            trEl.append(tdEl);

            tdEl = document.createElement("td");
            tdEl.className = "col-place";
            tdEl.innerText = item.place;
            trEl.append(tdEl);

            tdEl = document.createElement("td");
            tdEl.className = "col-time";
            tdEl.innerText = item.time;
            trEl.append(tdEl);

            tdEl = document.createElement("td");
            tdEl.className = "";
            tdEl.style.width = '1em'
            trEl.append(tdEl);

            tdEl = document.createElement("td");
            tdEl.className = "ctrlbar";
            tdEl.append(renderRecordCtrlbar(item));
            trEl.append(tdEl);
        }

    }
    let tableEl = document.querySelector("#course-table");
    document.querySelector("#course-table > tbody").remove();
    tableEl.append(tbodyEl);
}

//主页面的修改和删除按钮的实现
function renderRecordCtrlbar(item) {
    let ctrlbarEl = document.createElement("div");

    let editBtn = document.createElement("a");
    editBtn.className = "btn";
    editBtn.innerText = "修改";
    //点击修改按钮，出现修改页面
    editBtn.onclick = (e) => {
        openEditDialog(item);
    };
    ctrlbarEl.append(editBtn);

    let delBtn = document.createElement("a");
    delBtn.className = "btn";
    delBtn.innerText = "删除";
    //点击删除按钮出现是否删除界面
    delBtn.onclick = (e) => {
        openComfirmationDialog({
            message: `确定要删除在${item.place} ${item.time} ${item.name}这节课吗？`,
            onOk: () => {
                (async () => {
                    let response = await fetch(`/api/course/${item.courseplan_sn}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        console.error(response);
                    }
                    renderList();
                })();
            },
        });
    };
    ctrlbarEl.append(delBtn);

    //实现添加课程成绩按钮
    let add_gradeBtn = document.createElement("a");
    add_gradeBtn.className = "btn";
    add_gradeBtn.innerText = "课程成绩";
    //这里加上点击事件

    return ctrlbarEl;
}

//点击新建课程计划按钮和修改课程计划按钮出现的界面
async function openEditDialog(item) {
    let dialog = document.querySelector(".course-editor");

    let dialogTitle = dialog.querySelector(".dialog-head");
    let form = dialog.querySelector("form");

    //如果item不为空，显示修改页面
    if (item) {
        dialogTitle.innerText = `修改课程计划信息`;
        form.elements.courseplan_sn.value = item.courseplan_sn ?? null;
        form.elements.term.value = current_term;
        form.elements.no.value = item.no ?? "";
        form.elements.name.value = item.name ?? "";
        form.elements.place.value = item.place ?? "";
        form.elements.time.value = item.time ?? "";
    }
    //否则显示新建学生页面
    else {
        dialogTitle.innerText = "新建课程计划信息";
        form.elements.courseplan_sn.value = null;
        form.elements.term.value = current_term;
        form.elements.no.value = "";
        form.elements.name.value = "";
        form.elements.place.value = "";
        form.elements.time.value = "";
    }
    //如果当前页面开着则关闭，否则打开
    if (dialog.classList.contains("open")) {
        dialog.classList.remove("open");
    } else {
        dialog.classList.add("open");
    }
}

//
async function renderEditDialog() {
    //点击新建课程计划信息按钮
    let newcourseplanBtn = document.querySelector(".paper #new-btn");
    newcourseplanBtn.onclick = (e) => {
        openEditDialog();
    };


    //点击学生选课按钮出现选课界面
    let choose_dialog = document.querySelector(".select_course_grade_dialog")
    let choosecoursebtn = document.querySelector(".paper #choose-btn");
    //这里实现具体功能




    let dialog = document.querySelector(".course-editor");

    let form = dialog.querySelector("form");
    //关闭按钮
    let close_btn = dialog.querySelector("#close-btn");
    //当点击关闭按钮式关闭页面，即移除open
    let closeDialog = () => {
        dialog.classList.remove("open");
    };

    close_btn.onclick = closeDialog;

    //点击保存按钮，保存当前数据
    let save_btn = dialog.querySelector("#save-btn");
    save_btn.onclick = (e) => {
        let data = {
            courseplan_sn: form.elements.courseplan_sn.value,
            no: form.elements.no.value,
            name: form.elements.name.value,
            time: form.elements.time.value,
            place: form.elements.place.value,
            term: form.elements.term.value,
        };

        //当数据没有默认序号是即为新建
        if (!data.courseplan_sn) {
            // 异步执行POST请求操作
            (async () => {
                let response = await fetch("/api/course", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error(response);
                    return;
                }
                closeDialog();
                renderList();
            })();
        }
        //否则就为修改 
        else {
            // 异步执行PUT请求操作
            (async () => {
                let response = await fetch(`/api/course/${data.courseplan_sn}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error(response);
                    return;
                }
                closeDialog();
                renderList();
            })();
        }
    };
}

//删除确定按键
async function openComfirmationDialog({ message, onOk, onCancel }) {
    let dialog = document.querySelector(".comfirmation-dialog");

    let closeDialog = () => {
        dialog.classList.remove("open");
    };
    //确定按钮
    let okBtn = dialog.querySelector("#ok-btn");
    okBtn.onclick = (e) => {
        if (typeof onOk === "function") {
            onOk();
        }

        closeDialog();
    };

    //取消按钮
    let cancelBtn = dialog.querySelector("#cancel-btn");
    cancelBtn.onclick = (e) => {
        if (typeof onCancel === "function") {
            onCancel();
        }

        closeDialog();
    };

    let messageEl = dialog.querySelector("#message");
    messageEl.innerText = message;

    dialog.classList.add("open");
}


document.addEventListener("DOMContentLoaded", (e) => {
    change_term();
    renderList();
    renderEditDialog();
});