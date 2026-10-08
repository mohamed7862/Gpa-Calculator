// === 1. البيانات الأساسية والمتغيرات ===
let savedSemesters = JSON.parse(localStorage.getItem('savedSemesters')) || []; 
let courses = []; 
let currentEditingName = null; 
let editingIndex = null; 
let currentLang = 'en';
let myChart = null;

let currentDepartment = localStorage.getItem('selectedDept') || "CS";

// === 2. سلالم التقديرات المعتمدة لكل قسم ===
const departmentGradeScales = {
    CS: {
        'A+': 4.0, 'A': 3.7, 'A-': 3.4,
        'B+': 3.2, 'B': 3.0, 'B-': 2.8,
        'C+': 2.6, 'C': 2.4, 'C-': 2.2,
        'D+': 2.0, 'D': 1.5, 'D-': 1.0,
        'F': 0.0
    },
    AI: {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0,
        'F': 0.0
    },
    CYBER: {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0,
        'F': 0.0
    }
};

let gradePoints = departmentGradeScales[currentDepartment] || departmentGradeScales.CS;

// تنبيهات SweetAlert2
function showCustomAlert(title, text, icon = 'error') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#0984e3',
            customClass: { popup: 'swal2-custom-popup' }
        });
    } else {
        alert(`${title}\n${text}`);
    }
}

