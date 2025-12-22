// === 1. الإعدادات والبيانات الأساسية ===
let savedSemesters = JSON.parse(localStorage.getItem('savedSemesters')) || []; 
let courses = [];         
let currentEditingName = null; 
let editingIndex = null; // لمتابعة الترم الذي يتم تعديله حالياً
let maxCoursesAllowed = 6;     
let currentLang = 'en';

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// نصوص الترجمة
const i18n = {
    en: {
        title: "GPA Calculator",
        subjectPlaceholder: "Subject Name",
        addBtn: "Add course ➕",
        saveBtn: "Save & Update Semester",
        savedTitle: "Saved Semesters",
        finalGpa: "Final GPA",
        langBtn: "العربية",
        header: ["Subject", "Grade", "Hours", "Delete"]
    },
    ar: {
        title: "حاسبة المعدل التراكمي",
        subjectPlaceholder: "اسم المادة",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "الترمات المحفوظة",
        finalGpa: "المعدل النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"]
    }
};

// === 2. ربط عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject');
const gradeSelect = document.getElementById('grade');
const creditsSelect = document.getElementById('credits');
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === 3. وظائف الذاكرة واللغة ===
function saveToLocal() {
    localStorage.setItem('savedSemesters', JSON.stringify(savedSemesters));
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const lang = i18n[currentLang];
    
    document.querySelector('h1').innerText = lang.title;
    subjectInput.placeholder = lang.subjectPlaceholder;
    addCourseBtn.innerText = lang.addBtn;
    document.querySelector('button[onclick="saveAndClearSemester()"]').innerText = lang.saveBtn;
    document.querySelector('#saved-semesters-box h3').innerText = lang.savedTitle;
    document.querySelector('.gpa-result h2').innerText = lang.finalGpa;
    document.getElementById('lang-btn').innerText = lang.langBtn;
    
    const headers = document.querySelectorAll('.course-header div');
    if (headers.length > 0) {
        lang.header.forEach((text, i) => headers[i].innerText = text);
    }
    
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    renderSavedSemesters();
}

// === 4. إدارة الكورسات الحالية ===
addCourseBtn.addEventListener('click', () => {
    if (courses.length >= maxCoursesAllowed) {
        alert(currentLang === 'en' ? `Limit is ${maxCoursesAllowed} courses.` : `الحد الأقصى هو ${maxCoursesAllowed} مواد.`);
        return;
    }

    const subject = subjectInput.value.trim();
    if (!subject) {
        alert(currentLang === 'en' ? "Please enter subject name!" : "يرجى إدخال اسم المادة!");
        return;
    }

    courses.push({ subject, grade: gradeSelect.value, credits: parseFloat(creditsSelect.value) });
    updateUI();
    subjectInput.value = '';
    subjectInput.focus();
});

function deleteCourse(index) {
    courses.splice(index, 1);
    updateUI();
}

function updateUI() {
    renderCourses();
    calculateGPA();
}

function renderCourses() {
    coursesList.innerHTML = ''; 
    courses.forEach((course, index) => {
        const row = document.createElement('div');
        row.className = 'course-row'; 
        row.innerHTML = `
            <div style="flex:1;">${course.subject}</div>
            <div style="flex:1;">${course.grade}</div>
            <div style="flex:1;">${course.credits} ${currentLang === 'en' ? 'h' : 'ساعة'}</div>
            <div style="flex:0.5;"><button onclick="deleteCourse(${index})" class="delete-btn">X</button></div>
        `;
        coursesList.appendChild(row);
    });
}

// === 5. دالة الحساب الرئيسية (التراكمي) ===
function calculateGPA() {
    let totalPoints = 0, totalHours = 0;
    courses.forEach(c => {
        totalPoints += (gradePoints[c.grade] || 0) * c.credits;
        totalHours += c.credits;
    });
    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            totalPoints += sem.totalPoints;
            totalHours += sem.totalHours;
        }
    });
    gpaDisplay.innerText = totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : "0.00";
}

// === 6. إدارة الترمات (حفظ وتعديل ذكي) ===
function saveAndClearSemester() {
    if (courses.length === 0) {
        alert(currentLang === 'en' ? "No courses to save!" : "لا توجد مواد لحفظها!");
        return;
    }

    let semPoints = 0, semHours = 0;
    courses.forEach(c => {
        semPoints += (gradePoints[c.grade] || 0) * c.credits;
        semHours += c.credits;
    });

    const semGPA = (semPoints / semHours).toFixed(2);
    maxCoursesAllowed = parseFloat(semGPA) >= 3.0 ? 7 : 6;

    const semesterData = {
        id: editingIndex !== null ? savedSemesters[editingIndex].id : Date.now(),
        name: currentEditingName || (currentLang === 'en' ? `Semester ${savedSemesters.length + 1}` : `الترم ${savedSemesters.length + 1}`),
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
        courseDetails: [...courses]
    };

    if (editingIndex !== null) {
        savedSemesters[editingIndex] = semesterData; // تحديث في نفس المكان
        editingIndex = null;
    } else {
        savedSemesters.push(semesterData); // إضافة جديد
    }

    courses = [];
    currentEditingName = null;
    saveToLocal();
    updateUI();
    renderSavedSemesters();
}

function renderSavedSemesters() {
    semestersList.innerHTML = '';
    savedSemestersBox.style.display = savedSemesters.length > 0 ? 'block' : 'none';

    savedSemesters.forEach((sem, index) => {
        const div = document.createElement('div');
        div.className = 'semester-card';
        div.innerHTML = `
            <div class="semester-info">
                <input type="checkbox" id="sem-${sem.id}" ${sem.isChecked ? 'checked' : ''} onchange="toggleSemester(${index})">
                <label for="sem-${sem.id}">${sem.name}</label>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="semester-gpa">GPA: ${sem.gpa}</span>
                <button onclick="editSemester(${index})" class="btn-edit-sem">${currentLang === 'en' ? 'Edit' : 'تعديل'}</button>
                <button onclick="deleteSemester(${index})" class="btn-delete-sem">${currentLang === 'en' ? 'Delete' : 'حذف'}</button>
            </div>
        `;
        semestersList.appendChild(div);
    });
}

function toggleSemester(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    saveToLocal();
    calculateGPA();
}

function deleteSemester(index) {
    if (confirm(currentLang === 'en' ? "Delete this semester?" : "هل تريد حذف هذا الترم؟")) {
        savedSemesters.splice(index, 1);
        saveToLocal();
        renderSavedSemesters();
        calculateGPA();
    }
}

function editSemester(index) {
    if (courses.length > 0 && !confirm(currentLang === 'en' ? "Unsaved changes will be lost. Continue?" : "لديك تعديلات غير محفوظة، هل تريد تجاهلها؟")) return;

    const sem = savedSemesters[index];
    courses = [...sem.courseDetails];
    currentEditingName = sem.name; // الحفاظ على اسم ورقم الترم
    editingIndex = index; // تحديد مكان الترم للتحديث لاحقاً
    maxCoursesAllowed = courses.length > 6 ? 7 : 6;

    updateUI();
    renderSavedSemesters();
}

// تشغيل عند التحميل
renderSavedSemesters();
updateUI();