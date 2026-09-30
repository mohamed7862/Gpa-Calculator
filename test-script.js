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

// === لوائح الأقسام الثلاثة (CS / AI / CYBER) ===
const departmentSyllabus = {
    CS: [
        { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
        { en: "Creative Thinking and Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "H 102", credits: 2, prereq: null },
        { en: "Calculus", ar: "تفاضل وتكامل", hint: "BS 101", credits: 3, prereq: null },
        { en: "Intro to computer Science", ar: "مقدمة في علوم الحاسب", hint: "CS 101", credits: 3, prereq: null },
        { en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "CS 103", credits: 3, prereq: null },
        { en: "Electronics", ar: "إلكترونيات", hint: "BS 131", credits: 3, prereq: null },
        { en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "H 103", credits: 2, prereq: "H 101" },
        { en: "Physics", ar: "فيزياء", hint: "BS 121", credits: 3, prereq: null },
        { en: "Computer Programming", ar: "برمجة الحاسب", hint: "CS 102", credits: 3, prereq: "CS 101" },
        { en: "Linear Algebra", ar: "الجبر الخطي", hint: "BS 102", credits: 3, prereq: "BS 101" },
        { en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "BS 103", credits: 3, prereq: "BS 101" },
        { en: "Logic Design", ar: "التصميم المنطقي", hint: "CS 121", credits: 3, prereq: "BS 131" },
        { en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "CS 203", credits: 3, prereq: "CS 102" },
        { en: "Data Structure", ar: "هياكل البيانات", hint: "CS 201", credits: 3, prereq: "CS 102" },
        { en: "Computer Organization & Assembly Language", ar: "تنظيم الحاسب ولغة التجميع", hint: "CS 220", credits: 3, prereq: "CS 121" },
        { en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "CS 210", credits: 3, prereq: "CS 103" },
        { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3, prereq: "CS 102" },
        { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3, prereq: "CS 220" },
        { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3, prereq: "CS 220" },
        { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3, prereq: "CS 312" }
    ],
    AI: [
        { en: "Mathematics for AI", ar: "رياضيات الذكاء الاصطناعي", hint: "BS 105", credits: 3, prereq: null },
        { en: "Python Programming", ar: "برمجة بايثون", hint: "AI 101", credits: 3, prereq: null },
        { en: "Intro to Artificial Intelligence", ar: "مقدمة في الذكاء الاصطناعي", hint: "AI 102", credits: 3, prereq: "AI 101" },
        { en: "Data Analysis & Visualization", ar: "تحليل ورسم البيانات", hint: "AI 201", credits: 3, prereq: "AI 101" },
        { en: "Machine Learning Fundamentals", ar: "أساسيات تعلم الآلة", hint: "AI 202", credits: 3, prereq: "BS 105" },
        { en: "Neural Networks", ar: "الشبكات العصبية", hint: "AI 301", credits: 3, prereq: "AI 202" }
    ],
    CYBER: [
        { en: "Computer Networks Fundamentals", ar: "أساسيات شبكات الحاسب", hint: "CY 101", credits: 3, prereq: null },
        { en: "Information Security Principles", ar: "مبادئ أمن المعلومات", hint: "CY 102", credits: 3, prereq: null },
        { en: "Network Security & Cryptography", ar: "أمن الشبكات والتشفير", hint: "CY 201", credits: 3, prereq: "CY 101" },
        { en: "Ethical Hacking & Penetration Testing", ar: "الاختراق الأخلاقي واختبار الاختراق", hint: "CY 202", credits: 3, prereq: "CY 102" },
        { en: "Operating Systems Security", ar: "أمن نظم التشغيل", hint: "CY 301", credits: 3, prereq: "CY 201" }
    ]
};

// تحديد القسم الافتراضي أو المحفوظ
let currentDepartment = localStorage.getItem('selectedDept') || "CS";
let predefinedCourses = departmentSyllabus[currentDepartment];

const i18n = {
    en: {
        title: "GPA Calculator & Academic Advisor",
        subjectPlaceholder: "Subject Name (Type to search)",
        addBtn: "Add course ➕",
        saveBtn: "Save & Add New Semester",
        savedTitle: "Academic History & Saved Semesters",
        finalGpa: "Final Cumulative GPA",
        langBtn: "العربية",
        header: ["Subject", "Grade", "Hours", "Action"],
        termGpa: "Term:",
        cgpa: "CGPA:",
        probationWarning: "Academic Probation Alert: CGPA is below 2.00!",
        mandatoryImprovement: "Academic Recovery Roadmap (Target Grade: B):",
        optionalImprovement: "Optional Course Improvement Simulator 🚀"
    },
    ar: {
        title: "حاسبة المعدل التراكمي والمرشد الأكاديمي",
        subjectPlaceholder: "اسم المادة (ابحث أو اكتب)",
        addBtn: "إضافة مادة ➕",
        saveBtn: "حفظ وتحديث الترم",
        savedTitle: "السجل الأكاديمي والترمات المحفوظة",
        finalGpa: "المعدل التراكمي النهائي",
        langBtn: "English",
        header: ["المادة", "التقدير", "الساعات", "حذف"],
        termGpa: "فصلي:",
        cgpa: "تراكمي:",
        probationWarning: "إنذار أكاديمي: المعدل التراكمي أقل من 2.00!",
        mandatoryImprovement: "خطة التعافي الأكاديمي المقترحة للخروج من الإنذار (مستهدف B):",
        optionalImprovement: "مُحاكي تحسين المواد الاختياري 🚀"
    }
};

const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject');
const gradeSelect = document.getElementById('grade');
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === دالة تغيير القسم ديناميكياً ===
function changeDepartment(deptKey) {
    if (!departmentSyllabus[deptKey]) return;
    currentDepartment = deptKey;
    localStorage.setItem('selectedDept', deptKey);
    predefinedCourses = departmentSyllabus[deptKey];
    populateDatalist();
    calculateGPA();
}

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

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const lang = i18n[currentLang];
    
    if (document.querySelector('h1')) document.querySelector('h1').innerText = lang.title;
    if (subjectInput) subjectInput.placeholder = lang.subjectPlaceholder;
    if (addCourseBtn) addCourseBtn.innerText = lang.addBtn;
    if (document.querySelector('#save-sem-btn')) document.querySelector('#save-sem-btn').innerText = lang.saveBtn;
    if (document.querySelector('#saved-semesters-box h3')) document.querySelector('#saved-semesters-box h3').innerText = lang.savedTitle;
    if (document.querySelector('.gpa-result h2')) document.querySelector('.gpa-result h2').innerText = lang.finalGpa;
    if (document.getElementById('lang-btn')) document.getElementById('lang-btn').innerText = lang.langBtn;
    
    const headers = document.querySelectorAll('.course-header div');
    if (headers.length > 0) {
        lang.header.forEach((text, i) => headers[i].innerText = text);
    }

    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    populateDatalist(); 
    renderSavedSemesters();
    calculateGPA();
}

// === إضافة مادة مع الفحص الصارم للمتطلبات ===
if (addCourseBtn) {
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

        const predefinedCourse = predefinedCourses.find(c => 
            c.en.trim().toLowerCase() === subject.toLowerCase() || 
            c.ar.trim() === subject ||
            c.hint.toLowerCase() === subject.toLowerCase()
        );

        // التحقق من المتطلب السابق
        if (predefinedCourse && predefinedCourse.prereq) {
            let passedCourseHints = new Set();

            const checkPassed = (c) => {
                let pts = gradePoints[c.grade] || 0;
                if (pts > 0) { // ناجح في المادة
                    let inputSub = c.subject.trim().toLowerCase();
                    let match = predefinedCourses.find(p => 
                        p.en.trim().toLowerCase() === inputSub || 
                        p.ar.trim() === c.subject.trim() ||
                        p.hint.toLowerCase() === inputSub
                    );
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

                alert(currentLang === 'en' 
                    ? `⛔ Access Denied! You must PASS the prerequisite course (${reqName} - ${requiredHint}) first!` 
                    : `⛔ خطأ أكاديمي! لا يمكنك تسجيل مادة [${subject}] لأنك لم تتجاوز المتطلب السابق لها بنجاح: (${reqName} - ${requiredHint})!`);
                return;
            }
        }

        let courseCredits = predefinedCourse ? predefinedCourse.credits : (subject.toUpperCase().includes('H') ? 2 : 3);

        courses.push({ subject, grade: gradeSelect.value, credits: courseCredits });
        updateUI();
        subjectInput.value = '';
        subjectInput.focus();
    });
}

