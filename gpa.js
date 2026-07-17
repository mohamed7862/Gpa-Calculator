// === 1. الإعدادات والبيانات الأساسية ===
let savedSemesters = JSON.parse(localStorage.getItem('savedSemesters')) || []; 
let courses = []; 
let currentEditingName = null; 
let editingIndex = null; 
let maxCoursesAllowed = 6; 
let currentLang = 'en';

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// قائمة المواد المقترحة من الجداول (الأساسي والاختياري)
const predefinedCourses = [
    // === First Level - First Semester ===
    { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2 },
    { en: "Creative Thinking and Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "H 102", credits: 2 },
    { en: "Calculus", ar: "تفاضل وتكامل", hint: "BS 101", credits: 3 },
    { en: "Intro to computer Science", ar: "مقدمة في علوم الحاسب", hint: "CS 101", credits: 3 },
    { en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "CS 103", credits: 3 },
    { en: "Electronics", ar: "إلكترونيات", hint: "BS 131", credits: 3 },

    // === First Level - Second Semester ===
    { en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "H 103", credits: 2 },
    { en: "Physics", ar: "فيزياء", hint: "BS 121", credits: 3 },
    { en: "Computer Programming", ar: "برمجة الحاسب", hint: "CS 102", credits: 3 },
    { en: "Linear Algebra", ar: "الجبر الخطي", hint: "BS 102", credits: 3 },
    { en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "BS 103", credits: 3 },
    { en: "Logic Design", ar: "التصميم المنطقي", hint: "CS 121", credits: 3 },

    // === Fourth Level - First Semester ===
    { en: "Computer Security", ar: "أمن الحاسبات", hint: "CS 413", credits: 3 },
    { en: "Digital Image processing", ar: "معالجة الصور الرقمية", hint: "CS 443", credits: 3 },
    { en: "Elective 3", ar: "مقرر اختياري 3", hint: "TBD", credits: 3 },
    { en: "Elective 4", ar: "مقرر اختياري 4", hint: "TBD", credits: 3 },
    { en: "Elective 5", ar: "مقرر اختياري 5", hint: "TBD", credits: 3 },
    { en: "Senior Project 1", ar: "مشروع تخرج 1", hint: "CS 498", credits: 3 },

    // === Fourth Level - Second Semester ===
    { en: "Machine Learning", ar: "تعلم الآلة", hint: "CS 462", credits: 3 },
    { en: "Internet of Things (IoT)", ar: "إنترنت الأشياء", hint: "CS 455", credits: 3 },
    { en: "Elective 6", ar: "مقرر اختياري 6", hint: "TBD", credits: 3 },
    { en: "Elective 7", ar: "مقرر اختياري 7", hint: "TBD", credits: 3 },
    { en: "Senior Project 2", ar: "مشروع تخرج 2", hint: "CS 499", credits: 3 },

    // === Elective Courses (المقررات الاختيارية) ===
    { en: "Game Design & Development", ar: "تطوير وتصميم الألعاب", hint: "CS 313", credits: 3 },
    { en: "Human Computer Interaction", ar: "طرق اتصال الإنسان بالحاسب", hint: "CS 314", credits: 3 },
    { en: "Real Time Systems", ar: "نظم الزمن الحقيقي", hint: "CS 332", credits: 3 },
    { en: "Simulation and Modeling", ar: "النمذجة والمحاكاة", hint: "CS 351", credits: 3 },
    { en: "Neural Networks", ar: "الشبكات العصبية", hint: "CS 361", credits: 3 },
    { en: "Geographic Information Systems", ar: "نظم المعلومات الجغرافية", hint: "CS 405", credits: 3 },
    { en: "Parallel Processing", ar: "المعالجة المتوازية", hint: "CS 418", credits: 3 },
    { en: "Distributed Systems", ar: "الأنظمة الموزعة", hint: "CS 432", credits: 3 },
    { en: "Cloud Computing", ar: "الحوسبة السحابية", hint: "CS 433", credits: 3 },
    { en: "Virtual Reality", ar: "الواقع الافتراضي", hint: "CS 444", credits: 3 },
    { en: "Computer Vision Systems", ar: "نظم الرؤية بالحاسب", hint: "CS 445", credits: 3 },
    { en: "Introduction to embedded systems", ar: "مقدمة في النظم المدمجة", hint: "CS 463", credits: 3 },
    { en: "Data Warehousing", ar: "مستودعات البيانات", hint: "CS 470", credits: 3 },

    // === Second Level - First Semester ===
    { en: "Work Ethics", ar: "أخلاقيات العمل", hint: "H 201", credits: 2 },
    { en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "CS 203", credits: 3 },
    { en: "Operations Research", ar: "بحوث العمليات", hint: "BS 205", credits: 3 },
    { en: "Statistics and Probabilities", ar: "إحصاء واحتمالات", hint: "BS 210", credits: 3 },
    { en: "File Processing", ar: "معالجة الملفات", hint: "CS 211", credits: 3 },
    { en: "Computer Organization & Assembly Language", ar: "تنظيم الحاسب ولغة التجميع", hint: "CS 220", credits: 3 },

    // === Second Level - Second Semester ===
    { en: "Business Administration", ar: "إدارة الأعمال", hint: "H 202", credits: 2 },
    { en: "Data Structure", ar: "هياكل البيانات", hint: "CS 201", credits: 3 },
    { en: "Human Rights", ar: "حقوق الإنسان", hint: "H 204", credits: 2 },
    { en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "CS 210", credits: 3 },
    { en: "Computer Networks", ar: "شبكات الحاسب", hint: "CS 250", credits: 3 },
    { en: "Web Programming", ar: "برمجة الويب", hint: "CS 206", credits: 3 },

    // === Third Level - First Semester ===
    { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3 },
    { en: "Mobile App Development", ar: "تطوير تطبيقات الموبايل", hint: "CS 309", credits: 3 },
    { en: "Software Engineering", ar: "هندسة البرمجيات", hint: "CS 315", credits: 3 },
    { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3 },
    { en: "Intro to Databases", ar: "مقدمة في قواعد البيانات", hint: "CS 323", credits: 3 },

    // === Third Level - Second Semester ===
    { en: "Analysis of Algorithms", ar: "تحليل الخوارزميات", hint: "CS 312", credits: 3 },
    { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3 },
    { en: "Computer Graphics", ar: "الرسوميات بالحاسب", hint: "CS 340", credits: 3 },
    { en: "Fundamentals of Multimedia", ar: "أساسيات الوسائط المتعددة", hint: "CS 353", credits: 3 },
    { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3 }
];

// نصوص الترجمة
const i18n = {
    en: {
        title: "GPA Calculator",
        subjectPlaceholder: "Subject Name (Type to search)",
        addBtn: "Add course ➕",
        saveBtn: "Save & Update Semester",
        savedTitle: "Saved Semesters",
        finalGpa: "Final GPA",
        langBtn: "العربية",
        header: ["Subject", "Grade", "Hours", "Delete"],
        termGpa: "Term:",
        cgpa: "CGPA:"
    },
    ar: {
        title: "حاسبة المعدل التراكمي",
        subjectPlaceholder: "اسم المادة (ابحث أو اكتب)",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "الترمات المحفوظة",
        finalGpa: "المعدل النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"],
        termGpa: "فصلي:",
        cgpa: "تراكمي:"
    }
};

