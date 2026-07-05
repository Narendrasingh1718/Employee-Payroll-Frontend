$(document).ready(function () {

    // GET ID FROM URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // LOAD DATA FOR EDIT
    if (id) {
        fetch(`http://localhost:3000/employees/${id}`, { cache: "no-cache" })
            .then(res => res.json())
            .then(emp => {

                $("#name").val(emp.name);

                $(`input[name="gender"][value="${emp.gender}"]`).prop("checked", true);
                $(`input[name="profile"][value="${emp.profile}"]`).prop("checked", true);

                emp.department.forEach(dep => {
                    $(`#department input[value="${dep}"]`).prop("checked", true);
                });

                $("#salary").val(emp.salary);
                $("#notes").val(emp.notes || "");

                if (emp.startDate) {
                    const dateParts = emp.startDate.split(" ");
                    if (dateParts.length === 3) {
                        $("#day").val(dateParts[0]);
                        $("#month").val(dateParts[1]);
                        $("#year").val(dateParts[2]);
                    }
                }
            })
            .catch(err => console.error("Error fetching employee:", err));
    }

    // CANCEL BUTTON
    $("#cancelBtn").on("click", function () {
        window.location.href = "index.html";
    });

    // ERROR FUNCTIONS
    function showError(id, msg) {
        $("#" + id).text(msg).show();
    }

    function clearError(id) {
        $("#" + id).text("").hide();
    }

    // REAL-TIME NAME VALIDATION
    $("#name").on("input", function () {
        const val = $(this).val();

        if (/[0-9]/.test(val)) {
            showError("name-error", "Numbers are not allowed.");
            return;
        }
        if (/[^a-zA-Z\s]/.test(val)) {
            showError("name-error", "Special characters are not allowed.");
            return;
        }

        const trimmed = val.trim();
        const regex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;

        if (trimmed.length === 0) {
            showError("name-error", "Name is required.");
        } else if (!regex.test(trimmed)) {
            showError("name-error", "Invalid name format.");
        } else {
            clearError("name-error");
        }
    });

    // CLEAR ERRORS ON CHANGE
    $('input[name="profile"]').on("change", () => clearError("profile-error"));
    $('input[name="gender"]').on("change", () => clearError("gender-error"));

    $('#department input[type="checkbox"]').on("change", function () {
        if ($('#department input:checked').length > 0) {
            clearError("department-error");
        }
    });

    $("#salary").on("change", function () {
        if ($(this).val() !== "Select Salary") {
            clearError("salary-error");
        }
    });

    $("#day, #month, #year").on("change", function () {
        if ($("#day").val() !== "Day" &&
            $("#month").val() !== "Month" &&
            $("#year").val() !== "Year") {
            clearError("date-error");
        }
    });

    // FORM SUBMIT
    $("#form").on("submit", async function (e) {
        e.preventDefault();

        let isValid = true;

        const name = $("#name").val().trim();
        const profile = $('input[name="profile"]:checked').val();
        const gender = $('input[name="gender"]:checked').val();

        const departments = [];
        $('input[type="checkbox"]:checked').each(function () {
            departments.push($(this).val());
        });

        const salary = $("#salary").val();
        const day = $("#day").val();
        const month = $("#month").val();
        const year = $("#year").val();
        const notes = $("#notes").val();

        const regex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;

        if (!name) {
            showError("name-error", "Name is required.");
            isValid = false;
        } else if (!regex.test(name)) {
            showError("name-error", "Invalid name.");
            isValid = false;
        } else {
            clearError("name-error");
        }

        if (!profile) {
            showError("profile-error", "Select profile.");
            isValid = false;
        } else clearError("profile-error");

        if (!gender) {
            showError("gender-error", "Select gender.");
            isValid = false;
        } else clearError("gender-error");

        if (departments.length === 0) {
            showError("department-error", "Select department.");
            isValid = false;
        } else clearError("department-error");

        if (salary === "Select Salary") {
            showError("salary-error", "Select salary.");
            isValid = false;
        } else clearError("salary-error");

        if (day === "Day" || month === "Month" || year === "Year") {
            showError("date-error", "Select date.");
            isValid = false;
        } else clearError("date-error");

        if (!isValid) return;

        const startDate = `${day} ${month} ${year}`;

        const res = await fetch("http://localhost:3000/employees");
        const data = await res.json();

        const duplicate = data.find(emp =>
            emp.name.toLowerCase() === name.toLowerCase() &&
            emp.id != id
        );

        if (duplicate) {
            showError("name-error", "Employee already exists!");
            return;
        }

        const employee = {
            name,
            profile,
            gender,
            department: departments,
            salary,
            startDate,
            notes
        };

        if (id) {
            await fetch(`http://localhost:3000/employees/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
            alert("Employee Updated");
        } else {
            await fetch("http://localhost:3000/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
            alert("Employee Added");
        }

        window.location.href = "index.html";
    });

});