// === 3. لوائح الأقسام الرسمية المعتمدة مرتبة أكاديمياً (CS, AI, CYBER) ===
const departmentSyllabus = {
    CS: [
        // Level 1
        { en: "English Language (1)", ar: "اللغة الإنجليزية (1)", hint: "H 101", credits: 2, prereq: null },
        { en: "Creative Thinking & Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "H 102", credits: 2, prereq: null },
        { en: "Calculus", ar: "تفاضل وتكامل", hint: "BS 101", credits: 3, prereq: null },
        { en: "Intro to Computer Science", ar: "مقدمة في علوم الحاسب", hint: "CS 101", credits: 3, prereq: null },
        { en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "CS 103", credits: 3, prereq: null },
        { en: "Electronics", ar: "إلكترونيات", hint: "BS 131", credits: 3, prereq: null },
        { en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "H 103", credits: 2, prereq: "H 101" },
        { en: "Physics", ar: "فيزياء", hint: "BS 121", credits: 3, prereq: null },
        { en: "Computer Programming", ar: "برمجة الحاسب", hint: "CS 102", credits: 3, prereq: "CS 101" },
        { en: "Linear Algebra", ar: "الجبر الخطي", hint: "BS 102", credits: 3, prereq: "BS 101" },
        
        // Level 2
        { en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "BS 103", credits: 3, prereq: "BS 101" },
        { en: "Logic Design", ar: "التصميم المنطقي", hint: "CS 121", credits: 3, prereq: "BS 131" },
        { en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "CS 203", credits: 3, prereq: "CS 102" },
        { en: "Data Structure", ar: "هياكل البيانات", hint: "CS 201", credits: 3, prereq: "CS 102" },
        { en: "Computer Organization & Assembly", ar: "تنظيم الحاسب ولغة التجميع", hint: "CS 220", credits: 3, prereq: "CS 121" },
        { en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "CS 210", credits: 3, prereq: "CS 103" },
        { en: "Probability & Statistics", ar: "احتمالات وإحصاء", hint: "BS 201", credits: 3, prereq: "BS 101" },
        { en: "Database Systems", ar: "أنظمة قواعد البيانات", hint: "CS 211", credits: 3, prereq: "CS 210" },

        // Level 3 & 4
        { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3, prereq: "CS 102" },
        { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3, prereq: "CS 220" },
        { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3, prereq: "CS 220" },
        { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3, prereq: "CS 201" },
        { en: "Algorithms Analysis & Design", ar: "تحليل وتصميم الخوارزميات", hint: "CS 312", credits: 3, prereq: "CS 201" },
        { en: "Software Engineering", ar: "هندسة البرمجيات", hint: "CS 313", credits: 3, prereq: "CS 210" },
        { en: "Computer Graphics", ar: "رسوم الحاسب", hint: "CS 411", credits: 3, prereq: "CS 201" },
        { en: "Graduation Project (1)", ar: "مشروع التخرج (1)", hint: "CS 491", credits: 3, prereq: "CS 313" },
        { en: "Graduation Project (2)", ar: "مشروع التخرج (2)", hint: "CS 492", credits: 3, prereq: "CS 491" }
    ],
    AI: [
        // Level 1
        { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
        { en: "Mathematics for AI", ar: "رياضيات الذكاء الاصطناعي", hint: "BS 105", credits: 3, prereq: null },
        { en: "Python Programming", ar: "برمجة بايثون", hint: "AI 101", credits: 3, prereq: null },
        { en: "Ethics of AI & Law", ar: "أخلاقيات وقوانين الذكاء الاصطناعي", hint: "H 104", credits: 2, prereq: null },
        { en: "Linear Algebra & Vector Calculus", ar: "الجبر الخطي وحساب المتجهات", hint: "BS 106", credits: 3, prereq: "BS 105" },
        { en: "Object Oriented Programming (Python)", ar: "برمجة كائنية التوجه - بايثون", hint: "AI 201", credits: 3, prereq: "AI 101" },
        
        // Level 2
        { en: "Data Structures & Algorithms for AI", ar: "هياكل البيانات والخوارزميات للذكاء الاصطناعي", hint: "AI 211", credits: 3, prereq: "AI 201" },
        { en: "Probability & Statistics for AI", ar: "الاحتمالات والإحصاء للذكاء الاصطناعي", hint: "BS 205", credits: 3, prereq: "BS 105" },
        { en: "Database Systems for AI", ar: "أنظمة قواعد البيانات للذكاء الاصطناعي", hint: "AI 212", credits: 3, prereq: "AI 201" },
        { en: "Data Preprocessing & Visualization", ar: "معالجة البيانات وتصورها", hint: "AI 220", credits: 3, prereq: "AI 101" },

        // Level 3 & 4
        { en: "Introduction to Logic", ar: "مقدمة في المنطق", hint: "AI 310", credits: 3, prereq: null },
        { en: "Theoretical Foundations of Machine Learning", ar: "الأسس النظرية لتعلم الآلة", hint: "AI 311", credits: 3, prereq: "BS 105" },
        { en: "Fundamentals of Artificial Intelligence", ar: "أساسيات الذكاء الاصطناعي", hint: "AI 312", credits: 3, prereq: "AI 201" },
        { en: "Machine Learning", ar: "تعلم الآلة", hint: "AI 320", credits: 3, prereq: "AI 311" },
        { en: "Computer Vision", ar: "الرؤية بالحاسوب", hint: "AI 321", credits: 3, prereq: "AI 312" },
        { en: "Reasoning and Knowledge Representation", ar: "الاستنتاج وتمثيل المعرفة", hint: "AI 322", credits: 3, prereq: "AI 310" },
        { en: "Autonomous Multiagent Systems", ar: "الأنظمة متعددة الوكلاء المستقلة", hint: "AI 323", credits: 3, prereq: "AI 312" },
        { en: "Artificial Intelligence for Cybersecurity", ar: "الذكاء الاصطناعي للأمن السيبراني", hint: "AI 324", credits: 3, prereq: "AI 312" },
        { en: "Deep Learning", ar: "التعلم العميق", hint: "AI 410", credits: 3, prereq: "AI 320" },
        { en: "Natural Language Processing", ar: "معالجة اللغات الطبيعية", hint: "AI 411", credits: 3, prereq: "AI 320" },
        { en: "Reinforcement Learning", ar: "التعلم المعزز", hint: "AI 412", credits: 3, prereq: "AI 320" },
        { en: "AI Graduation Project (1)", ar: "مشروع تخرج الذكاء الاصطناعي (1)", hint: "AI 491", credits: 3, prereq: "AI 320" },
        { en: "AI Graduation Project (2)", ar: "مشروع تخرج الذكاء الاصطناعي (2)", hint: "AI 492", credits: 3, prereq: "AI 491" }
    ],
    CYBER: [
        // Level 1
        { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
        { en: "Discrete Mathematics for Cybersecurity", ar: "رياضيات متقطعة للأمن السيبراني", hint: "BS 107", credits: 3, prereq: null },
        { en: "Intro to Cybersecurity & Programming", ar: "مقدمة في الأمن السيبراني والبرمجة", hint: "CYS 101", credits: 3, prereq: null },
        { en: "Number Theory", ar: "نظرية الأعداد", hint: "BS 201", credits: 3, prereq: null },
        { en: "Computer Networks Fundamentals", ar: "أساسيات شبكات الحاسب", hint: "IT 221", credits: 3, prereq: null },

        // Level 2
        { en: "Information Security Principles", ar: "مبادئ أمن المعلومات", hint: "CYS 210", credits: 3, prereq: null },
        { en: "Operating Systems Security", ar: "أمن أنظمة التشغيل", hint: "CYS 220", credits: 3, prereq: "IT 221" },
        { en: "Secure Software Development", ar: "تطوير البرمجيات الآمنة", hint: "CYS 230", credits: 3, prereq: "CYS 101" },
        { en: "Database Security", ar: "أمن قواعد البيانات", hint: "CYS 240", credits: 3, prereq: "CYS 210" },

        // Level 3 & 4
        { en: "Algorithms Analysis and Design", ar: "تحليل وتصميم الخوارزميات", hint: "CS 312", credits: 3, prereq: null },
        { en: "Network and Web Programming", ar: "برمجة الشبكات والويب", hint: "CS 313", credits: 3, prereq: "IT 221" },
        { en: "Fundamental of Cyber Security", ar: "أساسيات الأمن السيبراني", hint: "CYS 312", credits: 3, prereq: "CYS 210" },
        { en: "Cryptography", ar: "علم التشفير", hint: "CYS 311", credits: 3, prereq: "BS 201" },
        { en: "Wireless and Mobile Networks", ar: "الشبكات اللاسلكية والمتنقلة", hint: "CYS 321", credits: 3, prereq: "IT 221" },
        { en: "Computer Security and Privacy", ar: "أمن الحاسوب والخصوصية", hint: "IT 310", credits: 3, prereq: "CYS 312" },
        { en: "Cyber Security for Internet of Things", ar: "الأمن السيبراني لإنترنت الأشياء", hint: "CYS 387", credits: 3, prereq: "CYS 312" },
        { en: "Cloud Computing & Network Virtualization", ar: "الحوسبة السحابية والمحاكاة الافتراضية للشبكات", hint: "CYS 410", credits: 3, prereq: "IT 221" },
        { en: "Penetration Testing & Ethical Hacking", ar: "اختبار الاختراق والاختراق الأخلاقي", hint: "CYS 411", credits: 3, prereq: "CYS 312" },
        { en: "Digital Forensics & Incident Response", ar: "التحقيق الجنائي الرقمي والاستجابة للحوادث", hint: "CYS 420", credits: 3, prereq: "CYS 312" },
        { en: "Cybersecurity Graduation Project (1)", ar: "مشروع تخرج الأمن السيبراني (1)", hint: "CYS 491", credits: 3, prereq: "CYS 411" },
        { en: "Cybersecurity Graduation Project (2)", ar: "مشروع تخرج الأمن السيبراني (2)", hint: "CYS 492", credits: 3, prereq: "CYS 491" }
    ]
};

let predefinedCourses = departmentSyllabus[currentDepartment];

const i18n = {
    en: {
        title: "GPA Calculator & Academic Advisor",
        subjectPlaceholder: "Subject Name",
        addBtn: "Add course ➕",
        saveBtn: "Save & Add New Semester",
        savedTitle: "Saved Semesters",
        finalGpa: "Final GPA",
        langBtn: "العربية",
        header: ["SUBJECT", "GRADE", "HOURS", "ACTION"],
        termGpa: "Term:",
        cgpa: "CGPA:",
        improvementBtn: "🚀 Academic Recovery & Target Simulator",
        printBtn: "🖨️ Print",
        resetBtn: "Reset",
        probationWarning: "Academic Probation Alert: CGPA is below 2.00!",
        deptOptions: { CS: "Computer Science", AI: "Artificial Intelligence", CYBER: "Cyber Security" }
    },
    ar: {
        title: "حاسبة المعدل والتوجيه الأكاديمي",
        subjectPlaceholder: "اسم المادة",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "الترمات المحفوظة",
        finalGpa: "المعدل التراكمي النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"],
        termGpa: "فصلي:",
        cgpa: "تراكمي:",
        improvementBtn: "🚀 خطة التحسين والمحاكاة الذكية",
        printBtn: "🖨️ طباعة",
        resetBtn: "إعادة ضبط",
        probationWarning: "إنذار أكاديمي: المعدل التراكمي أقل من 2.00!",
        deptOptions: { CS: "علوم حاسب", AI: "ذكاء اصطناعي", CYBER: "أمن سيبراني" }
    }
};

// === 4. المنطق الأكاديمي وتنظيم الاقتراحات للـ Datalist ===

function getMaxAllowedHours() {
    let currentCGPA = window.currentCalculatedData ? window.currentCalculatedData.finalCGPA : 4.0;
    if (savedSemesters.length === 0 && courses.length === 0) return 18;
    
    if (currentCGPA < 2.00) return 12; 
    if (currentCGPA >= 3.00) return 21; 
    return 18;                          
}

function updateGradeDropdown() {
    const gradeSelect = document.getElementById('grade');
    if (!gradeSelect) return;

    const currentSelectedValue = gradeSelect.value;
    gradeSelect.innerHTML = '';
    
    const currentScale = departmentGradeScales[currentDepartment] || departmentGradeScales.CS;

    Object.keys(currentScale).forEach(gradeKey => {
        const option = document.createElement('option');
        option.value = gradeKey;
        option.text = gradeKey;
        gradeSelect.appendChild(option);
    });

    if (currentScale[currentSelectedValue] !== undefined) {
        gradeSelect.value = currentSelectedValue;
    }
}

window.changeDepartment = function(deptKey) {
    if (!departmentSyllabus[deptKey]) return;
    currentDepartment = deptKey;
    localStorage.setItem('selectedDept', deptKey);
    
    gradePoints = departmentGradeScales[deptKey] || departmentGradeScales.CS;
    predefinedCourses = departmentSyllabus[deptKey];
    
    updateGradeDropdown();
    populateDatalist();
    calculateGPA();
};

// إرجاع الـ datalist وتنسيق ترتيب المواد تسلسلياً حسب المستوى والأكواد
function populateDatalist() {
    const datalist = document.getElementById('subjects-list');
    if (!datalist) return;

    datalist.innerHTML = '';

    predefinedCourses.forEach(course => {
        const option = document.createElement('option');
        const courseName = currentLang === 'en' ? course.en : course.ar;

        let level = 1;
        const match = course.hint.match(/\d+/);
        if (match) {
            let num = parseInt(match[0]);
            if (num >= 100 && num < 200) level = 1;
            else if (num >= 200 && num < 300) level = 2;
            else if (num >= 300 && num < 400) level = 3;
            else if (num >= 400) level = 4;
        }

        option.value = courseName;
        option.label = `[Level ${level} - ${course.hint}]`;
        datalist.appendChild(option);
    });
}

function saveToLocal() {
    try {
        localStorage.setItem('savedSemesters', JSON.stringify(savedSemesters));
    } catch (e) {
        console.error("Storage save failed:", e);
    }
}

window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const lang = i18n[currentLang];
    
    document.getElementById('main-title').innerText = lang.title;
    document.getElementById('subject').placeholder = lang.subjectPlaceholder;
    document.getElementById('add-course-btn').innerText = lang.addBtn;
    document.getElementById('save-sem-btn').innerText = lang.saveBtn;
    document.getElementById('reset-btn').innerText = lang.resetBtn;
    document.getElementById('saved-title').innerText = lang.savedTitle;
    document.getElementById('final-gpa-text').innerText = lang.finalGpa;
    document.getElementById('lang-btn').innerText = lang.langBtn;
    document.getElementById('improvement-btn').innerText = lang.improvementBtn;
    document.getElementById('print-btn').innerText = lang.printBtn;

    const deptSelect = document.getElementById('dept-select');
    if (deptSelect) {
        deptSelect.options[0].text = lang.deptOptions.CS;
        deptSelect.options[1].text = lang.deptOptions.AI;
        deptSelect.options[2].text = lang.deptOptions.CYBER;
    }

    const headers = document.querySelectorAll('#list-header div');
    if (headers.length >= 4) {
        lang.header.forEach((text, i) => { if (headers[i]) headers[i].innerText = text; });
    }

    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    populateDatalist(); 
    renderSavedSemesters();
    calculateGPA();
};

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-course-btn');
    const subInput = document.getElementById('subject');
    const gradeSel = document.getElementById('grade');

    if (addBtn) {
        addBtn.onclick = function() {
            const maxAllowedHours = getMaxAllowedHours();
            let currentSemesterHours = courses.reduce((sum, c) => sum + c.credits, 0);

            const subject = subInput.value.trim();
            if (!subject) {
                showCustomAlert(
                    currentLang === 'en' ? 'Missing Input' : 'حقل فارغ',
                    currentLang === 'en' ? 'Please enter or select a subject name!' : 'يرجى كتابة أو اختيار اسم المادة أولاً!',
                    'info'
                );
                return;
            }

            const predefinedCourse = predefinedCourses.find(c => 
                c.en.trim().toLowerCase() === subject.toLowerCase() || 
                c.ar.trim() === subject ||
                c.hint.toLowerCase() === subject.toLowerCase()
            );

            let courseCredits = predefinedCourse ? predefinedCourse.credits : 3;

            if (currentSemesterHours + courseCredits > maxAllowedHours) {
                showCustomAlert(
                    currentLang === 'en' ? 'Credit Hours Limit Exceeded ⛔' : 'تجاوز حد الساعات المسموح بها ⛔',
                    currentLang === 'en' 
                        ? `Maximum allowed credit load is ${maxAllowedHours} hours for your academic status.` 
                        : `الحد الأقصى المسموح به لتسجيل الساعات هو ${maxAllowedHours} ساعة معتمدة بناءً على حالتك الأكاديمية.`,
                    'warning'
                );
                return;
            }

            if (predefinedCourse && predefinedCourse.prereq) {
                let passedCourseHints = new Set();
                const checkPassed = (c) => {
                    let pts = gradePoints[c.grade] || 0;
                    if (pts > 0) {
                        let inputSub = c.subject.trim().toLowerCase();
                        let match = predefinedCourses.find(p => p.en.trim().toLowerCase() === inputSub || p.ar.trim() === c.subject.trim() || p.hint.toLowerCase() === inputSub);
                        if (match && match.hint) passedCourseHints.add(match.hint.toUpperCase());
                    }
                };

                savedSemesters.forEach(sem => {
                    if (sem.isChecked) sem.courseDetails.forEach(checkPassed);
                });

                const requiredHint = predefinedCourse.prereq.toUpperCase();
                if (!passedCourseHints.has(requiredHint)) {
                    let reqCourse = predefinedCourses.find(p => p.hint.toUpperCase() === requiredHint);
                    let reqName = reqCourse ? (currentLang === 'en' ? reqCourse.en : reqCourse.ar) : requiredHint;

                    showCustomAlert(
                        currentLang === 'en' ? 'Prerequisite Required ⛔' : 'متطلب مسبق غير مجتاز ⛔',
                        currentLang === 'en' 
                            ? `You cannot register [${subject}] without passing its prerequisite: (${reqName} - ${requiredHint})!` 
                            : `لا يمكنك تسجيل مادة [${subject}] قبل اجتياز المتطلب السابق لها أولاً: (${reqName} - ${requiredHint})!`,
                        'error'
                    );
                    return;
                }
            }

            courses.push({ subject, grade: gradeSel.value, credits: courseCredits });
            updateUI();
            subInput.value = '';
            subInput.focus();
        };
    }

    const deptSelect = document.getElementById('dept-select');
    if (deptSelect) {
        deptSelect.value = currentDepartment;
    }

    updateGradeDropdown();
    populateDatalist();
    renderSavedSemesters();
    calculateGPA();
});

