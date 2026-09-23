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

// قائمة المواد المقترحة من الجداول (مترتبة ومصنفة بالمستويات)
const predefinedCourses = [
    // === المستوى الأول - الترم الأول ===
    { en: "English Language", ar: "اللغة الإنجليزية", hint: "Level 1 - Sem 1 | H 101", credits: 2 },
    { en: "Creative Thinking and Communication Skills", ar: "التفكير الإبداعي ومهارات التواصل", hint: "Level 1 - Sem 1 | H 102", credits: 2 },
    { en: "Calculus", ar: "تفاضل وتكامل", hint: "Level 1 - Sem 1 | BS 101", credits: 3 },
    { en: "Intro to computer Science", ar: "مقدمة في علوم الحاسب", hint: "Level 1 - Sem 1 | CS 101", credits: 3 },
    { en: "Intro to Information Systems", ar: "مقدمة في نظم المعلومات", hint: "Level 1 - Sem 1 | CS 103", credits: 3 },
    { en: "Electronics", ar: "إلكترونيات", hint: "Level 1 - Sem 1 | BS 131", credits: 3 },

    // === المستوى الأول - الترم الثاني ===
    { en: "Technical Report Writing", ar: "كتابة التقارير الفنية", hint: "Level 1 - Sem 2 | H 103", credits: 2 },
    { en: "Physics", ar: "فيزياء", hint: "Level 1 - Sem 2 | BS 121", credits: 3 },
    { en: "Computer Programming", ar: "برمجة الحاسب", hint: "Level 1 - Sem 2 | CS 102", credits: 3 },
    { en: "Linear Algebra", ar: "الجبر الخطي", hint: "Level 1 - Sem 2 | BS 102", credits: 3 },
    { en: "Discrete Mathematics", ar: "رياضيات متقطعة", hint: "Level 1 - Sem 2 | BS 103", credits: 3 },
    { en: "Logic Design", ar: "التصميم المنطقي", hint: "Level 1 - Sem 2 | CS 121", credits: 3 },

    // === المستوى الثاني - الترم الأول ===
    { en: "Work Ethics", ar: "أخلاقيات العمل", hint: "Level 2 - Sem 1 | H 201", credits: 2 },
    { en: "Object-Oriented Programming", ar: "البرمجة كائنية التوجه", hint: "Level 2 - Sem 1 | CS 203", credits: 3 },
    { en: "Operations Research", ar: "بحوث العمليات", hint: "Level 2 - Sem 1 | BS 205", credits: 3 },
    { en: "Statistics and Probabilities", ar: "إحصاء واحتمالات", hint: "Level 2 - Sem 1 | BS 210", credits: 3 },
    { en: "File Processing", ar: "معالجة الملفات", hint: "Level 2 - Sem 1 | CS 211", credits: 3 },
    { en: "Computer Organization & Assembly Language", ar: "تنظيم الحاسب ولغة التجميع", hint: "Level 2 - Sem 1 | CS 220", credits: 3 },

    // === المستوى الثاني - الترم الثاني ===
    { en: "Business Administration", ar: "إدارة الأعمال", hint: "Level 2 - Sem 2 | H 202", credits: 2 },
    { en: "Data Structure", ar: "هياكل البيانات", hint: "Level 2 - Sem 2 | CS 201", credits: 3 },
    { en: "Human Rights", ar: "حقوق الإنسان", hint: "Level 2 - Sem 2 | H 204", credits: 2 },
    { en: "Systems Analysis and Design", ar: "تحليل وتصميم النظم", hint: "Level 2 - Sem 2 | CS 210", credits: 3 },
    { en: "Computer Networks", ar: "شبكات الحاسب", hint: "Level 2 - Sem 2 | CS 250", credits: 3 },
    { en: "Web Programming", ar: "برمجة الويب", hint: "Level 2 - Sem 2 | CS 206", credits: 3 },

    // === المستوى الثالث - الترم الأول ===
    { en: "Logic Programming", ar: "البرمجة المنطقية", hint: "Level 3 - Sem 1 | CS 307", credits: 3 },
    { en: "Mobile App Development", ar: "تطوير تطبيقات الموبايل", hint: "Level 3 - Sem 1 | CS 309", credits: 3 },
    { en: "Software Engineering", ar: "هندسة البرمجيات", hint: "Level 3 - Sem 1 | CS 315", credits: 3 },
    { en: "Theory of Operating Systems", ar: "نظرية نظم التشغيل", hint: "Level 3 - Sem 1 | CS 331", credits: 3 },
    { en: "Intro to Databases", ar: "مقدمة في قواعد البيانات", hint: "Level 3 - Sem 1 | CS 323", credits: 3 },

    // === المستوى الثالث - الترم الثاني ===
    { en: "Analysis of Algorithms", ar: "تحليل الخوارزميات", hint: "Level 3 - Sem 2 | CS 312", credits: 3 },
    { en: "Compiler Design & Theory", ar: "تصميم ونظرية المترجمات", hint: "Level 3 - Sem 2 | CS 321", credits: 3 },
    { en: "Computer Graphics", ar: "الرسوميات بالحاسب", hint: "Level 3 - Sem 2 | CS 340", credits: 3 },
    { en: "Fundamentals of Multimedia", ar: "أساسيات الوسائط المتعددة", hint: "Level 3 - Sem 2 | CS 353", credits: 3 },
    { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", hint: "Level 3 - Sem 2 | CS 360", credits: 3 },

    // === المستوى الرابع - الترم الأول ===
    { en: "Computer Security", ar: "أمن الحاسبات", hint: "Level 4 - Sem 1 | CS 413", credits: 3 },
    { en: "Digital Image processing", ar: "معالجة الصور الرقمية", hint: "Level 4 - Sem 1 | CS 443", credits: 3 },
    { en: "Elective 3", ar: "مقرر اختياري 3", hint: "Level 4 - Sem 1 | TBD", credits: 3 },
    { en: "Elective 4", ar: "مقرر اختياري 4", hint: "Level 4 - Sem 1 | TBD", credits: 3 },
    { en: "Elective 5", ar: "مقرر اختياري 5", hint: "Level 4 - Sem 1 | TBD", credits: 3 },
    { en: "Senior Project 1", ar: "مشروع تخرج 1", hint: "Level 4 - Sem 1 | CS 498", credits: 3 },

    // === المستوى الرابع - الترم الثاني ===
    { en: "Machine Learning", ar: "تعلم الآلة", hint: "Level 4 - Sem 2 | CS 462", credits: 3 },
    { en: "Internet of Things (IoT)", ar: "إنترنت الأشياء", hint: "Level 4 - Sem 2 | CS 455", credits: 3 },
    { en: "Elective 6", ar: "مقرر اختياري 6", hint: "Level 4 - Sem 2 | TBD", credits: 3 },
    { en: "Elective 7", ar: "مقرر اختياري 7", hint: "Level 4 - Sem 2 | TBD", credits: 3 },
    { en: "Senior Project 2", ar: "مشروع تخرج 2", hint: "Level 4 - Sem 2 | CS 499", credits: 3 }
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

// === 2. ربط عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject');
const gradeSelect = document.getElementById('grade');
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === تعبئة قائمة المواد المقسمة واستبعاد المواد المسجلة ===
function populateDatalist() {
    const datalist = document.getElementById('subjects-list');
    if (!datalist) return;
    datalist.innerHTML = '';

    // تجميع المواد المأخوذة سابقاً
    let registeredSubjects = new Set();
    courses.forEach(c => registeredSubjects.add(c.subject.trim().toLowerCase()));
    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            sem.courseDetails.forEach(c => registeredSubjects.add(c.subject.trim().toLowerCase()));
        }
    });

    // إبقاء المواد غير المسجلة فقط
    const availableCourses = predefinedCourses.filter(course => {
        let nameEn = course.en.trim().toLowerCase();
        let nameAr = course.ar.trim().toLowerCase();
        return !registeredSubjects.has(nameEn) && !registeredSubjects.has(nameAr);
    });

    // تعبئة القائمة
    availableCourses.forEach(course => {
        const option = document.createElement('option');
        const courseName = currentLang === 'en' ? course.en : course.ar;
        option.value = courseName;
        option.textContent = `[${course.hint}] - ${courseName}`;
        datalist.appendChild(option);
    });
}