function deleteCourse(index) {
    courses.splice(index, 1);
    updateUI();
}

function updateUI() {
    renderCourses();
    calculateGPA();
    populateDatalist();
}

function renderCourses() {
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

// === حساب التراكمي وتجميع المواد الفريدة ===
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
    if (gpaDisplay) gpaDisplay.innerText = finalCGPA.toFixed(2);

    window.currentCalculatedData = {
        uniqueCoursesList: Object.values(uniqueCourses),
        finalCGPA: finalCGPA,
        totalPoints: totalPoints,
        totalHours: totalHours
    };
}

// === محرك المرشد الأكاديمي الذكي ===
function handleImprovementClick() {
    if (!window.currentCalculatedData || window.currentCalculatedData.totalHours === 0) {
        alert(currentLang === 'en' ? "Please add courses or semesters first!" : "يرجى إضافة مواد أو ترمات أولاً لحساب الخطة!");
        return;
    }

    const { uniqueCoursesList, finalCGPA, totalPoints, totalHours } = window.currentCalculatedData;
    let container = document.getElementById('improvement-engine-box');
    if (!container) return;

    const isAr = currentLang === 'ar';

    if (finalCGPA < 2.0) {
        let improvableCourses = uniqueCoursesList
            .filter(c => c.points < 2.0)
            .sort((a, b) => a.points - b.points);

        let simCoursesMap = {};
        improvableCourses.forEach(c => {
            simCoursesMap[c.subject] = { ...c, targetGrade: c.grade, targetPoints: c.points };
        });

        let currentSimPoints = totalPoints;
        let targetReached = false;

        // استهداف تقدير B والتوقف فور كسر حاجز 2.00
        for (let c of improvableCourses) {
            let targetGrade = 'B';
            let oldPts = simCoursesMap[c.subject].targetPoints * c.credits;
            let newPts = gradePoints[targetGrade] * c.credits;
            
            currentSimPoints = currentSimPoints - oldPts + newPts;
            simCoursesMap[c.subject].targetGrade = targetGrade;
            simCoursesMap[c.subject].targetPoints = gradePoints[targetGrade];

            if (currentSimPoints / totalHours >= 2.0) {
                targetReached = true;
                break;
            }
        }

        // إذا لزم الأمر رفع التقدير لـ A
        if (!targetReached) {
            for (let c of improvableCourses) {
                let oldPts = simCoursesMap[c.subject].targetPoints * c.credits;
                let newPts = gradePoints['A'] * c.credits;

                currentSimPoints = currentSimPoints - oldPts + newPts;
                simCoursesMap[c.subject].targetGrade = 'A';
                simCoursesMap[c.subject].targetPoints = gradePoints['A'];

                if (currentSimPoints / totalHours >= 2.0) {
                    targetReached = true;
                    break;
                }
            }
        }

        let recommendedPlan = Object.values(simCoursesMap).filter(c => c.targetGrade !== c.grade);

        // تقسيم على 12 ساعة كحد أقصى للإنذار
        const MAX_HOURS_PER_PROBATION_SEM = 12;
        let semestersPlan = [];
        let currentSemCourses = [];
        let currentSemHours = 0;

        recommendedPlan.forEach(course => {
            if (currentSemHours + course.credits > MAX_HOURS_PER_PROBATION_SEM) {
                semestersPlan.push(currentSemCourses);
                currentSemCourses = [course];
                currentSemHours = course.credits;
            } else {
                currentSemCourses.push(course);
                currentSemHours += course.credits;
            }
        });
        if (currentSemCourses.length > 0) {
            semestersPlan.push(currentSemCourses);
        }

        let semestersHTML = '';
        let accumPointsTracking = totalPoints;

        semestersPlan.forEach((semCourses, idx) => {
            let semHours = 0;
            let semTableRows = semCourses.map(item => {
                semHours += item.credits;
                let oldPts = item.points * item.credits;
                let newPts = gradePoints[item.targetGrade] * item.credits;
                accumPointsTracking = accumPointsTracking - oldPts + newPts;

                return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 8px; text-align: ${isAr ? 'right' : 'left'}; font-weight: 600;">${item.subject}</td>
                        <td style="padding: 8px; text-align: center;">${item.credits} ${isAr ? 'س' : 'hrs'}</td>
                        <td style="padding: 8px; text-align: center; color: #ff6b6b; font-weight: bold;">${item.grade}</td>
                        <td style="padding: 8px; text-align: center; color: #00f2fe; font-weight: bold;">${item.targetGrade}</td>
                    </tr>
                `;
            }).join('');

            let expectedCGPAAfterSem = (accumPointsTracking / totalHours).toFixed(2);

            semestersHTML += `
                <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 12px; margin-bottom: 15px; border-left: 4px solid #00f2fe;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="margin: 0; color: #00f2fe; font-size: 15px;">📅 ${isAr ? `الترم القادم (${idx + 1}) - المسموح: ${semHours} ساعة` : `Next Semester (${idx + 1}) -${semHours} Credits`}</h4>
                        <span style="font-size: 12px; color: #07ffb5; font-weight: bold;">${isAr ? `التراكمي المتوقع: ${expectedCGPAAfterSem}` : `Expected CGPA: ${expectedCGPAAfterSem}`}</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.05); color: #aaa;">
                                <th style="padding: 6px; text-align: ${isAr ? 'right' : 'left'};">${isAr ? 'المادة' : 'Subject'}</th>
                                <th style="padding: 6px; text-align: center;">${isAr ? 'الساعات' : 'Credits'}</th>
                                <th style="padding: 6px; text-align: center;">${isAr ? 'الحالي' : 'Current'}</th>
                                <th style="padding: 6px; text-align: center;">${isAr ? 'المستهدف' : 'Target'}</th>
                            </tr>
                        </thead>
                        <tbody>${semTableRows}</tbody>
                    </table>
                </div>
            `;
        });

        container.innerHTML = `
            <div style="background: #1e1e2f; border: 2px solid #ff4d4d; border-radius: 12px; padding: 20px; color: #fff; box-shadow: 0 4px 15px rgba(255, 77, 77, 0.2); margin-top: 20px; text-align: ${isAr ? 'right' : 'left'};">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <span style="font-size: 22px;">🚨</span>
                    <h3 style="margin: 0; color: #ff4d4d; font-size: 17px; font-weight: bold;">${i18n[currentLang].probationWarning}</h3>
                </div>
                <p style="margin-bottom: 15px; font-size: 13px; opacity: 0.9; line-height: 1.4;">
                    ${i18n[currentLang].mandatoryImprovement}
                </p>
                ${semestersHTML}
            </div>
        `;
    } 
    else {
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
}

function runImprovementSimulation(totalPoints, totalHours) {
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
}

function getNextSemesterNumber() {
    if (savedSemesters.length === 0) return 1;
    const numbers = savedSemesters.map(s => {
        const match = s.name.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    });
    return Math.max(...numbers, 0) + 1;
}

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
        name: currentEditingName || (currentLang === 'en' ? `Semester ${getNextSemesterNumber()}` : `الترم ${getNextSemesterNumber()}`),
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
        isLocked: false, // الترم المدخل يدويًا متاح للتعديل
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

        // إخفاء أزرار التحكم للمواد المستوردة (isLocked)
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

function toggleSemester(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    saveToLocal();
    calculateGPA(); 
    renderSavedSemesters(); 
    populateDatalist();
}

function deleteSemester(index) {
    if (confirm(currentLang === 'en' ? "Delete this semester?" : "هل تريد حذف هذا الترم؟")) {
        savedSemesters.splice(index, 1);
        saveToLocal();
        renderSavedSemesters();
        calculateGPA();
        populateDatalist();
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

function resetCalculator() {
    const confirmMsg = currentLang === 'en' 
        ? "Are you sure you want to delete all data and start over?" 
        : "هل أنت متأكد من مسح جميع البيانات والبدء من جديد؟";
        
    if (!confirm(confirmMsg)) return;

    courses = [];
    savedSemesters = [];
    currentEditingName = null;
    editingIndex = null;
    maxCoursesAllowed = 6;

    saveToLocal();
    updateUI();
    renderSavedSemesters();
}

// === دالة ديناميكية لاستقبال سجل الطالب من داتابيز الجامعة (API Endpoint) ===
// تستقبل أي عدد من المواد السابقة وتقفلها لمنع التعديل.
window.loadStudentDataFromUniversity = function(studentData) {
    if (studentData.department) {
        changeDepartment(studentData.department);
        const deptSelect = document.getElementById('dept-select');
        if (deptSelect) deptSelect.value = studentData.department;
    }
    
    if (studentData.historySemesters && Array.isArray(studentData.historySemesters)) {
        savedSemesters = studentData.historySemesters.map((sem, index) => ({
            id: sem.id || `official-${index}`,
            name: sem.semesterName || `الترم الرسمي ${index + 1}`,
            isChecked: true,
            isLocked: true, 
            courseDetails: sem.courses.map(c => ({
                subject: c.subject,
                grade: c.grade,
                credits: c.credits || 3
            }))
        }));
    }

    saveToLocal();
    renderSavedSemesters();
    calculateGPA();
};

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") saveToLocal();
});

window.addEventListener("pagehide", function() {
    saveToLocal();
});

populateDatalist();
renderSavedSemesters();
updateUI();
