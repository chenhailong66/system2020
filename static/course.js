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
//=======================================================================================================
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
//====================================================================================
let choose_course_term = '2020-2021';

async function change_choose_term() {
    let inputEl = document.getElementById("choose_course_term");
    let addTask = () => {
        choose_course_term = inputEl.value;
        choose_course_Dialog();

    }
    //按ENTER键执行插入操作
    inputEl.onkeypress = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    }
    //点击加号执行插入操作
    let addEl = document.getElementById("change_choose_termbtn");
    addEl.onclick = (e) => {
        addTask();
    }
}


//学生选课页面的绘制
async function choose_course_Dialog() {
    let response = await fetch(`/api/course/list`);
    if (!response.ok) {
        console.error(response);
        return;
    }

    let data = await response.json();
    let tbodyEl = document.createElement("tbody");
    for (let item of data) {
        if (item.term === choose_course_term) {
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

            //添加选课和取消按钮
            tdEl = document.createElement("td");
            tdEl.className = "choose_thiscourse";
            tdEl.append(choose_and_delete(item));
            trEl.append(tdEl);
        }
    }

    let tableEl = document.querySelector("#choose_course-table");
    document.querySelector("#choose_course-table > tbody").remove();
    tableEl.append(tbodyEl);


    //一个课程计划全部选择同学的名单
    for (let item of data) {
        if (item.term === choose_course_term) {

            let choose_course = document.querySelector(`.plan${item.courseplan_sn}.btn`);
            let choose_course_studentname = document.querySelector("#choose_course_studentname");
            let response1 = await fetch(`/api/course/${item.courseplan_sn}`);
            if (!response1.ok) {
                console.error(response1);
                return;
            }
            let datas = await response1.json();
            for (let item3 of datas) {
                //如果该学生已经选过该课程则不可以再次选择
                if (String(item3.stu_sn) === choose_course_studentname.value) {
                    choose_course.disabled = true;
                }
            }
        }
    }
}

