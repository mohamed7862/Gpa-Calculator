// === المتغيرات الأساسية ===
let savedSemesters = []; // مصفوفة لتخزين الترمات السابقة
let courses = [];        // مصفوفة الكورسات الحالية
let currentEditingName = null; // متغير لحفظ اسم الترم عند التعديل
let maxCoursesAllowed = 6;    // الحد الأقصى الافتراضي للمواد

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// === عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject') || document.querySelector('input[type="text"]');
const gradeSelect = document.getElementById('grade');
const creditsSelect = document.getElementById('credits');
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === 1. إضافة كورس جديد (يدوي) ===
addCourseBtn.addEventListener('click', () => {
    // التحقق بناءً على الحد الأقصى الديناميكي (6 أو 7)
    if (courses.length >= maxCoursesAllowed) {
        alert(`عفواً! الحد الأقصى المسموح لك هو ${maxCoursesAllowed} مواد فقط بناءً على معدلك.`);
        return;
    }

    const subject = subjectInput.value.trim();
    const gradeVal = gradeSelect.value;
    const creditVal = parseFloat(creditsSelect.value);

    if (subject === "") {
        alert("Please enter a subject name!");
        return;
    }

    courses.push({ subject: subject, grade: gradeVal, credits: creditVal });
    
    renderCourses();
    calculateGPA();
    
    subjectInput.value = '';
    subjectInput.focus();
});

// === 2. رسم الكورسات الحالية ===
function renderCourses() {
    coursesList.innerHTML = ''; 
    courses.forEach((course, index) => {
        const row = document.createElement('div');
        row.className = 'course-row'; 
        
        row.innerHTML = `
            <div style="flex:1;">${course.subject}</div>
            <div style="flex:1;">${course.grade}</div>
            <div style="flex:1;">${course.credits}</div>
            <div style="flex:0.5;">
                <button onclick="deleteCourse(${index})" style="background:red; color:white; border:none; padding:5px; cursor:pointer; border-radius:4px;">X</button>
            </div>
        `;
        coursesList.appendChild(row);
    });
}

function deleteCourse(index) {
    courses.splice(index, 1);
    renderCourses();
    calculateGPA();
}

// === 3. دالة الحساب الرئيسية ===
function calculateGPA() {
    let totalPoints = 0;
    let totalHours = 0;

    // المواد الحالية
    courses.forEach(course => {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalHours += course.credits;
    });

    // الترمات المحفوظة
    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            totalPoints += sem.totalPoints;
            totalHours += sem.totalHours;
        }
    });

    if (totalHours > 0) {
        gpaDisplay.innerText = (totalPoints / totalHours).toFixed(2);
    } else {
        gpaDisplay.innerText = "0.00";
    }
}

// === 4. زر إضافة 6 مواد ===
function addSemester() {
    if (courses.length > 0) {
        alert("الجدول يحتوي على مواد بالفعل! لا يمكن إضافة مواد تلقائية فوقها.");
        return;
    }

    const gradeVal = gradeSelect.value; 
    const creditVal = parseFloat(creditsSelect.value);
    
    // يضيف 6 مواد دائماً كبداية سريعة
    for (let i = 1; i <= 6; i++) {
        courses.push({ subject: "Course " + i, grade: gradeVal, credits: creditVal });
    }
    
    renderCourses();
    calculateGPA();
}

// === 5. حفظ الترم الحالي (تم تحديث المنطق هنا) ===
function saveAndClearSemester() {
    if (courses.length === 0) {
        alert("لا يوجد مواد لحفظها!");
        return;
    }

    let semPoints = 0;
    let semHours = 0;
    
    courses.forEach(c => {
        semPoints += (gradePoints[c.grade] || 0) * c.credits;
        semHours += c.credits;
    });
    
    let semGPA = semHours > 0 ? (semPoints / semHours).toFixed(2) : "0.00";

    // --- منطق المادة السابعة ---
    if (parseFloat(semGPA) >= 3.0) {
        maxCoursesAllowed = 7;
        alert(`ممتاز! معدل الترم ${semGPA} يسمح لك بإضافة مادة سابعة في الترم القادم.`);
    } else {
        maxCoursesAllowed = 6;
    }

    // تحديد اسم الترم
    let semesterName = currentEditingName !== null ? currentEditingName : `Semester ${savedSemesters.length + 1}`;
    currentEditingName = null; 

    const newSemester = {
        id: Date.now(),
        name: semesterName,
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
        courseDetails: [...courses]
    };

    savedSemesters.push(newSemester);

    courses = [];
    renderCourses();
    renderSavedSemesters();
    calculateGPA();
}

// === 6. رسم قائمة الترمات المحفوظة ===
function renderSavedSemesters() {
    semestersList.innerHTML = '';
    
    if (savedSemesters.length > 0) {
        savedSemestersBox.style.display = 'block';
    } else {
        savedSemestersBox.style.display = 'none';
    }

    savedSemesters.forEach((sem, index) => {
        const div = document.createElement('div');
        div.className = 'semester-card';
        
        div.innerHTML = `
            <div class="semester-info">
                <input type="checkbox" id="sem-${sem.id}" ${sem.isChecked ? 'checked' : ''} onchange="toggleSemester(${index})">
                <label for="sem-${sem.id}" style="cursor: pointer;">${sem.name}</label>
            </div>
            
            <div style="display: flex; align-items: center;">
                <span class="semester-gpa" style="margin-right: 10px;">GPA: ${sem.gpa}</span>
                <button onclick="editSemester(${index})" class="btn-edit-sem">Edit</button>
                <button onclick="deleteSemester(${index})" class="btn-delete-sem">Delete</button>
            </div>
        `;
        semestersList.appendChild(div);
    });
}

// === 7. الدوال المساعدة ===

function deleteSemester(index) {
    if (confirm("Are you sure you want to delete this semester?")) {
        savedSemesters.splice(index, 1);
        renderSavedSemesters();
        calculateGPA();
    }
}

function toggleSemester(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    calculateGPA();
}

function editSemester(index) {
    if (courses.length > 0) {
        let confirmSwitch = confirm("تحذير: الجدول الحالي يحتوي على مواد غير محفوظة.\nهل تريد استبدالها ببيانات الترم الذي تريد تعديله؟");
        if (!confirmSwitch) return;
    }

    const semesterToEdit = savedSemesters[index];
    
    currentEditingName = semesterToEdit.name;

    // إذا كان الترم الذي يتم تعديله يحتوي أصلاً على 7 مواد، نفتح الحد فوراً
    if (semesterToEdit.courseDetails.length > 6) {
        maxCoursesAllowed = 7;
    }

    courses = [...semesterToEdit.courseDetails]; 

    savedSemesters.splice(index, 1);

    renderCourses();
    renderSavedSemesters();
    calculateGPA();
    
    alert(`تم استرجاع ${semesterToEdit.name} للتعديل.`);
}