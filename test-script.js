// === 1. البيانات الأساسية والمتغيرات ===
let savedSemesters = JSON.parse(localStorage.getItem('savedSemesters')) || []; 
let courses = []; 
let currentEditingName = null; 
let editingIndex = null; 
let maxCoursesAllowed = 6; 
let currentLang = 'en';
let myChart = null;

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// تنبيهات SweetAlert2 الأنيقة
function showCustomAlert(title, text, icon = 'error') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#0984e3',
            customClass: {
                popup: 'swal2-custom-popup'
            }
        });
    } else {
        alert(`${title}\n${text}`);
    }
}

// === لوائح الأقسام الرسمية (الشروق 2025/2026) كاملة مع الأكواد والمتطلبات ===
const departmentSyllabus = {
    CS: [
        // Level 1
        { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
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

        // Level 3 & 4
        { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3, prereq: "CS 102" },
        { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3, prereq: "CS 220" },
        { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3, prereq: "CS 220" },
        { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3, prereq: "CS 201" },
        { en: "Algorithms Analysis & Design", ar: "تحليل وتصميم الخوارزميات", hint: "CS 312", credits: 3, prereq: "CS 201" }
    ],
    AI: [
        // Level 1 & 2
        { en: "Mathematics for AI", ar: "رياضيات الذكاء الاصطناعي", hint: "BS 105", credits: 3, prereq: null },
        { en: "Python Programming", ar: "برمجة بايثون", hint: "AI 101", credits: 3, prereq: null },
        { en: "Object Oriented Programming (Python)", ar: "برمجة كائنية التوجه - بايثون", hint: "AI 201", credits: 3, prereq: "AI 101" },
        { en: "Data Structures & Algorithms for AI", ar: "هياكل البيانات والخوارزميات للذكاء الاصطناعي", hint: "AI 211", credits: 3, prereq: "AI 201" },
        
        // Level 3 & 4
        { en: "Introduction to Logic", ar: "مقدمة في المنطق", hint: "AI 310", credits: 3, prereq: null },
        { en: "Fundamentals of Artificial Intelligence", ar: "أساسيات الذكاء الاصطناعي", hint: "AI 312", credits: 3, prereq: "AI 201" },
        { en: "Theoretical Foundations of Machine Learning", ar: "الأسس النظرية لتعلم الآلة", hint: "AI 311", credits: 3, prereq: "BS 105" },
        { en: "Machine Learning", ar: "تعلم الآلة", hint: "AI 320", credits: 3, prereq: "AI 311" },
        { en: "Computer Vision", ar: "الرؤية بالحاسوب", hint: "AI 321", credits: 3, prereq: "AI 312" },
        { en: "Reasoning and Knowledge Representation", ar: "الاستنتاج وتمثيل المعرفة", hint: "AI 322", credits: 3, prereq: "AI 310" },
        { en: "Autonomous Multiagent Systems", ar: "الأنظمة متعددة الوكلاء المستقلة", hint: "AI 323", credits: 3, prereq: "AI 312" },
        { en: "Artificial Intelligence for Cybersecurity", ar: "الذكاء الاصطناعي للأمن السيبراني", hint: "AI 324", credits: 3, prereq: "AI 312" },
        { en: "Deep Learning", ar: "التعلم العميق", hint: "AI 410", credits: 3, prereq: "AI 320" },
        { en: "Natural Language Processing", ar: "معالجة اللغات الطبيعية", hint: "AI 411", credits: 3, prereq: "AI 320" }
    ],
    CYBER: [
        // Level 1 & 2
        { en: "Computer Networks Fundamentals", ar: "أساسيات شبكات الحاسب", hint: "IT 221", credits: 3, prereq: null },
        { en: "Information Security Principles", ar: "مبادئ أمن المعلومات", hint: "CYS 210", credits: 3, prereq: null },
        { en: "Number Theory", ar: "نظرية الأعداد", hint: "BS 201", credits: 3, prereq: null },
        
        // Level 3 & 4
        { en: "Algorithms Analysis and Design", ar: "تحليل وتصميم الخوارزميات", hint: "CS 312", credits: 3, prereq: null },
        { en: "Network and Web Programming", ar: "برمجة الشبكات والويب", hint: "CS 313", credits: 3, prereq: "IT 221" },
        { en: "Fundamental of Cyber Security", ar: "أساسيات الأمن السيبراني", hint: "CYS 312", credits: 3, prereq: "CYS 210" },
        { en: "Cryptography", ar: "علم التشفير", hint: "CYS 311", credits: 3, prereq: "BS 201" },
        { en: "Wireless and Mobile Networks", ar: "الشبكات اللاسلكية والمتنقلة", hint: "CYS 321", credits: 3, prereq: "IT 221" },
        { en: "Computer Security and Privacy", ar: "أمن الحاسوب والخصوصية", hint: "IT 310", credits: 3, prereq: "CYS 312" },
        { en: "Cyber Security for Internet of Things", ar: "الأمن السيبراني لإنترنت الأشياء", hint: "CYS 387", credits: 3, prereq: "CYS 312" },
        { en: "Cloud Computing & Network Virtualization", ar: "الحوسبة السحابية والمحاكاة الافتراضية للشبكات", hint: "CYS 410", credits: 3, prereq: "IT 221" },
        { en: "Penetration Testing & Ethical Hacking", ar: "اختبار الاختراق والاختراق الأخلاقي", hint: "CYS 411", credits: 3, prereq: "CYS 312" }
    ]
};

let currentDepartment = localStorage.getItem('selectedDept') || "CS";
let predefinedCourses = departmentSyllabus[currentDepartment];

const i18n = {
    en: {
        title: "GPA Calculator",
        subjectPlaceholder: "Subject Name",
        addBtn: "Add course ➕",
        saveBtn: "Save & Add New Semester",
        savedTitle: "Saved Semesters",
        finalGpa: "Final GPA",
        langBtn: "العربية",
        header: ["SUBJECT", "GRADE", "HOURS", "ACTION"],
        termGpa: "Term:",
        cgpa: "CGPA:",
        improvementBtn: "🚀 Academic Recovery & Simulator",
        printBtn: "🖨️ Print",
        resetBtn: "Reset",
        probationWarning: "Academic Probation Alert: CGPA is below 2.00!",
        deptOptions: { CS: "Computer Science", AI: "Artificial Intelligence", CYBER: "Cyber Security" }
    },
    ar: {
        title: "حاسبة المعدل التراكمي",
        subjectPlaceholder: "اسم المادة",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "الترمات المحفوظة",
        finalGpa: "المعدل التراكمي النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"],
        termGpa: "فصلي:",
        cgpa: "تراكمي:",
        improvementBtn: "🚀 خطة التحسين والمحاكاة",
        printBtn: "🖨️ طباعة",
        resetBtn: "إعادة ضبط",
        probationWarning: "إنذار أكاديمي: المعدل التراكمي أقل من 2.00!",
        deptOptions: { CS: "علوم حاسب", AI: "ذكاء اصطناعي", CYBER: "هندسة سيبرانية" }
    }
};