window.deleteCourse = function(index) {
    courses.splice(index, 1);
    updateUI();
};

function updateUI() {
    renderCourses();
    calculateGPA();
    populateDatalist();
}

function renderCourses() {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;
    coursesList.innerHTML = ''; 
    courses.forEach((course, index) => {
        const row = document.createElement('div');
        row.className = 'course-row-item'; 
        row.innerHTML = `
            <div style="flex:1.2; text-align: ${currentLang === 'ar' ? 'right' : 'left'}; font-weight:700;">✨ ${course.subject}</div>
            <div style="flex:1;"><span class="grade-badge">${course.grade}</span></div>
            <div style="flex:1;">${course.credits} ${currentLang === 'en' ? 'hrs' : 'ساعة'}</div>
            <div style="flex:0.5;"><button onclick="deleteCourse(${index})" class="delete-btn">✕</button></div>
        `;
        coursesList.appendChild(row);
    });
}

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

    let finalCGPA = totalHours > 0 ? (totalPoints / totalHours) : 0;
    const gpaDisplay = document.getElementById('gpa-display');
    if (gpaDisplay) gpaDisplay.innerText = finalCGPA.toFixed(2);

    window.currentCalculatedData = {
        uniqueCoursesList: Object.values(uniqueCourses),
        finalCGPA: finalCGPA,
        totalPoints: totalPoints,
        totalHours: totalHours
    };

    updateGPAChart();
}

