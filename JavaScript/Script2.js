// window.onload = function () {

//     const tableBody = document.getElementById("tableBody");

//     if (!tableBody) return; // safety check

//     const employees = JSON.parse(localStorage.getItem("employees")) || [];

//     tableBody.innerHTML = ""; // clear before adding

//     employees.forEach(emp => {

//         const row = document.createElement("tr");

//         let deptHTML = emp.department.map(d =>
//             `<span class="tag">${d}</span>`
//         ).join("");

//         row.innerHTML = `
//             <td>
//                 <img src="${emp.profile}" width="30">
//                 ${emp.name}
//             </td>
//             <td>${emp.gender}</td>
//             <td>${deptHTML}</td>
//             <td>₹ ${emp.salary}</td>
//             <td>${emp.startDate}</td>
//             <td>
//                 <button onclick="editEmployee(${emp.id})">✏</button>
//                 <button onclick="deleteEmployee(${emp.id})">🗑</button>
//             </td>
//         `;

//         tableBody.appendChild(row);
//     });
// };
// function deleteEmployee(id) {

//     let employees = JSON.parse(localStorage.getItem("employees")) || [];

//     // remove employee
//     employees = employees.filter(emp => emp.id !== id);

//     localStorage.setItem("employees", JSON.stringify(employees));

//     location.reload(); // refresh table
// }
// function editEmployee(id) {

//     let employees = JSON.parse(localStorage.getItem("employees")) || [];

//     const selected = employees.find(emp => emp.id === id);

//     // store selected employee separately
//     localStorage.setItem("editEmployee", JSON.stringify(selected));

//     // go to form page
//     window.location.href = "form.html";
// }



//  LOAD TABLE 

const tableBody = document.getElementById("tableBody");

async function loadEmployees() {
    try {
        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
        const employees = await res.json();

        displayData(employees);
    } catch (err) {
        console.error("Error loading employees:", err);
    }
}

// DISPLAY
function displayData(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="6" style="text-align: center; color: #666; padding: 25px; font-weight: 500; font-size: 15px;">No record found</td>`;
        tableBody.appendChild(row);
        return;
    }

    data.forEach(emp => {
        const row = document.createElement("tr");

        const deptHTML = emp.department
            ? emp.department.map(d => `<span class="tag">${d}</span>`).join("")
            : "";


        row.innerHTML = `
            <td>
                <img src="${emp.profile}" width="40" style="border-radius:50%">
                ${emp.name}
            </td>
            <td>${emp.gender}</td>
            <td>${deptHTML}</td>
            <td>₹ ${emp.salary}</td>
            <td>${emp.startDate}</td>
        `;

        // ACTION BUTTONS 
        const actionTd = document.createElement("td");
        actionTd.style.display = "flex";
        actionTd.style.gap = "8px";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.innerHTML = `<img src="/assest/delete.png" width="16" height="16">`;
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.addEventListener("click", () => deleteEmployee(emp.id));

        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.innerHTML = `<img src="/assest/edit.png" width="16" height="16">`;
        editBtn.style.border = "none";
        editBtn.style.background = "none";
        editBtn.style.cursor = "pointer";
        editBtn.addEventListener("click", () => editEmployee(emp.id));

        actionTd.append(deleteBtn, editBtn);
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });
}

// DELETE
async function deleteEmployee(id) {
    console.log("Delete Clicked:", id);

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
        await fetch(`http://localhost:3000/employees/${id}`, {
            method: "DELETE"
        });

        loadEmployees();
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// EDIT
function editEmployee(id) {
    console.log("Edit Clicked:", id);
    window.location.href = `form.html?id=${id}`;
}

//SEARCH 
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", async function () {
        const value = this.value.toLowerCase();

        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
        const data = await res.json();

        const filtered = data.filter(emp =>
            emp.name.toLowerCase().includes(value)
        );

        displayData(filtered);
    });
}

//SORT 
async function sortByName() {
    const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
    const data = await res.json();

    data.sort((a, b) => a.name.localeCompare(b.name));
    displayData(data);
}

async function sortBySalary() {
    const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
    const data = await res.json();

    data.sort((a, b) => a.salary - b.salary);
    displayData(data);
}
loadEmployees();

const searchBox = document.getElementById("searchBox");
const searchInputField = document.getElementById("searchInput");

if (searchBox && searchInputField) {

    // OPEN SEARCH
    searchBox.addEventListener("click", (e) => {
        searchBox.classList.add("active");
        searchInputField.focus();
        e.stopPropagation(); // important
    });

    // CLOSE SEARCH WHEN CLICK OUTSIDE
    document.addEventListener("click", (e) => {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove("active");
        }
    });
}
