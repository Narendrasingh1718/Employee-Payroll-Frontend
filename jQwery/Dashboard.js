$(document).ready(function () {

    const $tableBody = $("#tableBody");

    // LOAD EMPLOYEES
    async function loadEmployees() {
        try {
            const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
            const employees = await res.json();
            displayData(employees);
        } catch (err) {
            console.error("Error loading employees:", err);
        }
    }

    // DISPLAY DATA
    function displayData(data) {
        $tableBody.html("");

        if (data.length === 0) {
            $tableBody.append(`
                <tr>
                    <td colspan="6" style="text-align:center;color:#666;padding:25px;font-weight:500;font-size:15px;">
                        No record found
                    </td>
                </tr>
            `);
            return;
        }

        data.forEach(emp => {

            const deptHTML = emp.department
                ? emp.department.map(d => `<span class="tag">${d}</span>`).join("")
                : "";

            const $row = $(`
                <tr>
                    <td>
                        <img src="${emp.profile}" width="40" style="border-radius:50%">
                        ${emp.name}
                    </td>
                    <td>${emp.gender}</td>
                    <td>${deptHTML}</td>
                    <td>₹ ${emp.salary}</td>
                    <td>${emp.startDate}</td>
                </tr>
            `);

            // ACTION BUTTONS
            const $actionTd = $("<td>").css({
                display: "flex",
                gap: "8px"
            });

            const $deleteBtn = $(`
                <button class="delete">
                    <img src="/assest/delete.png" width="16" height="16">
                </button>
            `).css({
                border: "none",
                background: "none",
                cursor: "pointer"
            });

            $deleteBtn.on("click", () => deleteEmployee(emp.id));

            const $editBtn = $(`
                <button class="edit">
                    <img src="/assest/edit.png" width="16" height="16">
                </button>
            `).css({
                border: "none",
                background: "none",
                cursor: "pointer"
            });

            $editBtn.on("click", () => editEmployee(emp.id));

            $actionTd.append($deleteBtn, $editBtn);
            $row.append($actionTd);

            $tableBody.append($row);
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

    // SEARCH
    $("#searchInput").on("input", async function () {
        const value = $(this).val().toLowerCase();

        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
        const data = await res.json();

        const filtered = data.filter(emp =>
            emp.name.toLowerCase().includes(value)
        );

        displayData(filtered);
    });

    // SORT BY NAME
    window.sortByName = async function () {
        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
        const data = await res.json();

        data.sort((a, b) => a.name.localeCompare(b.name));
        displayData(data);
    };

    // SORT BY SALARY
    window.sortBySalary = async function () {
        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
        const data = await res.json();

        data.sort((a, b) => a.salary - b.salary);
        displayData(data);
    };

    // SEARCH BOX UI
    const $searchBox = $("#searchBox");
    const $searchInputField = $("#searchInput");

    $searchBox.on("click", function (e) {
        $(this).addClass("active");
        $searchInputField.focus();
        e.stopPropagation();
    });

    $(document).on("click", function (e) {
        if (!$searchBox.is(e.target) && $searchBox.has(e.target).length === 0) {
            $searchBox.removeClass("active");
        }
    });

    // INITIAL LOAD
    loadEmployees();
});