function updateGPAChart() {
    const ctx = document.getElementById('gpaChart');
    const chartBox = document.getElementById('chart-container');
    if (!ctx || typeof Chart === 'undefined') return;

    let labels = [];
    let dataPoints = [];
    let runningUniqueCourses = {};

    savedSemesters.forEach((sem) => {
        if (sem.isChecked) {
            sem.courseDetails.forEach(course => {
                let normalizedName = course.subject.trim().toLowerCase();
                let points = gradePoints[course.grade] || 0;
                runningUniqueCourses[normalizedName] = { ...course, points };
            });

            let runningPoints = 0, runningHours = 0;
            Object.values(runningUniqueCourses).forEach(c => {
                runningPoints += c.points * c.credits;
                runningHours += c.credits;
            });
            let semCGPA = runningHours > 0 ? (runningPoints / runningHours).toFixed(2) : 0;

            labels.push(sem.name);
            dataPoints.push(semCGPA);
        }
    });

    if (labels.length === 0) {
        if (chartBox) chartBox.style.display = 'none';
        return;
    }

    if (chartBox) chartBox.style.display = 'block';

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: currentLang === 'ar' ? 'المعدل التراكمي (CGPA)' : 'CGPA Progress',
                data: dataPoints,
                borderColor: '#0984e3',
                backgroundColor: 'rgba(9, 132, 227, 0.15)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: { y: { min: 0, max: 4.0 } }
        }
    });
}

