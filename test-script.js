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

// قائمة المواد المقترحة وشجرة المتطلبات السابقة
const predefinedCourses = [
    // === First Level - First Semester ===
    { en: "English Language", ar: "اللغة الإنجليزية", hint: "H 101", credits: 2, prereq: null },
    { en: "Creative Thinking and Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "H 102", credits: 2, prereq: null },
    { en: "Calculus", ar: "تفاضل وتكامل", hint: "BS 101", credits: 3, prereq: null },
    { en: "Intro to computer Science", ar: "مقدمة في علوم الحاسب", hint: "CS 101", credits: 3, prereq: null },
    { en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "CS 103", credits: 3, prereq: null },
    { en: "Electronics", ar: "إلكترونيات", hint: "BS 131", credits: 3, prereq: null },

    // === First Level - Second Semester ===
    { en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "H 103", credits: 2, prereq: "H 101" },
    { en: "Physics", ar: "فيزياء", hint: "BS 121", credits: 3, prereq: null },
    { en: "Computer Programming", ar: "برمجة الحاسب", hint: "CS 102", credits: 3, prereq: "CS 101" },
    { en: "Linear Algebra", ar: "الجبر الخطي", hint: "BS 102", credits: 3, prereq: "BS 101" },
    { en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "BS 103", credits: 3, prereq: "BS 101" },
    { en: "Logic Design", ar: "التصميم المنطقي", hint: "CS 121", credits: 3, prereq: "BS 131" },

    // === Second Level - First Semester ===
    { en: "Work Ethics", ar: "أخلاقيات العمل", hint: "H 201", credits: 2, prereq: null },
    { en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "CS 203", credits: 3, prereq: "CS 102" },
    { en: "Operations Research", ar: "بحوث العمليات", hint: "BS 205", credits: 3, prereq: "BS 101" },
    { en: "Statistics and Probabilities", ar: "إحصاء واحتمالات", hint: "BS 210", credits: 3, prereq: "BS 101" },
    { en: "File Processing", ar: "معالجة الملفات", hint: "CS 211", credits: 3, prereq: "CS 102" },
    { en: "Computer Organization & Assembly Language", ar: "تنظيم الحاسب ولغة التجميع", hint: "CS 220", credits: 3, prereq: "CS 121" },

    // === Second Level - Second Semester ===
    { en: "Business Administration", ar: "إدارة الأعمال", hint: "H 202", credits: 2, prereq: null },
    { en: "Data Structure", ar: "هياكل البيانات", hint: "CS 201", credits: 3, prereq: "CS 102" },
    { en: "Human Rights", ar: "حقوق الإنسان", hint: "H 204", credits: 2, prereq: null },
    { en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "CS 210", credits: 3, prereq: "CS 103" },
    { en: "Computer Networks", ar: "شبكات الحاسب", hint: "CS 250", credits: 3, prereq: "CS 101" },
    { en: "Web Programming", ar: "برمجة الويب", hint: "CS 206", credits: 3, prereq: "CS 102" },

    // === Third Level - First Semester ===
    { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "CS 307", credits: 3, prereq: "CS 102" },
    { en: "Mobile App Development", ar: "تطوير تطبيقات الموبايل", hint: "CS 309", credits: 3, prereq: "CS 206" },
    { en: "Software Engineering", ar: "هندسة البرمجيات", hint: "CS 315", credits: 3, prereq: "CS 210" },
    { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "CS 331", credits: 3, prereq: "CS 220" },
    { en: "Intro to Databases", ar: "مقدمة في قواعد البيانات", hint: "CS 323", credits: 3, prereq: "CS 103" },

    // === Third Level - Second Semester ===
    { en: "Analysis of Algorithms", ar: "تحليل الخوارزميات", hint: "CS 312", credits: 3, prereq: "CS 201" },
    { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "CS 321", credits: 3, prereq: "CS 220" },
    { en: "Computer Graphics", ar: "الرسوميات بالحاسب", hint: "CS 340", credits: 3, prereq: "CS 220" },
    { en: "Fundamentals of Multimedia", ar: "أساسيات الوسائط المتعددة", hint: "CS 353", credits: 3, prereq: "CS 102" },
    { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "CS 360", credits: 3, prereq: "CS 312" },

    // === Fourth Level - First Semester ===
    { en: "Computer Security", ar: "أمن الحاسبات", hint: "CS 413", credits: 3, prereq: "CS 250" },
    { en: "Digital Image processing", ar: "معالجة الصور الرقمية", hint: "CS 443", credits: 3, prereq: "CS 340" },
    { en: "Senior Project 1", ar: "مشروع تخرج 1", hint: "CS 498", credits: 3, prereq: "CS 315" },

    // === Fourth Level - Second Semester ===
    { en: "Machine Learning", ar: "تعلم الآلة", hint: "CS 462", credits: 3, prereq: "BS 210" },
    { en: "Internet of Things (IoT)", ar: "إنترنت الأشياء", hint: "CS 455", credits: 3, prereq: "CS 250" },
    { en: "Senior Project 2", ar: "مشروع تخرج 2", hint: "CS 499", credits: 3, prereq: "CS 498" },

    // === Elective Courses ===
    { en: "Game Design & Development", ar: "تطوير وتصميم الألعاب", hint: "CS 313", credits: 3, prereq: "CS 312" },
    { en: "Human Computer Interaction", ar: "طرق اتصال الإنسان بالحاسب", hint: "CS 314", credits: 3, prereq: "CS 203" },
    { en: "Real Time Systems", ar: "نظم الزمن الحقيقي", hint: "CS 332", credits: 3, prereq: "CS 331" },
    { en: "Simulation and Modeling", ar: "النمذجة والمحاكاة", hint: "CS 351", credits: 3, prereq: "BS 210" },
    { en: "Neural Networks", ar: "الشبكات العصبية", hint: "CS 361", credits: 3, prereq: "CS 307" },
    { en: "Geographic Information Systems", ar: "نظم المعلومات الجغرافية", hint: "CS 405", credits: 3, prereq: "CS 323" },
    { en: "Parallel Processing", ar: "المعالجة المتوازية", hint: "CS 418", credits: 3, prereq: "CS 331" },
    { en: "Distributed Systems", ar: "الأنظمة الموزعة", hint: "CS 432", credits: 3, prereq: "CS 250" },
    { en: "Cloud Computing", ar: "الحوسبة السحابية", hint: "CS 433", credits: 3, prereq: "CS 250" },
    { en: "Virtual Reality", ar: "الواقع الافتراضي", hint: "CS 444", credits: 3, prereq: "CS 340" },
    { en: "Computer Vision Systems", ar: "نظم الرؤية بالحاسب", hint: "CS 445", credits: 3, prereq: "CS 312" },
    { en: "Introduction to embedded systems", ar: "مقدمة في النظم المدمجة", hint: "CS 463", credits: 3, prereq: "CS 102" },
    { en: "Data Warehousing", ar: "مستودعات البيانات", hint: "CS 470", credits: 3, prereq: "CS 323" }
];

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
        cgpa: "CGPA:",
        probationWarning: "Academic Probation: CGPA is below 2.00!",
        mandatoryImprovement: "Mandatory Improvement Plan (To reach 2.00):",
        optionalImprovement: "Optional Course Improvement Simulator 🚀"
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
        cgpa: "تراكمي:",
        probationWarning: "إنذار أكاديمي: المعدل التراكمي أقل من 2.00!",
        mandatoryImprovement: "الخطة الإجبارية لتحسين المواد (للوصول لـ 2.00):",
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

        // === فحص المتطلب السابق الأكاديمي الصارم ===
        if (predefinedCourse && predefinedCourse.prereq) {
            let passedCourseHints = new Set();

            const checkAndAddPassed = (c) => {
                let pts = gradePoints[c.grade] || 0;
                if (pts > 0) { // ناجح (مش F)
                    let inputSub = c.subject.trim().toLowerCase();
                    let match = predefinedCourses.find(p => 
                        p.en.trim().toLowerCase() === inputSub || 
                        p.ar.trim() === c.subject.trim() ||
                        p.hint.toLowerCase() === inputSub
                    );
                    if (match && match.hint) {
                        passedCourseHints.add(match.hint.toUpperCase());
                    }
                }
            };

            savedSemesters.forEach(sem => {
                if (sem.isChecked) sem.courseDetails.forEach(checkAndAddPassed);
            });
            courses.forEach(checkAndAddPassed);

            const requiredHint = predefinedCourse.prereq.toUpperCase();
            if (!passedCourseHints.has(requiredHint)) {
                let reqCourse = predefinedCourses.find(p => p.hint.toUpperCase() === requiredHint);
                let reqName = reqCourse ? (currentLang === 'en' ? reqCourse.en : reqCourse.ar) : requiredHint;

                alert(currentLang === 'en' 
                    ? `❌ Cannot register [${subject}]. You have not passed prerequisite: (${reqName} - ${requiredHint})!` 
                    : `❌ عفواً! لا يمكنك تسجيل مادة [${subject}] لأنك لم تتجاوز المادة المتطلبة لها بنجاح: (${reqName} - ${requiredHint})!`);
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

    renderImprovementEngine(Object.values(uniqueCourses), finalCGPA, totalPoints, totalHours);
}

function renderImprovementEngine(uniqueCoursesList, currentCGPA, totalPoints, totalHours) {
    let container = document.getElementById('improvement-engine-box');
    if (!container) {
        container = document.createElement('div');
        container.id = 'improvement-engine-box';
        container.style.marginTop = '20px';
        const mainContainer = document.querySelector('.gpa-result') || document.body;
        mainContainer.appendChild(container);
    }

    if (totalHours === 0) {
        container.innerHTML = '';
        return;
    }

    const isAr = currentLang === 'ar';

    if (currentCGPA < 2.0) {
        let improvableCourses = uniqueCoursesList.filter(c => c.points < 2.4);
        let recommendedPlan = [];
        let accumulatedGain = 0;

        for (let course of improvableCourses) {
            let targetGrade = 'C+';
            let gain = (gradePoints[targetGrade] - course.points) * course.credits;

            if (gain > 0) {
                accumulatedGain += gain;
                recommendedPlan.push({
                    subject: course.subject,
                    currentGrade: course.grade,
                    targetGrade: targetGrade,
                    credits: course.credits
                });
            }
            if ((totalPoints + accumulatedGain) / totalHours >= 2.0) break;
        }

        let rowsHTML = recommendedPlan.map(item => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 10px; text-align: ${isAr ? 'right' : 'left'}; font-weight: 600;">${item.subject}</td>
                <td style="padding: 10px; text-align: center;">${item.credits} ${isAr ? 'س' : 'hrs'}</td>
                <td style="padding: 10px; text-align: center; color: #ff6b6b; font-weight: bold;">${item.currentGrade}</td>
                <td style="padding: 10px; text-align: center; color: #00f2fe; font-weight: bold;">${item.targetGrade}</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div style="background: #1e1e2f; border: 2px solid #ff4d4d; border-radius: 12px; padding: 20px; color: #fff; box-shadow: 0 4px 15px rgba(255, 77, 77, 0.2); margin-top: 15px; text-align: ${isAr ? 'right' : 'left'};">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 22px;">🚨</span>
                    <h3 style="margin: 0; color: #ff4d4d; font-size: 18px; font-weight: bold;">${i18n[currentLang].probationWarning}</h3>
                </div>
                <p style="margin-bottom: 15px; font-size: 14px; opacity: 0.9; line-height: 1.5;">${i18n[currentLang].mandatoryImprovement}</p>
                ${recommendedPlan.length > 0 ? `
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.08); color: #ddd; font-size: 13px;">
                                <th style="padding: 10px; text-align: ${isAr ? 'right' : 'left'};">${isAr ? 'المادة' : 'Subject'}</th>
                                <th style="padding: 10px; text-align: center;">${isAr ? 'الساعات' : 'Credits'}</th>
                                <th style="padding: 10px; text-align: center;">${isAr ? 'الحالي' : 'Current'}</th>
                                <th style="padding: 10px; text-align: center;">${isAr ? 'المطلوب' : 'Target'}</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHTML}</tbody>
                    </table>
                </div>` : `<p style="font-size: 13px; color: #aaa;">${isAr ? 'يرجى مراجعة المرشد الأكاديمي.' : 'Consult academic advisor.'}</p>`}
            </div>
        `;
    } else {
        let improvableCourses = uniqueCoursesList.filter(c => c.points < 3.2);
        if (improvableCourses.length === 0) {
            container.innerHTML = '';
            return;
        }

        let optionsHTML = improvableCourses.map((c, i) => `
            <option value="${i}">${c.subject} (${isAr ? 'الحالي' : 'Current'}: ${c.grade})</option>
        `).join('');

        container.innerHTML = `
            <div style="background: #1e1e2f; border: 1px solid #07ffb5; padding: 20px; border-radius: 12px; color: #fff; margin-top: 15px; text-align: ${isAr ? 'right' : 'left'};">
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

// === تصحيح دالة إعادة حساب وتحديث كروت الترمات بدقة متناهية ===
function renderSavedSemesters() {
    if (!semestersList || !savedSemestersBox) return;
    semestersList.innerHTML = '';
    savedSemestersBox.style.display = savedSemesters.length > 0 ? 'block' : 'none';

    let runningUniqueCourses = {};

    savedSemesters.forEach((sem, index) => {
        // حساب GPA الترم الحقيقي بدقة بناءً على مواده الحالية
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

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") saveToLocal();
});

window.addEventListener("pagehide", function() {
    saveToLocal();
});

populateDatalist();
renderSavedSemesters();
updateUI();