window.changeDepartment = function(deptKey) {
    if (!departmentSyllabus[deptKey]) return;
    currentDepartment = deptKey;
    localStorage.setItem('selectedDept', deptKey);
    predefinedCourses = departmentSyllabus[deptKey];
    populateDatalist();
    calculateGPA();
};

function populateDatalist() {
    const datalist = document.getElementById('subjects-list');
    if (!datalist) return;
    datalist.innerHTML = '';

    predefinedCourses.forEach(course => {
        const option = document.createElement('option');
        const courseName = currentLang === 'en' ? course.en : course.ar;
        option.value = courseName;
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
            if (courses.length >= maxCoursesAllowed) {
                showCustomAlert(
                    currentLang === 'en' ? 'Course Limit Reached' : 'تجاوز عدد المواد',
                    currentLang === 'en' ? `Max limit is ${maxCoursesAllowed} courses per semester.` : `الحد الأقصى المسموح به هو ${maxCoursesAllowed} مواد في الترم.`,
                    'warning'
                );
                return;
            }

            const subject = subInput.value.trim();
            if (!subject) {
                showCustomAlert(
                    currentLang === 'en' ? 'Missing Input' : 'حقل فارغ',
                    currentLang === 'en' ? 'Please enter or select a subject name!' : 'يرجى اختيار أو كتابة اسم المادة أولاً!',
                    'info'
                );
                return;
            }

            const predefinedCourse = predefinedCourses.find(c => 
                c.en.trim().toLowerCase() === subject.toLowerCase() || 
                c.ar.trim() === subject ||
                c.hint.toLowerCase() === subject.toLowerCase()
            );

            // فحص المتطلب المسبق للمادة من السجلات المحفوظة
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

            let courseCredits = predefinedCourse ? predefinedCourse.credits : 3;

            courses.push({ subject, grade: gradeSel.value, credits: courseCredits });
            updateUI();
            subInput.value = '';
            subInput.focus();
        };
    }

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

// عرض الصفوف بجودة عالية مع ضبط النص واللون بشكل ممتاز
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
                label: 'التراكمي (CGPA)',
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

    if (finalCGPA < 2.0) {
        let planA_Courses = uniqueCoursesList.filter(c => c.points < 2.0).sort((a,b) => a.points - b.points);
        let planA_HTML = planA_Courses.map(c => `
            <tr style="border-bottom: 1px solid #dfe6e9;">
                <td style="padding:8px; text-align:${isAr ? 'right' : 'left'}; font-weight:600;">${c.subject}</td>
                <td style="padding:8px; text-align:center; color:#d63031; font-weight:bold;">${c.grade}</td>
                <td style="padding:8px; text-align:center; color:#00b894; font-weight:bold;">B (3.0)</td>
            </tr>
        `).join('');

        let planB_Courses = uniqueCoursesList.filter(c => c.points < 2.4).sort((a,b) => a.points - b.points);
        let planB_HTML = planB_Courses.map(c => `
            <tr style="border-bottom: 1px solid #dfe6e9;">
                <td style="padding:8px; text-align:${isAr ? 'right' : 'left'}; font-weight:600;">${c.subject}</td>
                <td style="padding:8px; text-align:center; color:#d63031; font-weight:bold;">${c.grade}</td>
                <td style="padding:8px; text-align:center; color:#0984e3; font-weight:bold;">B+ / A</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div style="background: #ffffff; border: 2px solid #d63031; border-radius: 14px; padding: 20px; color: #2d3436; margin-top: 20px; text-align: ${isAr ? 'right' : 'left'}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <h3 style="color: #d63031; margin-top: 0; font-size:16px;">🚨 ${i18n[currentLang].probationWarning}</h3>
                <p style="font-size:13px; color:#636e72;">${isAr ? 'اختر المسار المناسب لرفع معدلك التراكمي وتجاوز عقبة الـ 2.00 بنجاح:' : 'Select an academic recovery path to cross 2.00 CGPA:'}</p>
                
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                    <div style="flex: 1; min-width: 220px; background: #f8f9fa; padding: 12px; border-radius: 10px; border-top: 4px solid #00b894;">
                        <h4 style="margin: 0 0 10px 0; color: #00b894; font-size:14px;">⚡ ${isAr ? 'المسار 1: التعافي السريع (استهداف B)' : 'Path 1: Fast Recovery (Target B)'}</h4>
                        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                            <thead><tr style="color:#636e72;"><th style="text-align:${isAr ? 'right' : 'left'};">${isAr ? 'المادة' : 'Subject'}</th><th>${isAr ? 'الحالي' : 'Current'}</th><th>${isAr ? 'المستهدف' : 'Target'}</th></tr></thead>
                            <tbody>${planA_HTML}</tbody>
                        </table>
                    </div>

                    <div style="flex: 1; min-width: 220px; background: #f8f9fa; padding: 12px; border-radius: 10px; border-top: 4px solid #0984e3;">
                        <h4 style="margin: 0 0 10px 0; color: #0984e3; font-size:14px;">🛡️ ${isAr ? 'المسار 2: التوازن الممتاز (استهداف B+/A)' : 'Path 2: Balanced Improvement (Target B+/A)'}</h4>
                        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                            <thead><tr style="color:#636e72;"><th style="text-align:${isAr ? 'right' : 'left'};">${isAr ? 'المادة' : 'Subject'}</th><th>${isAr ? 'الحالي' : 'Current'}</th><th>${isAr ? 'المستهدف' : 'Target'}</th></tr></thead>
                            <tbody>${planB_HTML}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } else {
        let improvableCourses = uniqueCoursesList.filter(c => c.points < 3.2);
        if (improvableCourses.length === 0) {
            container.innerHTML = `
                <div style="background: #e8f8f5; border: 1px solid #00b894; padding: 15px; border-radius: 12px; color: #2d3436; margin-top: 20px; text-align: center; font-weight:bold;">
                    🎉 ${isAr ? 'جميع تقديراتك ممتازة ولا توجد مواد بحاجة للتحسين!' : 'All your grades are excellent and no courses need improvement!'}
                </div>
            `;
            return;
        }

        let optionsHTML = improvableCourses.map((c, i) => `
            <option value="${i}">${c.subject} (${isAr ? 'الحالي' : 'Current'}: ${c.grade})</option>
        `).join('');

        container.innerHTML = `
            <div style="background: #ffffff; border: 1px solid #0984e3; padding: 20px; border-radius: 14px; color: #2d3436; margin-top: 20px; text-align: ${isAr ? 'right' : 'left'}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <h4 style="color: #0984e3; margin-top: 0; margin-bottom: 15px; font-size: 16px;">${isAr ? 'مُحاكي تحسين المواد الاختياري 🚀' : 'Optional Course Improvement Simulator 🚀'}</h4>
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <select id="sim-course-select" style="padding: 10px; border-radius: 8px; flex: 1; min-width: 180px; border: 1px solid #dfe6e9;">${optionsHTML}</select>
                    <select id="sim-grade-select" style="padding: 10px; border-radius: 8px; border: 1px solid #dfe6e9;">
                        <option value="A+">A+</option><option value="A">A</option><option value="B+">B+</option><option value="B">B</option>
                    </select>
                    <button onclick="runImprovementSimulation(${totalPoints}, ${totalHours})" style="padding: 10px 18px; background: #0984e3; color: #ffffff; border: none; font-weight: bold; border-radius:8px; cursor:pointer;">${isAr ? 'تجربة التحسين' : 'Simulate'}</button>
                </div>
                <div id="sim-result" style="margin-top: 12px; font-weight: bold; font-size: 14px; color: #00b894;"></div>
            </div>
        `;
        window.simCourses = improvableCourses;
    }
};

window.runImprovementSimulation = function(totalPoints, totalHours) {
    const courseIdx = document.getElementById('sim-course-select').value;
    const targetGrade = document.getElementById('sim-grade-select').value;
    const selectedCourse = window.simCourses[courseIdx];
    const isAr = currentLang === 'ar';

    let oldPts = selectedCourse.points * selectedCourse.credits;
    let newPts = gradePoints[targetGrade] * selectedCourse.credits;
    let simulatedCGPA = ((totalPoints - oldPts + newPts) / totalHours).toFixed(2);

    document.getElementById('sim-result').innerHTML = isAr 
        ? `✨ إذا حسنت مادة <strong>[${selectedCourse.subject}]</strong> إلى <strong>${targetGrade}</strong>، سيرتفع التراكمي إلى: <span style="color:#00b894; font-size:16px;">${simulatedCGPA}</span>`
        : `✨ Improving <strong>[${selectedCourse.subject}]</strong> to <strong>${targetGrade}</strong> raises CGPA to: <span style="color:#00b894; font-size:16px;">${simulatedCGPA}</span>`;
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
    maxCoursesAllowed = parseFloat(semGPA) >= 3.0 ? 7 : 6;

    const semesterData = {
        id: editingIndex !== null ? savedSemesters[editingIndex].id : Date.now(),
        name: currentEditingName || (currentLang === 'en' ? `Semester ${getNextSemesterNumber()}` : `الترم ${getNextSemesterNumber()}`),
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
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

        const actionButtonsHTML = sem.isLocked 
            ? `<span style="font-size: 12px; color: #0984e3; background: #e3f2fd; padding: 4px 10px; border-radius: 6px; font-weight: bold;">🔒 سجل معتمد</span>`
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
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: currentLang === 'en' ? 'Delete Semester?' : 'حذف الترم؟',
            text: currentLang === 'en' ? 'Are you sure you want to remove this semester?' : 'هل أنت متأكد من حذف هذا الترم؟',
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
    const sem = savedSemesters[index];
    courses = [...sem.courseDetails];
    currentEditingName = sem.name; 
    editingIndex = index; 
    maxCoursesAllowed = courses.length > 6 ? 7 : 6;

    updateUI();
    renderSavedSemesters();
};

window.resetCalculator = function() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: currentLang === 'en' ? 'Reset All Data?' : 'مسح كافة البيانات؟',
            text: currentLang === 'en' ? 'This action will clear all saved semesters!' : 'سيتم حذف جميع الترمات والمواد المسجلة نهائياً!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d63031',
            confirmButtonText: currentLang === 'en' ? 'Reset All' : 'مسح الكل',
            cancelButtonText: currentLang === 'en' ? 'Cancel' : 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                courses = [];
                savedSemesters = [];
                currentEditingName = null;
                editingIndex = null;
                maxCoursesAllowed = 6;
                saveToLocal();
                updateUI();
                renderSavedSemesters();
            }
        });
    }
};
