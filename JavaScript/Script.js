// window.onload = function () {

//     const editData = JSON.parse(localStorage.getItem("editEmployee"));

//     if (editData) {

//         document.getElementById("name").value = editData.name;

//         document.querySelector(`input[name="gender"][value="${editData.gender}"]`).checked = true;

//         document.getElementById("salary").value = editData.salary;

//         document.getElementById("notes").value = editData.notes;

//         // set departments
//         document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
//             if (editData.department.includes(cb.value)) {
//                 cb.checked = true;
//             }
//         });

//         // set profile image
//         document.querySelector(`input[name="profile"][value="${editData.profile}"]`).checked = true;
//     }
// };


// const form = document.getElementById("form");

// if (form) {
//     form.addEventListener("submit", function(e) {
//         e.preventDefault();

//         const name = document.getElementById("name").value;
//         const image = document.querySelector('input[name="profile"]:checked')?.value;
//         const gender = document.querySelector('input[name="gender"]:checked')?.value;
//         const salary = document.getElementById("salary").value;

//         const day = document.getElementById("day").value;
//         const month = document.getElementById("month").value;
//         const year = document.getElementById("year").value;

//         const startDate = `${day} ${month} ${year}`;
//         const notes = document.getElementById("notes").value;

//         const departments = [];
//         document.querySelectorAll('input[type="checkbox"]:checked')
//             .forEach(cb => departments.push(cb.value));

//         const employee = {
//             id: Date.now(),
//             name,
//             profile: image,
//             gender,
//             department: departments,
//             startDate,
//             salary,
//             notes
//         };

//         let employees = JSON.parse(localStorage.getItem("employees")) || [];

//         employees.push(employee);

//         localStorage.setItem("employees", JSON.stringify(employees));

//         window.location.href = "index.html";
//     });
// }



const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
    fetch(`http://localhost:3000/employees/${id}`, { cache: "no-cache" })
        .then(res => res.json())
        .then(emp => {

            document.getElementById("name").value = emp.name;

            document.querySelector(`input[name="gender"][value="${emp.gender}"]`).checked = true;

            document.querySelector(`input[name="profile"][value="${emp.profile}"]`).checked = true;

            emp.department.forEach(dep => {
                const depEl = document.querySelector(`#department input[value="${dep}"]`);
                if (depEl) depEl.checked = true;
            });

            document.getElementById("salary").value = emp.salary;
            document.getElementById("notes").value = emp.notes || "";

            if (emp.startDate) {
                const dateParts = emp.startDate.split(" ");
                if (dateParts.length === 3) {
                    document.getElementById("day").value = dateParts[0];
                    document.getElementById("month").value = dateParts[1];
                    document.getElementById("year").value = dateParts[2];
                }
            }
        })
        .catch(err => console.error("Error fetching employee for edit:", err));
}


document.getElementById("cancelBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
});


const form = document.getElementById("form");

function showError(errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
    }
}

function clearError(errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
    }
}

// Real-time validation for Name
const nameInput = document.getElementById("name");
if (nameInput) {
    nameInput.addEventListener("input", function () {
        const val = this.value;
        if (/[0-9]/.test(val)) {
            showError("name-error", "Numbers are not allowed.");
            return;
        }
        if (/[^a-zA-Z\s]/.test(val)) {
            showError("name-error", "Special characters are not allowed.");
            return;
        }
        
        const trimmedVal = val.trim();
        const nameRegex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;
        if (trimmedVal.length === 0) {
            showError("name-error", "Name is required.");
        } else if (!nameRegex.test(trimmedVal)) {
            showError("name-error", "Name is invalid. It should start with a capital letter and have min 3 characters.");
        } else {
            clearError("name-error");
        }
    });
}


document.querySelectorAll('input[name="profile"]').forEach(radio => {
    radio.addEventListener("change", () => clearError("profile-error"));
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", () => clearError("gender-error"));
});

document.querySelectorAll('#department input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const anyChecked = document.querySelectorAll('#department input[type="checkbox"]:checked').length > 0;
        if (anyChecked) clearError("department-error");
    });
});

document.getElementById("salary")?.addEventListener("change", function () {
    if (this.value !== "Select Salary") clearError("salary-error");
});

const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
if (daySelect && monthSelect && yearSelect) {
    [daySelect, monthSelect, yearSelect].forEach(select => {
        select.addEventListener("change", () => {
            const day = daySelect.value;
            const month = monthSelect.value;
            const year = yearSelect.value;
            if (day !== "Day" && month !== "Month" && year !== "Year") {
                clearError("date-error");
            }
        });
    });
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const profile = document.querySelector('input[name="profile"]:checked')?.value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;

        const departments = [];
        document.querySelectorAll('input[type="checkbox"]:checked')
            .forEach(cb => departments.push(cb.value));

        const salary = document.getElementById("salary").value;

        const day = document.getElementById("day").value;
        const month = document.getElementById("month").value;
        const year = document.getElementById("year").value;

        const notes = document.getElementById("notes").value;

       
        const nameRegex = /^[A-Z][a-zA-Z]{2,}( [A-Z][a-zA-Z]{2,})*$/;
        const rawNameVal = document.getElementById("name").value;
        if (rawNameVal.trim().length === 0) {
            showError("name-error", "Name is required.");
            isValid = false;
        } else if (/[0-9]/.test(rawNameVal)) {
            showError("name-error", "Numbers are not allowed.");
            isValid = false;
        } else if (/[^a-zA-Z\s]/.test(rawNameVal)) {
            showError("name-error", "Special characters are not allowed.");
            isValid = false;
        } else if (!nameRegex.test(name)) {
            showError("name-error", "Name is invalid. It should start with a capital letter and have min 3 characters.");
            isValid = false;
        } else {
            clearError("name-error");
        }

        if (!profile) {
            showError("profile-error", "Profile image is required.");
            isValid = false;
        } else {
            clearError("profile-error");
        }

        if (!gender) {
            showError("gender-error", "Gender is required.");
            isValid = false;
        } else {
            clearError("gender-error");
        }

        if (departments.length === 0) {
            showError("department-error", "Select Department.");
            isValid = false;
        } else {
            clearError("department-error");
        }

        if (salary === "Select Salary") {
            showError("salary-error", "Select Salary.");
            isValid = false;
        } else {
            clearError("salary-error");
        }

        if (day === "Day" || month === "Month" || year === "Year") {
            showError("date-error", "Please select a valid start date.");
            isValid = false;
        } else {
            clearError("date-error");
        }

        if (!isValid) return;

        const startDate = `${day} ${month} ${year}`;

        const res = await fetch("http://localhost:3000/employees", { cache: "no-cache" });
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
        } 
        else {
            await fetch("http://localhost:3000/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });

            alert("Employee Added");
        }
        console.log("redirecting");
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error submitting employee details:", err);
        alert("Failed to submit form.");
    }
});
