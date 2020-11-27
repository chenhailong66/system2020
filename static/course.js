async function renderList() {
    let response = await fetch(`/api/course/list`);
    if (!response.ok) {
        console.error(response);
        return;
    }
    let data = await response.json();

    let tbodyEl = document.createElement("tbody");
    for (let item of data) {
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
    let tableEl = document.querySelector("#course-table");
    document.querySelector("#course-table > tbody").remove();
    tableEl.append(tbodyEl);
}

function renderRecordCtrlbar(item) {
    let ctrlbarEl = document.createElement("div");

    let editBtn = document.createElement("a");
    editBtn.className = "btn";
    editBtn.innerText = "修改";

    //放修改按钮的click事件

    ctrlbarEl.append(editBtn);

    let delBtn = document.createElement("a");
    delBtn.className = "btn";
    delBtn.innerText = "删除";

    //放删除按钮的click事件
    ctrlbarEl.append(delBtn);


    return ctrlbarEl;

}