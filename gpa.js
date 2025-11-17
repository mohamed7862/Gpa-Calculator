const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

let courses = [];

const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject');
const gradeSelect = document.getElementById('grade');
const creditsSelect = document.getElementById('credits');
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');

addCourseBtn.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const grade = gradeSelect.value;
    const credits = parseFloat(creditsSelect.value);

    if (subject === "") {
        alert("Please enter a subject name !");
        return;
    }

    courses.push({ subject, grade, credits });
    renderCourses();
    calculateGPA();
    
    subjectInput.value = '';
    subjectInput.focus();
});



function renderCourses() {
    coursesList.innerHTML = ''; 
    
    courses.forEach((course, index) => {
        const row = document.createElement('div');
        row.className = 'course-row'; 

        row.innerHTML = `
            <div>${course.subject}</div>
            <div>${course.grade}</div>
            <div>${course.credits}</div>
            <div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        coursesList.appendChild(row);
    });
}
coursesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        
        const index = parseInt(e.target.dataset.index, 10);
        
        courses.splice(index, 1);
        
        renderCourses();
        calculateGPA();
        
    }
});


function calculateGPA() {
    let totalQualityPoints = 0;
    let totalCreditHours = 0;

    courses.forEach(course => {
        totalQualityPoints += gradePoints[course.grade] * course.credits;
        totalCreditHours += course.credits;
    });

    const gpa = totalCreditHours === 0 ? 0 : totalQualityPoints / totalCreditHours;
    gpaDisplay.textContent = gpa.toFixed(2);
}