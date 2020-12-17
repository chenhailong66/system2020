let choose_course_term = "2020-2021";

async function change_choose_term() {
    let inputEl = document.querySelector("#choose_course_term");
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
    //执行插入操作
    let addEl = document.querySelector("#change_choose_termbtn");
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
    delBtn.className = `cancelbtn`;
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
document.addEventListener("DOMContentLoaded", (e) => {
    change_choose_term();
    choose_course_Dialog();
});



