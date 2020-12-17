let look_cou_name = " ";
function one_course() {
    let inputEl = document.querySelector(".cou_sn");
    let addTask = () => {
        look_cou_name = inputEl.value;
        renderList();
    }
    //按ENTER键执行插入操作
    inputEl.onkeypress = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    }
    //点击加号执行插入操作
    let addEl = document.querySelector(".checkgradebtn");
    addEl.onclick = (e) => {
        addTask();
    }
}

async function renderList() {
    let response = await fetch(`/api/grade/list`);
    if (!response.ok) {
        console.error(response);
        return;
    }

    let data = await response.json();
    let tbodyEl = document.createElement("tbody");
    let user = document.querySelector("#choose_course_studentname");
    console.log(user.value);
    for (let item of data) {
        if (String(item.stu_sn) === user.value) {
            if (look_cou_name === " ") {
                let trEl = document.createElement("tr");
                tbodyEl.append(trEl);

                let tdEl;
                tdEl = document.createElement("td");
                tdEl.className = "col-stu_name";
                tdEl.innerText = item.stu_name;
                trEl.append(tdEl);

                tdEl = document.createElement("td");
                tdEl.className = "col-cou_name";
                tdEl.innerText = item.cou_name;
                trEl.append(tdEl);

                tdEl = document.createElement("td");
                tdEl.className = "col-grade";
                tdEl.innerText = item.grade;
                trEl.append(tdEl);
            }
            else{
                if(String(item.cou_sn) === look_cou_name)
                {
                    let trEl = document.createElement("tr");
                tbodyEl.append(trEl);

                let tdEl;
                tdEl = document.createElement("td");
                tdEl.className = "col-stu_name";
                tdEl.innerText = item.stu_name;
                trEl.append(tdEl);

                tdEl = document.createElement("td");
                tdEl.className = "col-cou_name";
                tdEl.innerText = item.cou_name;
                trEl.append(tdEl);

                tdEl = document.createElement("td");
                tdEl.className = "col-grade";
                tdEl.innerText = item.grade;
                trEl.append(tdEl);
                }
            }

        }
    }
    let tableEl = document.querySelector(".grade.table");
    document.querySelector(".grade.table > tbody").remove();
    tableEl.append(tbodyEl);
}

document.addEventListener("DOMContentLoaded", (e) => {
    one_course();
    renderList();
});