// === 3. وظائف الذاكرة واللغة ===
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

// === 4. إدارة الكورسات الحالية ===
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

        const predefinedCourse = predefinedCourses.find(c => c.en === subject || c.ar === subject);
        let courseCredits = 3;
        
        if (predefinedCourse) {
            courseCredits = predefinedCourse.credits;
        } else if (subject.toUpperCase().includes('H')) {
            courseCredits = 2;
        }

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

// === 5. دالة الحساب ومحاكي التحسين ===
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

    if (gpaDisplay) {
        gpaDisplay.innerText = finalCGPA.toFixed(2);
    }

    renderImprovementEngine(Object.values(uniqueCourses), finalCGPA, totalPoints, totalHours);
}

// === 5.1 عرض كارت وجدول التحسين بتصميم أنيق ===
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
        let pointsNeeded = (2.0 * totalHours) - totalPoints;
        let improvableCourses = uniqueCoursesList.filter(c => c.points < 2.4);

        let recommendedPlan = [];
        let accumulatedGain = 0;

        for (let course of improvableCourses) {
            let targetGrade = 'C+';
            let targetPoints = gradePoints[targetGrade];
            let gain = (targetPoints - course.points) * course.credits;

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
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>
                </div>
                ` : `<p style="font-size: 13px; color: #aaa;">${isAr ? 'يرجى مراجعة المرشد الأكاديمي للتحسين.' : 'Please consult your academic advisor.'}</p>`}
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
                    <select id="sim-course-select" style="padding: 10px; border-radius: 6px; flex: 1; min-width: 180px; background: #2a2a3d; color: #fff; border: 1px solid #444;">
                        ${optionsHTML}
                    </select>
                    <select id="sim-grade-select" style="padding: 10px; border-radius: 6px; background: #2a2a3d; color: #fff; border: 1px solid #444;">
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
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
    let simulatedTotalPoints = totalPoints - oldPts + newPts;
    let simulatedCGPA = (simulatedTotalPoints / totalHours).toFixed(2);

    document.getElementById('sim-result').innerHTML = isAr 
        ? `✨ إذا حسنت مادة <strong>[${selectedCourse.subject}]</strong> إلى <strong>${targetGrade}</strong>، سيرتفع المعدل التراكمي إلى: <span style="color:#07ffb5; font-size:16px;">${simulatedCGPA}</span>`
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

// === 6. إدارة الترمات ===
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

function renderSavedSemesters() {
    if (!semestersList || !savedSemestersBox) return;
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

// === 7. إعادة ضبط الآلة الحاسبة (Reset) ===
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

    if (document.getElementById('subject')) document.getElementById('subject').value = '';
    if (document.getElementById('grade')) document.getElementById('grade').selectedIndex = 0;
}

// === 8. حماية وإجبار الحفظ لمتصفح سفاري وأجهزة الآيفون (iOS) ===
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
        saveToLocal();
    }
});

window.addEventListener("pagehide", function() {
    saveToLocal();
});

// === 9. دالة استيراد البيانات المقروءة أوتوماتيكياً ===
function handleImportedData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('imported') === 'true') {
        const rawData = urlParams.get('data');
        if (rawData) {
            try {
                const importedSemestersData = JSON.parse(decodeURIComponent(rawData));
                
                if (Array.isArray(importedSemestersData) && importedSemestersData.length > 0) {
                    
                    importedSemestersData.forEach((semData, idx) => {
                        let termCourses = semData.courses.map(imp => {
                            const matchedCourse = predefinedCourses.find(c => 
                                c.en.toLowerCase() === imp.name.toLowerCase() || 
                                c.ar === imp.name ||
                                (imp.code && c.hint.toLowerCase().includes(imp.code.toLowerCase()))
                            );

                            let courseCredits = 3;
                            if (matchedCourse) {
                                courseCredits = matchedCourse.credits;
                            } else if (imp.code && imp.code.toUpperCase().includes('H')) {
                                courseCredits = 2;
                            }

                            return {
                                subject: imp.name,
                                grade: imp.grade.toUpperCase(),
                                credits: courseCredits
                            };
                        });

                        let semPoints = termCourses.reduce((sum, c) => sum + ((gradePoints[c.grade] || 0) * c.credits), 0);
                        let semHours = termCourses.reduce((sum, c) => sum + c.credits, 0);

                        savedSemesters.push({
                            id: Date.now() + idx,
                            name: semData.termName || (currentLang === 'en' ? `Semester ${getNextSemesterNumber()}` : `الترم ${getNextSemesterNumber()}`),
                            totalPoints: semPoints,
                            totalHours: semHours,
                            gpa: semHours > 0 ? (semPoints / semHours).toFixed(2) : "0.00",
                            isChecked: true,
                            courseDetails: termCourses
                        });
                    });

                    saveToLocal();
                    renderSavedSemesters();
                    calculateGPA();
                    populateDatalist();

                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (err) {
                console.error("خطأ في معالجة البيانات المستوردة:", err);
            }
        }
    }
}

// === التشغيل البدائي ===
populateDatalist();
renderSavedSemesters();
updateUI();
handleImportedData();