// === 2. ربط عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject');
const gradeSelect = document.getElementById('grade');
// لغينا creditsSelect من هنا
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === وظيفة جديدة: تعبئة قائمة المواد الذكية ===
function populateDatalist() {
    const datalist = document.getElementById('subjects-list');
    if (!datalist) return;
    datalist.innerHTML = '';
    predefinedCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = currentLang === 'en' ? course.en : course.ar;
        option.textContent = `- ${course.hint}`;
        datalist.appendChild(option);
    });
}

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
    populateDatalist(); 
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

    // التعرف على عدد الساعات تلقائياً
    const predefinedCourse = predefinedCourses.find(c => c.en === subject || c.ar === subject);
    let courseCredits = 3; // افتراضي 3 ساعات
    
    if (predefinedCourse) {
        courseCredits = predefinedCourse.credits; // من القائمة
    } else if (subject.toUpperCase().includes('H')) {
        courseCredits = 2; // مادة خارجية تحتوي على حرف H
    }

    courses.push({ subject, grade: gradeSelect.value, credits: courseCredits });
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

// === 5. دالة الحساب الذكية للنهائي ===
function calculateGPA() {
    let allCourses = [];

    courses.forEach(c => allCourses.push({ ...c }));

    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            sem.courseDetails.forEach(c => allCourses.push({ ...c }));
        }
    });

    let uniqueCourses = {};

    allCourses.forEach(course => {
        let normalizedName = course.subject.trim().toLowerCase();
        let points = gradePoints[course.grade] || 0;
        uniqueCourses[normalizedName] = { ...course, points };
    });

    let totalPoints = 0, totalHours = 0;

    Object.values(uniqueCourses).forEach(c => {
        totalPoints += c.points * c.credits;
        totalHours += c.credits;
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
        savedSemesters[editingIndex] = semesterData; 
        editingIndex = null;
    } else {
        savedSemesters.push(semesterData); 
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

    let runningUniqueCourses = {};

    savedSemesters.forEach((sem, index) => {
        let semCGPA = "0.00";

        if (sem.isChecked) {
            sem.courseDetails.forEach(course => {
                let normalizedName = course.subject.trim().toLowerCase();
                let points = gradePoints[course.grade] || 0;
                runningUniqueCourses[normalizedName] = { ...course, points };
            });

            let runningPoints = 0;
            let runningHours = 0;
            Object.values(runningUniqueCourses).forEach(c => {
                runningPoints += c.points * c.credits;
                runningHours += c.credits;
            });

            semCGPA = runningHours > 0 ? (runningPoints / runningHours).toFixed(2) : "0.00";
        } else {
            semCGPA = "-";
        }

        const div = document.createElement('div');
        div.className = 'semester-card';
        div.innerHTML = `
            <div class="semester-info" style="margin-bottom: 10px;">
                <input type="checkbox" id="sem-${sem.id}" ${sem.isChecked ? 'checked' : ''} onchange="toggleSemester(${index})">
                <label for="sem-${sem.id}" style="font-weight: bold; font-size: 16px;">${sem.name}</label>
            </div>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 15px; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 8px;">
                <span class="semester-gpa" style="font-size: 14px;">${i18n[currentLang].termGpa} <strong>${sem.gpa}</strong></span>
                <span class="semester-cgpa" style="font-size: 14px; color: #07ffb5; font-weight: bold;">| ${i18n[currentLang].cgpa} ${semCGPA}</span>
                <div style="margin-left: auto; display: flex; gap: 5px;">
                    <button onclick="editSemester(${index})" class="btn-edit-sem">${currentLang === 'en' ? 'Edit' : 'تعديل'}</button>
                    <button onclick="deleteSemester(${index})" class="btn-delete-sem" style="background: #ff4d4d; color: white;">${currentLang === 'en' ? 'Delete' : 'حذف'}</button>
                </div>
            </div>
        `;
        semestersList.appendChild(div);
    });
}

function toggleSemester(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    saveToLocal();
    calculateGPA(); 
    renderSavedSemesters(); 
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
    currentEditingName = sem.name; 
    editingIndex = index; 
    maxCoursesAllowed = courses.length > 6 ? 7 : 6;

    updateUI();
    renderSavedSemesters();
}

// === 7. إعادة ضبط الآلة الحاسبة بالكامل (Reset) ===
function resetCalculator() {
    const confirmMsg = currentLang === 'en' 
        ? "Are you sure you want to delete all data and start over?" 
        : "هل أنت متأكد من مسح جميع البيانات والبدء من جديد؟";
        
    if (!confirm(confirmMsg)) {
        return;
    }

    // تصفير المصفوفات والمتغيرات
    courses = [];
    savedSemesters = [];
    currentEditingName = null;
    editingIndex = null;
    maxCoursesAllowed = 6;

    // مسح البيانات المحفوظة في المتصفح
    saveToLocal();

    // تحديث الواجهة
    updateUI();
    renderSavedSemesters();

    // تصفير حقول الإدخال لتكون جاهزة لترم جديد
    document.getElementById('subject').value = '';
    document.getElementById('grade').selectedIndex = 0;
}

// تشغيل عند التحميل
populateDatalist();
renderSavedSemesters();
updateUI();