//===================================================实现学生选课界面内的选课和取消按钮===================
function choose_and_delete(item) {
    let ctrlbarEl = document.createElement("div");

    let choose_course = document.createElement("button");
    choose_course.className = `plan${item.courseplan_sn} btn`;
    choose_course.innerText = "选择";



    let choose_course_studentname = document.querySelector("#choose_course_studentname");
    //点击确认选课
    choose_course.onclick = (e) => {
        let data = {
            stu_sn: choose_course_studentname.value,
            courseplan_sn: item.courseplan_sn,
            grade: 0.0,
        };
        (async () => {
            let response = await fetch(`/api/course/choose_course`, {
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
        })();
        choose_course.disabled = true;
    }

    ctrlbarEl.append(choose_course);

    let delBtn = document.createElement("a");
    delBtn.className = "btn";
    delBtn.innerText = "取消";
    delBtn.onclick = (e) => {
        (async () => {
            let stu_sn = choose_course_studentname.value;
            let courseplan_sn = item.courseplan_sn;
            let response = await fetch(`/api/course/${stu_sn}/${courseplan_sn}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                console.error(response);
                return;
            }
        })();
        choose_course.disabled = false;
    }

    ctrlbarEl.append(delBtn);

    return ctrlbarEl;
}

//======================================================================================


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
    //===================================================
    //实现添加课程成绩的功能
    let add_gradeBtn = document.createElement("a");
    add_gradeBtn.className = "btn";
    add_gradeBtn.innerText = "课程成绩";
    add_gradeBtn.onclick = (e) => {
        open_add_course_grade_Dialog(item);
    };
    //==================================================
    ctrlbarEl.append(add_gradeBtn);

    return ctrlbarEl;

}
//===========================================================================================
//打开添加学生成绩界面
async function open_add_course_grade_Dialog(item) {
    
    let dialog = document.querySelector(".add_course_grade_dialog");

    //打开界面
    if (dialog.classList.contains("open")) {
        dialog.classList.remove("open");
    } else {
        dialog.classList.add("open");
    }

    //显示表格内的内容
    add_course_grade_Dialog(item);


    //=====================================这里插一个保存按钮的功能
    //点击返回按钮关闭界面
    let backbtn = document.querySelector("#back-btn");
    backbtn.onclick = (e) => {
        dialog.classList.remove("open");
    }
}

//打开添加学生成绩界面显示表格内容函数
async function add_course_grade_Dialog(item) {
    let response = await fetch(`/api/course/addgrade/${item.courseplan_sn}`);
    if (!response.ok) {
        console.error(response);
        return;
    }
    let data = await response.json();

    let tbodyEl = document.createElement("tbody");
    for (let item2 of data) {
        let trEl = document.createElement("tr");
        tbodyEl.append(trEl);

        let tdEl;
        tdEl = document.createElement("td");
        tdEl.innerText = item2.name;
        tdEl.className = "addgrade-stu_name";
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "addgrade-stu_grade";
        tdEl.innerText = item2.grade;
        trEl.append(tdEl);

        //添加分数界面按钮
        tdEl = document.createElement("td");
        tdEl.className = "ctrlbar";
        tdEl.append(addgradeCtrlbar(item, item2));
        trEl.append(tdEl);
    }
        let tableEl = document.querySelector("#addgarde-table");
        document.querySelector("#addgarde-table > tbody").remove();
        tableEl.append(tbodyEl);
    
}

//实现添加课程成绩按钮
function addgradeCtrlbar(item, item2) {
    //修改按钮
    let ctrlbarEl = document.createElement("div");
    let editBtn = document.createElement("a");
    editBtn.className = "btn";
    editBtn.innerText = "修改";
    //点击修改按钮，出现修改页面
    let dialog = document.querySelector(".addgrade-dialog");
    let form = dialog.querySelector(".ope_dialog .dialog-header input");
    editBtn.onclick = (e) => {
        //打开界面
        if (dialog.classList.contains("open")) {
            dialog.classList.remove("open");
        } else {
            dialog.classList.add("open");
        }

        //找到成绩并显示在数据框内
        form.value = item2.grade ?? "";
    };
    ctrlbarEl.append(editBtn);

    //添加分数框里的返回按钮
    let backbtn = document.querySelector("#addgrade_close-btn");
    backbtn.onclick = (e) => {
        dialog.classList.remove("open");
    }

    //添加分数框里的保存按钮的实现
    let savebtn = document.querySelector("#addgrade_save-btn");
    savebtn.onclick = (e) => {
        let data = {
            grade: form.value,
        };

        //执行数据库插入操作
        (async () => {
            let response = await fetch(`/api/course/${item2.stu_sn}/${item.courseplan_sn}`, {
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
            //关闭插入成绩页面
            dialog.classList.remove("open");
            //重新加载表内内容
            add_course_grade_Dialog(item);
        })();
    }

    return ctrlbarEl;
}

//=================================================================================================下面是我新加的,上面也是我加的
//选课界面
async function open_select_course_Dialog(item) {
    let dialog = document.querySelector(".add_course_grade_dialog");

    //打开界面
    if (dialog.classList.contains("open")) {
        dialog.classList.remove("open");
    } else {
        dialog.classList.add("open");
    }

    //显示表格内的内容
    add_course_grade_Dialog(item);

    //点击返回按钮关闭界面
    let backbtn = document.querySelector("#addgrade_close-btn");
    backbtn.onclick = (e) => {
        dialog.classList.remove("open");
    }

}


//============================================================================================================
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

async function renderEditDialog() {
    //点击新建课程计划信息按钮
    let newcourseplanBtn = document.querySelector(".paper #new-btn");
    newcourseplanBtn.onclick = (e) => {
        openEditDialog();
    };
    //=====================================================================================
    //点击学生选课，打开选课界面


    let choose_dialog = document.querySelector(".select_course_grade_dialog")
    let choosecoursebtn = document.querySelector(".paper #choose-btn");
    choosecoursebtn.onclick = (e) => {
        //打开界面
        ;
        if (choose_dialog.classList.contains("open")) {
            choose_dialog.classList.remove("open");
        } else {
            choose_dialog.classList.add("open");
        }
        //绘制页面内容
        choose_course_Dialog();

    };

    //实现保存按钮和退出按钮
    let choose_course_backbtn = document.querySelector("#choose_course_back-btn");
    choose_course_backbtn.onclick = (e) => {
        choose_dialog.classList.remove("open");
    }


    //=========================================================================================
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
//删除确定界面
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
    change_choose_term();
    renderList();
    renderEditDialog();
});
