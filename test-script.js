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

// === دالة التنبيهات الذكية بـ SweetAlert2 ===
function showCustomAlert(title, text, icon = 'error') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            background: '#1e1e2f',
            color: '#fff',
            confirmButtonColor: '#00f2fe',
            customClass: {
                popup: 'swal2-dark-popup'
            }
        });
    } else {
        alert(`${title}\n${text}`);
    }
}

// === لوائح الأقسام كاملة مقسمة حسب المستويات (Level 1 to Level 4) ===
const departmentSyllabus = {
    CS: [
        { level: 1, en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
        { level: 1, en: "Creative Thinking and Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "H 102", credits: 2, prereq: null },
        { level: 1, en: "Calculus", ar: "تفاضل وتكامل", hint: "BS 101", credits: 3, prereq: null },
        { level: 1, en: "Intro to computer Science", ar: "مقدمة في علوم الحاسب", hint: "CS 101", credits: 3, prereq: null },
        { level: 1, en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "CS 103", credits: 3, prereq: null },
        { level: 1, en: "Electronics", ar: "إلكترونيات", hint: "BS 131", credits: 3, prereq: null },
        { level: 1, en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "H 103", credits: 2, prereq: "H 101" },
        { level: 1, en: "Physics", ar: "فيزياء", hint: "BS 121", credits: 3, prereq: null },
        { level: 1, en: "Computer Programming", ar: "برمجة الحاسب", hint: "CS 102", credits: 3, prereq: "CS 101" },
        { level: 1, en: "Linear Algebra", ar: "الجبر الخطي", hint: "BS 102", credits: 3, prereq: "BS 101" },
        
        { level: 2, en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "BS 103", credits: 3, prereq: "BS 101" },
        { level: 2, en: "Logic Design", ar: "التصميم المنطقي", hint: "CS 121", credits: 3, prereq: "BS 131" },
        { level: 2, en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "CS 203", credits: 3, prereq: "CS 102" },
        { level: 2, en: "Data Structure", ar: "هياكل البيانات", hint: "CS 201", credits: 3, prereq: "CS 102" },
        { level: 2, en: "Computer Organization & Assembly Language", ar: "تنظيم الحاسب ولغة التجميع", hint: "CS 220", credits: 3, prereq: "CS 121" },
        { level: 2, en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "CS 210", credits: 3, prereq: "CS 103" },

        { level: 3, en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3, prereq: "CS 102" },
        { level: 3, en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3, prereq: "CS 220" },
        { level: 3, en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3, prereq: "CS 220" },
        { level: 3, en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3, prereq: "CS 201" }
    ],
    AI: [
        { level: 1, en: "Mathematics for AI", ar: "رياضيات الذكاء الاصطناعي", hint: "BS 105", credits: 3, prereq: null },
        { level: 1, en: "Python Programming", ar: "برمجة بايثون", hint: "AI 101", credits: 3, prereq: null },
        { level: 2, en: "Intro to Artificial Intelligence", ar: "مقدمة في الذكاء الاصطناعي", hint: "AI 102", credits: 3, prereq: "AI 101" },
        { level: 2, en: "Data Analysis & Visualization", ar: "تحليل ورسم البيانات", hint: "AI 201", credits: 3, prereq: "AI 101" },
        { level: 3, en: "Machine Learning Fundamentals", ar: "أساسيات تعلم الآلة", hint: "AI 202", credits: 3, prereq: "BS 105" }
    ],
    CYBER: [
        { level: 1, en: "Computer Networks Fundamentals", ar: "أساسيات شبكات الحاسب", hint: "CY 101", credits: 3, prereq: null },
        { level: 1, en: "Information Security Principles", ar: "مبادئ أمن المعلومات", hint: "CY 102", credits: 3, prereq: null },
        { level: 2, en: "Network Security & Cryptography", ar: "أمن الشبكات والتشفير", hint: "CY 201", credits: 3, prereq: "CY 101" },
        { level: 3, en: "Ethical Hacking & Penetration Testing", ar: "الاختراق الأخلاقي واختبار الاختراق", hint: "CY 202", credits: 3, prereq: "CY 102" }
    ]
};

let currentDepartment = localStorage.getItem('selectedDept') || "CS";
let predefinedCourses = departmentSyllabus[currentDepartment];

const i18n = {
    en: {
        title: "GPA Calculator & Academic Advisor",
        subjectPlaceholder: "Subject Name (Search Level Available)",
        addBtn: "Add course ➕",
        saveBtn: "Save & Add New Semester",
        savedTitle: "Saved Semesters",
        finalGpa: "Final GPA",
        langBtn: "العربية",
        header: ["Subject", "Grade", "Hours", "Action"],
        termGpa: "Term:",
        cgpa: "CGPA:",
        deptLabel: "Department:",
        improvementBtn: "🚀 Academic Recovery & Simulator",
        printBtn: "🖨️ Print",
        resetBtn: "Reset",
        probationWarning: "Academic Probation Alert: CGPA is below 2.00!",
        mandatoryImprovement: "Academic Recovery Roadmap (Target Minimum Grade per Course):",
        deptOptions: { CS: "Computer Science", AI: "Artificial Intelligence", CYBER: "Cyber Security" }
    },
    ar: {
        title: "حاسبة المعدل التراكمي والمرشد الأكاديمي",
        subjectPlaceholder: "اسم المادة (البحث متاح حسب مستواك)",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "الترمات المحفوظة",
        finalGpa: "المعدل التراكمي النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"],
        termGpa: "فصلي:",
        cgpa: "تراكمي:",
        deptLabel: "القسم:",
        improvementBtn: "🚀 خطة التحسين والمحاكاة",
        printBtn: "🖨️ طباعة",
        resetBtn: "إعادة ضبط",
        probationWarning: "إنذار أكاديمي: المعدل التراكمي أقل من 2.00!",
        mandatoryImprovement: "خطة التعافي الأكاديمي (التقدير الأدنى المطلوب لكل مادة لتجاوز 2.00):",
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

    let totalEarnedHours = 0;
    let passedHints = new Set();
    
    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            sem.courseDetails.forEach(c => {
                let pts = gradePoints[c.grade] || 0;
                if (pts > 0) {
                    totalEarnedHours += c.credits;
                    let match = predefinedCourses.find(p => p.en.toLowerCase() === c.subject.trim().toLowerCase() || p.ar === c.subject.trim() || p.hint.toLowerCase() === c.subject.trim().toLowerCase());
                    if (match) passedHints.add(match.hint);
                }
            });
        }
    });

    let currentStudentLevel = 1;
    if (totalEarnedHours >= 100) currentStudentLevel = 4;
    else if (totalEarnedHours >= 66) currentStudentLevel = 3;
    else if (totalEarnedHours >= 33) currentStudentLevel = 2;

    predefinedCourses.forEach(course => {
        const isPassed = passedHints.has(course.hint);
        if (!isPassed && course.level <= (currentStudentLevel + 1)) {
            const option = document.createElement('option');
            const courseName = currentLang === 'en' ? course.en : course.ar;
            option.value = courseName;
            option.label = `[Level ${course.level}] - ${course.hint}`;
            datalist.appendChild(option);
        }
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
    document.getElementById('dept-label').innerText = lang.deptLabel;

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

// === إضافة مادة مع SweetAlert2 لتنبيهات المتطلب والحد الأقصى ===
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

            // فحص المتطلب الصارم بـ SweetAlert2
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

function renderCourses() {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;
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
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.15)',
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

// === خطط تحسين مبتكرة (2 سيناريو: خطة تعافي سريعة / خطة متوازنة) ===
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
        const targetCGPA = 2.00;
        const requiredTotalPoints = totalHours * targetCGPA;
        let neededGain = requiredTotalPoints - totalPoints;

        // الخطة A: التعافي السريع (التركيز على رفع المواد الفاشلة لـ B)
        let planA_Courses = uniqueCoursesList.filter(c => c.points < 2.0).sort((a,b) => a.points - b.points);
        let planA_HTML = planA_Courses.map(c => `
            <tr>
                <td style="padding:6px; text-align:right;">${c.subject}</td>
                <td style="padding:6px; text-align:center; color:#ff4d4d;">${c.grade}</td>
                <td style="padding:6px; text-align:center; color:#07ffb5; font-weight:bold;">B (3.0)</td>
            </tr>
        `).join('');

        // الخطة B: الرفع التدريجي والمتوازن (استهداف B+ أو A لمواد محددة لتوزيع العبء)
        let planB_Courses = uniqueCoursesList.filter(c => c.points < 2.4).sort((a,b) => a.points - b.points);
        let planB_HTML = planB_Courses.map(c => `
            <tr>
                <td style="padding:6px; text-align:right;">${c.subject}</td>
                <td style="padding:6px; text-align:center; color:#ff4d4d;">${c.grade}</td>
                <td style="padding:6px; text-align:center; color:#00f2fe; font-weight:bold;">B+ / A</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div style="background: #1e1e2f; border: 2px solid #ff4d4d; border-radius: 12px; padding: 20px; color: #fff; margin-top: 20px; text-align: ${isAr ? 'right' : 'left'};">
                <h3 style="color: #ff4d4d; margin-top: 0;">🚨 ${i18n[currentLang].probationWarning}</h3>
                <p style="font-size:13px; opacity:0.9;">اختر الخطة المناسبة لقدراتك الأكاديمية لتجاوز الـ 2.00 بأسرع وقت:</p>
                
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                    <!-- المسار الأول -->
                    <div style="flex: 1; min-width: 220px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border-top: 3px solid #07ffb5;">
                        <h4 style="margin: 0 0 10px 0; color: #07ffb5; font-size:14px;">⚡ المسار 1: التعافي المباشر السريع</h4>
                        <table style="width: 100%; font-size: 12px;">
                            <thead><tr><th style="text-align:right;">المادة</th><th>الحالي</th><th>المستهدف</th></tr></thead>
                            <tbody>${planA_HTML}</tbody>
                        </table>
                    </div>

                    <!-- المسار الثاني -->
                    <div style="flex: 1; min-width: 220px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border-top: 3px solid #00f2fe;">
                        <h4 style="margin: 0 0 10px 0; color: #00f2fe; font-size:14px;">🛡️ المسار 2: التوازن والرفع المريح</h4>
                        <table style="width: 100%; font-size: 12px;">
                            <thead><tr><th style="text-align:right;">المادة</th><th>الحالي</th><th>المستهدف</th></tr></thead>
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
                <div style="background: #1e1e2f; border: 1px solid #07ffb5; padding: 15px; border-radius: 12px; color: #fff; margin-top: 20px; text-align: center;">
                    🎉 ${isAr ? 'جميع تقديراتك ممتازة ولا توجد مواد بحاجة للتحسين!' : 'All your grades are excellent and no courses need improvement!'}
                </div>
            `;
            return;
        }

        let optionsHTML = improvableCourses.map((c, i) => `
            <option value="${i}">${c.subject} (${isAr ? 'الحالي' : 'Current'}: ${c.grade})</option>
        `).join('');

        container.innerHTML = `
            <div style="background: #1e1e2f; border: 1px solid #07ffb5; padding: 20px; border-radius: 12px; color: #fff; margin-top: 20px; text-align: ${isAr ? 'right' : 'left'};">
                <h4 style="color: #07ffb5; margin-top: 0; margin-bottom: 15px; font-size: 16px;">${i18n[currentLang].optionalImprovement}</h4>
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <select id="sim-course-select" style="padding: 10px; border-radius: 6px; flex: 1; min-width: 180px; background: #2a2a3d; color: #fff; border: 1px solid #444;">${optionsHTML}</select>
                    <select id="sim-grade-select" style="padding: 10px; border-radius: 6px; background: #2a2a3d; color: #fff; border: 1px solid #444;">
                        <option value="A+">A+</option><option value="A">A</option><option value="B+">B+</option><option value="B">B</option>
                    </select>
                    <button onclick="runImprovementSimulation(${totalPoints}, ${totalHours})" style="padding: 10px 18px; background: #07ffb5; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">${isAr ? 'تجربة التحسين' : 'Simulate'}</button>
                </div>
                <div id="sim-result" style="margin-top: 12px; font-weight: 500; font-size: 14px; color: #07ffb5;"></div>
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
        ? `✨ إذا حسنت مادة <strong>[${selectedCourse.subject}]</strong> إلى <strong>${targetGrade}</strong>، سيرتفع التراكمي إلى: <span style="color:#07ffb5; font-size:16px;">${simulatedCGPA}</span>`
        : `✨ Improving <strong>[${selectedCourse.subject}]</strong> to <strong>${targetGrade}</strong> raises CGPA to: <span style="color:#07ffb5; font-size:16px;">${simulatedCGPA}</span>`;
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
            ? `<span style="font-size: 12px; color: #00f2fe; background: rgba(0,242,254,0.15); padding: 4px 10px; border-radius: 6px; font-weight: bold; border: 1px solid rgba(0,242,254,0.3);">🔒 سجل أكاديمي معتمد</span>`
            : `
                <button onclick="editSemester(${index})" class="btn-edit-sem">${currentLang === 'en' ? 'Edit' : 'تعديل'}</button>
                <button onclick="deleteSemester(${index})" class="btn-delete-sem" style="background: #ff4d4d; color: white;">${currentLang === 'en' ? 'Delete' : 'حذف'}</button>
              `;

        const div = document.createElement('div');
        div.className = 'semester-card';
        div.innerHTML = `
            <div class="semester-info" style="margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <input type="checkbox" id="sem-${sem.id}" ${sem.isChecked ? 'checked' : ''} onchange="toggleSemester(${index})">
                    <label for="sem-${sem.id}" style="font-weight: bold; font-size: 16px;">${sem.name}</label>
                </div>
                <div>${actionButtonsHTML}</div>
            </div>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 15px; background: rgba(0,0,0,0.1); padding: 10px; border-radius: 8px;">
                <span class="semester-gpa" style="font-size: 14px;">${i18n[currentLang].termGpa} <strong>${sem.gpa}</strong></span>
                <span class="semester-cgpa" style="font-size: 14px; color: #07ffb5; font-weight: bold;">| ${i18n[currentLang].cgpa} ${semCGPA}</span>
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
            confirmButtonColor: '#ff4d4d',
            cancelButtonColor: '#3085d6',
            confirmButtonText: currentLang === 'en' ? 'Yes, delete' : 'نعم، احذف',
            cancelButtonText: currentLang === 'en' ? 'Cancel' : 'إلغاء',
            background: '#1e1e2f',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                savedSemesters.splice(index, 1);
                saveToLocal();
                renderSavedSemesters();
                calculateGPA();
                populateDatalist();
            }
        });
    } else {
        if (confirm("Delete semester?")) {
            savedSemesters.splice(index, 1);
            saveToLocal();
            renderSavedSemesters();
            calculateGPA();
            populateDatalist();
        }
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
            confirmButtonColor: '#ff4d4d',
            cancelButtonColor: '#3085d6',
            confirmButtonText: currentLang === 'en' ? 'Reset All' : 'مسح الكل',
            cancelButtonText: currentLang === 'en' ? 'Cancel' : 'إلغاء',
            background: '#1e1e2f',
            color: '#fff'
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
