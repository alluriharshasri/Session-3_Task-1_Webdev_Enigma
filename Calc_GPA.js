document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function() {
        const numCourses = parseInt(document.getElementById("inputCoursesNumber").value, 10);

        if (isNaN(numCourses) || numCourses <= 0) {
            toastr.error("Please enter a valid number of courses.", "Error");
            return;
        }

        generateCourseInputs(numCourses);
    });
});

function generateCourseInputs(numCourses) {
    const courseDetailsDiv = document.getElementById("courseDetails");
    courseDetailsDiv.innerHTML = "";

    for (let i = 1; i <= numCourses; i++) {
        const courseDiv = document.createElement("div");
        courseDiv.className = "row mb-2";

        const nameDiv = document.createElement("div");
        nameDiv.className = "col";
        const nameLabel = document.createElement("label");
        nameLabel.textContent = `Course ${i} Name:`;
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.className = "form-control";
        nameInput.name = `course${i}Name`;
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        const creditsDiv = document.createElement("div");
        creditsDiv.className = "col";
        const creditsLabel = document.createElement("label");
        creditsLabel.textContent = `Credits for Course ${i}:`;
        const creditsInput = document.createElement("input");
        creditsInput.type = "number";
        creditsInput.className = "form-control";
        creditsInput.name = `course${i}Credits`;
        creditsDiv.appendChild(creditsLabel);
        creditsDiv.appendChild(creditsInput);

        const gradeDiv = document.createElement("div");
        gradeDiv.className = "col";
        const gradeLabel = document.createElement("label");
        gradeLabel.textContent = `Choose Grade for Course ${i}:`;
        const gradeSelect = document.createElement("select");
        gradeSelect.className = "form-control";
        gradeSelect.name = `course${i}Grade`;
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Choose Grade";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        gradeSelect.appendChild(defaultOption);

        grades.forEach(grade => {
            const option = document.createElement("option");
            option.value = grade.value;
            option.textContent = grade.grade;
            gradeSelect.appendChild(option);
        });

        gradeDiv.appendChild(gradeLabel);
        gradeDiv.appendChild(gradeSelect);

        courseDiv.appendChild(nameDiv);
        courseDiv.appendChild(creditsDiv);
        courseDiv.appendChild(gradeDiv);

        courseDetailsDiv.appendChild(courseDiv);
    }

    const calculateButton = document.createElement("button");
    calculateButton.className = "btn btn-primary btn-block";
    calculateButton.textContent = "Calculate GPA";
    calculateButton.addEventListener("click", calculateGPA);

    courseDetailsDiv.appendChild(document.createElement("hr"));
    courseDetailsDiv.appendChild(calculateButton);
}

function calculateGPA() {
    const numCourses = parseInt(document.getElementById("inputCoursesNumber").value, 10);
    const courseData = [];

    for (let i = 1; i <= numCourses; i++) {
        const courseName = document.querySelector(`input[name="course${i}Name"]`).value;
        const courseCredits = parseFloat(document.querySelector(`input[name="course${i}Credits"]`).value);
        const courseGrade = parseFloat(document.querySelector(`select[name="course${i}Grade"]`).value);

        if (!courseName || isNaN(courseCredits) || courseCredits <= 0 || isNaN(courseGrade) || courseGrade < 0) {
            toastr.error(`Invalid input for Course ${i}. Please check your entries.`, "Error");
            return;
        }

        courseData.push({
            name: courseName,
            credits: courseCredits,
            grade: courseGrade
        });
    }

    const totalCredits = courseData.reduce((acc, course) => acc + course.credits, 0);
    const weightedGPA = courseData.reduce((acc, course) => acc + (course.credits * course.grade), 0) / totalCredits;
    const roundedGPA = roundToTwo(weightedGPA);

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <p>Your GPA: ${roundedGPA}</p>
        <p>Total Credits: ${totalCredits}</p>
    `;
    outputDiv.classList.add("show");
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}