// === 5. محرك الإرشاد الأكاديمي وحاسبة الهدف ===
window.handleImprovementClick = function() {
    if (!window.currentCalculatedData || window.currentCalculatedData.totalHours === 0) {
        showCustomAlert(
            currentLang === 'en' ? 'No Data Available' : 'لا توجد بيانات',
            currentLang === 'en' ? 'Please add courses or semesters first!' : 'يرجى إضافة مواد أو ترمات أولاً لحساب خطة التحسين!',
            'info'
        );
        return;
    }

    const { uniqueCoursesList, finalCGPA, totalPoints, totalHours } = window.currentCalculatedData;
    let container = document.getElementById('improvement-engine-box');
    if (!container) return;

    const isAr = currentLang === 'ar';

    let priorityCourses = uniqueCoursesList.filter(c => c.points < 2.4).sort((a, b) => {
        if (a.credits !== b.credits) return b.credits - a.credits; 
        return a.points - b.points; 
    });

    let priorityHTML = priorityCourses.map(c => `
        <tr style="border-bottom: 1px solid #dfe6e9;">
            <td style="padding:8px; text-align:${isAr ? 'right' : 'left'}; font-weight:600;">${c.subject} (${c.credits}h)</td>
            <td style="padding:8px; text-align:center; color:#d63031; font-weight:bold;">${c.grade}</td>
            <td style="padding:8px; text-align:center; color:#00b894; font-weight:bold;">High Priority 🔥</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div style="background: #ffffff; border: 2px solid ${finalCGPA < 2.0 ? '#d63031' : '#0984e3'}; border-radius: 14px; padding: 20px; color: #2d3436; margin-top: 20px; text-align: ${isAr ? 'right' : 'left'}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <h3 style="color: ${finalCGPA < 2.0 ? '#d63031' : '#0984e3'}; margin-top: 0; font-size:16px;">
                ${finalCGPA < 2.0 ? '🚨 ' + i18n[currentLang].probationWarning : '🎯 ' + (isAr ? 'حاسبة المعدل التراكمي المستهدف' : 'Target CGPA Calculator')}
            </h3>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <label style="font-weight: bold; font-size: 13px;">${isAr ? 'ادخل المعدل التراكمي المستهدف (Target CGPA):' : 'Enter Target CGPA:'}</label>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <input type="number" id="target-cgpa-input" step="0.01" min="2.00" max="4.00" value="2.01" style="padding: 8px; border-radius: 8px; border: 1px solid #dfe6e9; width: 100px;">
                    <button onclick="calculateRequiredTermGPA(${totalPoints}, ${totalHours})" style="padding: 8px 15px; background: #00b894; color: #fff; border: none; font-weight: bold; border-radius: 8px; cursor: pointer;">${isAr ? 'احسب المطلوب' : 'Calculate Required'}</button>
                </div>
                <div id="target-result-box" style="margin-top: 10px; font-weight: bold; font-size: 13px; color: #2d3436;"></div>
            </div>

            ${priorityCourses.length > 0 ? `
                <h4 style="margin: 15px 0 10px 0; color: #2d3436; font-size:14px;">⚡ ${isAr ? 'ترتيب أولويات تحسين المواد لرفع المعدل بأسرع طريقة:' : 'Priority Recovery Courses:'}</h4>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                    <thead><tr style="color:#636e72;"><th style="text-align:${isAr ? 'right' : 'left'};">${isAr ? 'المادة' : 'Subject'}</th><th>${isAr ? 'الحالي' : 'Current'}</th><th>${isAr ? 'الأولوية' : 'Priority'}</th></tr></thead>
                    <tbody>${priorityHTML}</tbody>
                </table>
            ` : ''}
        </div>
    `;
};

window.calculateRequiredTermGPA = function(totalPoints, totalHours) {
    const targetCGPA = parseFloat(document.getElementById('target-cgpa-input').value);
    const isAr = currentLang === 'ar';
    const currentTermHours = courses.reduce((sum, c) => sum + c.credits, 0);

    if (currentTermHours === 0) {
        document.getElementById('target-result-box').innerHTML = `<span style="color:#d63031;">⚠️ ${isAr ? 'يرجى إضافة مواد الترم الحالي أولاً لمعرفة الساعات المتاحة!' : 'Please add current term courses first to get credit hours!'}</span>`;
        return;
    }

    const newTotalHours = totalHours + currentTermHours;
    const requiredTotalPoints = targetCGPA * newTotalHours;
    const requiredTermPoints = requiredTotalPoints - totalPoints;
    const requiredTermGPA = requiredTermPoints / currentTermHours;

    const resultBox = document.getElementById('target-result-box');
    if (requiredTermGPA > 4.0) {
        resultBox.innerHTML = `<span style="color:#d63031;">❌ ${isAr ? `مستحيل الوصول لـ (${targetCGPA}) في هذا الترم وحده! تحتاج لـ Term GPA قدره (${requiredTermGPA.toFixed(2)}) وهو أعلى من 4.00.` : `Impossible in a single semester! Required Term GPA is (${requiredTermGPA.toFixed(2)}).`}</span>`;
    } else if (requiredTermGPA <= 0) {
        resultBox.innerHTML = `<span style="color:#00b894;">🎉 ${isAr ? `أنت بالفعل تتجاوز المعدل المستهدف!` : `You already exceed target CGPA!`}</span>`;
    } else {
        resultBox.innerHTML = `<span style="color:#00b894;">✨ ${isAr ? `لتصل إلى تراكمي (${targetCGPA})، محتاج تجيب GPA لا يقل عن:` : `To reach (${targetCGPA}), you need Term GPA at least:`} <strong style="font-size: 16px;">${requiredTermGPA.toFixed(2)}</strong> ${isAr ? 'في هذا الترم.' : 'in current term.'}</span>`;
    }
};

function getNextSemesterNumber() {
    if (savedSemesters.length === 0) return 1;
    const numbers = savedSemesters.map(s => {
        const match = s.name.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    });
    return Math.max(...numbers, 0) + 1;
}

window.saveAndClearSemester = function() {
    if (courses.length === 0) {
        showCustomAlert(
            currentLang === 'en' ? 'Empty Semester' : 'ترم فارغ',
            currentLang === 'en' ? 'No courses to save!' : 'لا توجد مواد أضيفت لحفظ الترم!',
            'info'
        );
        return;
    }

    let semPoints = 0, semHours = 0;
    courses.forEach(c => {
        semPoints += (gradePoints[c.grade] || 0) * c.credits;
        semHours += c.credits;
    });

    const semGPA = (semPoints / semHours).toFixed(2);

    const semesterData = {
        id: editingIndex !== null ? savedSemesters[editingIndex].id : Date.now(),
        name: currentEditingName || (currentLang === 'en' ? `Semester ${getNextSemesterNumber()}` : `الترم ${getNextSemesterNumber()}`),
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
        isFromDatabase: false, 
        isLocked: false,
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

    showCustomAlert(
        currentLang === 'en' ? 'Saved Successfully' : 'تم الحفظ بنجاح',
        currentLang === 'en' ? 'Semester saved to academic history!' : 'تم حفظ الترم وإضافته للسجل الأكاديمي!',
        'success'
    );
};

function renderSavedSemesters() {
    const semestersList = document.getElementById('semesters-list');
    const savedSemestersBox = document.getElementById('saved-semesters-box');
    if (!semestersList || !savedSemestersBox) return;
    
    semestersList.innerHTML = '';
    savedSemestersBox.style.display = savedSemesters.length > 0 ? 'block' : 'none';

    let runningUniqueCourses = {};

    savedSemesters.forEach((sem, index) => {
        let semPts = 0, semHrs = 0;
        sem.courseDetails.forEach(c => {
            semPts += (gradePoints[c.grade] || 0) * c.credits;
            semHrs += c.credits;
        });
        sem.gpa = semHrs > 0 ? (semPts / semHrs).toFixed(2) : "0.00";

        let semCGPA = "0.00";
        if (sem.isChecked) {
            sem.courseDetails.forEach(course => {
                let normalizedName = course.subject.trim().toLowerCase();
                let points = gradePoints[course.grade] || 0;
                runningUniqueCourses[normalizedName] = { ...course, points };
            });

            let runningPoints = 0, runningHours = 0;
            Object.values(runningUniqueCourses).forEach(c => {
                runningPoints += c.points * c.credits;
                runningHours += c.credits;
            });
            semCGPA = runningHours > 0 ? (runningPoints / runningHours).toFixed(2) : "0.00";
        } else {
            semCGPA = "-";
        }

        const actionButtonsHTML = (sem.isFromDatabase || sem.isLocked)
            ? `<span style="font-size: 11px; color: #0984e3; background: #e3f2fd; padding: 4px 10px; border-radius: 6px; font-weight: bold;">🔒 سجل داتابيز معتمد (Read Only)</span>`
            : `
                <button onclick="editSemester(${index})" class="btn-edit-sem">${currentLang === 'en' ? 'Edit' : 'تعديل'}</button>
                <button onclick="deleteSemester(${index})" class="btn-delete-sem">${currentLang === 'en' ? 'Delete' : 'حذف'}</button>
              `;

        const div = document.createElement('div');
        div.className = 'semester-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <input type="checkbox" id="sem-${sem.id}" ${sem.isChecked ? 'checked' : ''} onchange="toggleSemester(${index})">
                    <label for="sem-${sem.id}" style="font-weight: bold; font-size:16px;">${sem.name}</label>
                </div>
                <div>${actionButtonsHTML}</div>
            </div>
            <div style="display:flex; gap:12px; font-size:14px;">
                <span class="semester-gpa">${i18n[currentLang].termGpa} ${sem.gpa}</span>
                <span class="semester-cgpa">${i18n[currentLang].cgpa} ${semCGPA}</span>
            </div>
        `;
        semestersList.appendChild(div);
    });
}

window.toggleSemester = function(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    saveToLocal();
    calculateGPA(); 
    renderSavedSemesters(); 
    populateDatalist();
};

window.deleteSemester = function(index) {
    if (savedSemesters[index].isFromDatabase) {
        showCustomAlert(
            currentLang === 'en' ? 'Protected Record 🔒' : 'سجل محمي 🔒',
            currentLang === 'en' ? 'Official database semesters cannot be deleted.' : 'لا يمكن حذف الترمات الرسمية المستوردة من قاعدة البيانات.',
            'error'
        );
        return;
    }

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: currentLang === 'en' ? 'Delete Semester?' : 'حذف الترم؟',
            text: currentLang === 'en' ? 'Are you sure you want to remove this simulation semester?' : 'هل أنت متأكد من حذف هذا الترم التجريبي؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            confirmButtonText: currentLang === 'en' ? 'Yes, delete' : 'نعم، احذف',
            cancelButtonText: currentLang === 'en' ? 'Cancel' : 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                savedSemesters.splice(index, 1);
                saveToLocal();
                renderSavedSemesters();
                calculateGPA();
                populateDatalist();
            }
        });
    }
};

window.editSemester = function(index) {
    if (savedSemesters[index].isFromDatabase) {
        showCustomAlert(
            currentLang === 'en' ? 'Protected Record 🔒' : 'سجل محمي 🔒',
            currentLang === 'en' ? 'Official database semesters cannot be edited.' : 'لا يمكن تعديل الترمات الرسمية المستوردة من قاعدة البيانات.',
            'error'
        );
        return;
    }

    const sem = savedSemesters[index];
    courses = [...sem.courseDetails];
    currentEditingName = sem.name; 
    editingIndex = index; 

    updateUI();
    renderSavedSemesters();
};

window.resetCalculator = function() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: currentLang === 'en' ? 'Reset Simulator?' : 'مسح المحاكاة؟',
            text: currentLang === 'en' ? 'This will clear your local simulations.' : 'سيتم حذف الترمات والمواد التجريبية المسجلة محلياً!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            confirmButtonText: currentLang === 'en' ? 'Reset All' : 'مسح الكل',
            cancelButtonText: currentLang === 'en' ? 'Cancel' : 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                courses = [];
                savedSemesters = savedSemesters.filter(s => s.isFromDatabase);
                currentEditingName = null;
                editingIndex = null;
                saveToLocal();
                updateUI();
                renderSavedSemesters();
            }
        });
    }
};
