// ==========================================
// 1. CONFIGURATION & ACADEMIC DATA STRUCTURES
// ==========================================

// سلم التقديرات الخاص بالمعهد (بناءً على لائحة أكاديمية الشروق)
const GRADE_POINTS = {
    'A+': 4.0,
    'A': 3.7,
    'A-': 3.4,
    'B+': 3.2,
    'B': 3.0,
    'B-': 2.8,
    'C+': 2.6,
    'C': 2.4,
    'C-': 2.2,
    'D+': 2.0,
    'D': 1.5,
    'D-': 1.0,
    'F': 0.0
};

// قائمة المواد المقترحة حسب القسم (Datalist Courses)
const DEPARTMENT_COURSES = {
    CS: [
        { name: "Structured Programming", hours: 3 },
        { name: "Object Oriented Programming (OOP)", hours: 3 },
        { name: "Data Structures", hours: 3 },
        { name: "Algorithms Analysis", hours: 3 },
        { name: "Operating Systems", hours: 3 },
        { name: "Database Systems", hours: 3 },
        { name: "Computer Graphics", hours: 3 },
        { name: "Web Development", hours: 3 }
    ],
    AI: [
        { name: "Introduction to AI", hours: 3 },
        { name: "Machine Learning", hours: 3 },
        { name: "Deep Learning", hours: 3 },
        { name: "Python Programming", hours: 3 },
        { name: "Data Science Fundamentals", hours: 3 },
        { name: "Computer Vision", hours: 3 },
        { name: "Natural Language Processing", hours: 3 }
    ],
    CYBER: [
        { name: "Cybersecurity Fundamentals", hours: 3 },
        { name: "Network Security", hours: 3 },
        { name: "Ethical Hacking", hours: 3 },
        { name: "Cryptography", hours: 3 },
        { name: "Digital Forensics", hours: 3 },
        { name: "Information Assurance", hours: 3 }
    ]
};

// قاموس الترجمة الداخلي (i18n)
const TRANSLATIONS = {
    en: {
        title: "GPA Calculator",
        langBtn: "العربية",
        addCourse: "Add course ➕",
        saveSem: "Save & Add New Semester",
        reset: "Reset",
        savedTitle: "Saved Semesters",
        subjectHeader: "Subject",
        gradeHeader: "Grade",
        hoursHeader: "Hours",
        actionHeader: "Action",
        finalGpa: "Final Cumulative GPA",
        improvementBtn: "🚀 Academic Recovery & Target Simulator",
        printBtn: "🖨️ Print",
        deleteBtn: "Delete",
        semLabel: "Semester",
        selectGradeAlert: "Please fill subject name and grade correctly!",
        confirmReset: "Are you sure you want to reset all data?",
        recoveryTitle: "Academic Recovery & Simulator",
        warningLowGpa: "Academic Warning: Your GPA is under 2.0! Target repeat courses (D-, C-) to raise your cumulative GPA.",
        criticalGpa: "Critical Warning: Your GPA is under 1.5! Academic Guidance Required.",
        customCourseAdd: "+ Add Custom Test Course",
        predictedGpaText: "Predicted Cumulative GPA: "
    },
    ar: {
        title: "حاسبة المعدل التراكمي GPA",
        langBtn: "English",
        addCourse: "إضافة مادة ➕",
        saveSem: "حفظ وإضافة ترم جديد",
        reset: "إعادة ضبط",
        savedTitle: "الترمات المحفوظة",
        subjectHeader: "المادة",
        gradeHeader: "التقدير",
        hoursHeader: "الساعات",
        actionHeader: "الإجراء",
        finalGpa: "المعدل التراكمي النهائي (GPA)",
        improvementBtn: "🚀 محاكي التحسين والإرشاد الأكاديمي",
        printBtn: "🖨️ طباعة",
        deleteBtn: "حذف",
        semLabel: "الترم",
        selectGradeAlert: "برجاء إدخال اسم المادة واختيار التقدير بشكل صحيح!",
        confirmReset: "هل أنت تأكد من مسح جميع البيانات والإعادة للضبط الأصلي؟",
        recoveryTitle: "محاكي الإرشاد والتحسين الأكاديمي",
        warningLowGpa: "تنبيه إرشاد أكاديمي: المعدل التراكمي أقل من 2.0! يفضل تحسين مواد (D- و C-) لرفع المعدل.",
        criticalGpa: "تحذير شديد: المعدل أقل من 1.5! حالة إنذار أكاديمي تتطلب مراجعة المرشد.",
        customCourseAdd: "+ إضافة مادة تجريبية خارجية",
        predictedGpaText: "المعدل التراكمي المتوقع بعد التحسين: "
    }
};

// ==========================================
// 2. GLOBAL STATE VARIABLES
// ==========================================
let currentLang = 'en';
let currentDepartment = 'CS';
let currentSemesterCourses = [];
let savedSemesters = [];
let gpaChart = null;

// ==========================================
// 3. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    populateGradeDropdown();
    populateSubjectsDatalist(currentDepartment);
    renderCoursesList();
    renderSavedSemesters();
    calculateCumulativeGPA();

    // Event listener for adding course
    document.getElementById("add-course-btn").addEventListener("click", addCourse);
});

// ==========================================
// 4. CORE CALCULATOR LOGIC
// ==========================================

function populateGradeDropdown() {
    const gradeSelect = document.getElementById("grade");
    gradeSelect.innerHTML = `<option value="" disabled selected>Grade</option>`;
    
    Object.keys(GRADE_POINTS).forEach(grade => {
        const opt = document.createElement("option");
        opt.value = grade;
        opt.textContent = `${grade} (${GRADE_POINTS[grade]})`;
        gradeSelect.appendChild(opt);
    });
}

function populateSubjectsDatalist(deptKey) {
    const dataList = document.getElementById("subjects-list");
    dataList.innerHTML = "";
    
    const courses = DEPARTMENT_COURSES[deptKey] || [];
    courses.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.dataset.hours = c.hours;
        dataList.appendChild(opt);
    });
}

function changeDepartment(deptKey) {
    currentDepartment = deptKey;
    populateSubjectsDatalist(deptKey);
}

function addCourse() {
    const subjectInput = document.getElementById("subject");
    const gradeSelect = document.getElementById("grade");
    
    const subjectName = subjectInput.value.trim();
    const selectedGrade = gradeSelect.value;
    
    if (!subjectName || !selectedGrade) {
        Swal.fire({
            icon: 'warning',
            title: 'Notice',
            text: TRANSLATIONS[currentLang].selectGradeAlert
        });
        return;
    }

    // التثبت من عدد ساعات المادة من القائمة أو تعيين افتراضي (3 ساعات)
    let hours = 3;
    const datalistOptions = document.querySelectorAll("#subjects-list option");
    datalistOptions.forEach(opt => {
        if (opt.value.toLowerCase() === subjectName.toLowerCase()) {
            hours = parseInt(opt.dataset.hours) || 3;
        }
    });

    const newCourse = {
        id: Date.now(),
        name: subjectName,
        grade: selectedGrade,
        points: GRADE_POINTS[selectedGrade],
        hours: hours
    };

    currentSemesterCourses.push(newCourse);
    
    // Clear inputs
    subjectInput.value = "";
    gradeSelect.selectedIndex = 0;

    renderCoursesList();
    calculateCumulativeGPA();
    saveToLocalStorage();
}

function removeCourse(id) {
    currentSemesterCourses = currentSemesterCourses.filter(c => c.id !== id);
    renderCoursesList();
    calculateCumulativeGPA();
    saveToLocalStorage();
}

function renderCoursesList() {
    const listContainer = document.getElementById("courses-list");
    listContainer.innerHTML = "";

    currentSemesterCourses.forEach(course => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "course-row-item";
        itemDiv.innerHTML = `
            <div style="flex: 2; text-align: left;">${course.name}</div>
            <div><span class="grade-badge">${course.grade}</span></div>
            <div>${course.hours} hrs</div>
            <div>
                <button onclick="removeCourse(${course.id})" style="background:#ff7675; border:none; color:#fff; padding:4px 8px; border-radius:6px; cursor:pointer;">
                    ${TRANSLATIONS[currentLang].deleteBtn}
                </button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });
}

function saveAndClearSemester() {
    if (currentSemesterCourses.length === 0) return;

    savedSemesters.push({
        id: Date.now(),
        courses: [...currentSemesterCourses]
    });

    currentSemesterCourses = [];
    renderCoursesList();
    renderSavedSemesters();
    calculateCumulativeGPA();
    saveToLocalStorage();
}

function renderSavedSemesters() {
    const container = document.getElementById("saved-semesters-box");
    const list = document.getElementById("semesters-list");
    
    if (savedSemesters.length === 0) {
        container.style.display = "none";
        return;
    }
    
    container.style.display = "block";
    list.innerHTML = "";

    savedSemesters.forEach((sem, idx) => {
        let semPoints = 0;
        let semHours = 0;
        sem.courses.forEach(c => {
            semPoints += c.points * c.hours;
            semHours += c.hours;
        });
        const semGPA = semHours > 0 ? (semPoints / semHours).toFixed(2) : "0.00";

        const semBox = document.createElement("div");
        semBox.style.cssText = "background:#f1f2f6; border-radius:10px; padding:10px; margin-bottom:10px;";
        semBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold;">
                <span>${TRANSLATIONS[currentLang].semLabel} #${idx + 1} (${sem.courses.length} courses)</span>
                <span>GPA: ${semGPA}</span>
                <button onclick="deleteSemester(${sem.id})" style="background:#d63031; color:#fff; border:none; border-radius:5px; padding:2px 8px; cursor:pointer;">✕</button>
            </div>
        `;
        list.appendChild(semBox);
    });
}

function deleteSemester(id) {
    savedSemesters = savedSemesters.filter(s => s.id !== id);
    renderSavedSemesters();
    calculateCumulativeGPA();
    saveToLocalStorage();
}

// ==========================================
// 5. CUMULATIVE GPA & CHART RENDERING
// ==========================================

function getAllCoursesFlat() {
    let all = [...currentSemesterCourses];
    savedSemesters.forEach(s => {
        all = all.concat(s.courses);
    });
    return all;
}

function calculateCumulativeGPA() {
    const allCourses = getAllCoursesFlat();
    let totalPoints = 0;
    let totalHours = 0;

    allCourses.forEach(c => {
        totalPoints += c.points * c.hours;
        totalHours += c.hours;
    });

    const cumulativeGpa = totalHours > 0 ? (totalPoints / totalHours) : 0.00;
    const formattedGPA = cumulativeGpa.toFixed(2);

    document.getElementById("gpa-display").textContent = formattedGPA;

    updateGpaChart();
    return parseFloat(formattedGPA);
}

function updateGpaChart() {
    const chartContainer = document.getElementById("chart-container");
    if (savedSemesters.length === 0 && currentSemesterCourses.length === 0) {
        chartContainer.style.display = "none";
        return;
    }
    
    chartContainer.style.display = "block";

    const labels = savedSemesters.map((_, i) => `${TRANSLATIONS[currentLang].semLabel} ${i + 1}`);
    if (currentSemesterCourses.length > 0) {
        labels.push(`${TRANSLATIONS[currentLang].semLabel} (${currentLang === 'ar' ? 'الحالي' : 'Current'})`);
    }

    const dataPoints = [];
    let runningPoints = 0;
    let runningHours = 0;

    savedSemesters.forEach(sem => {
        sem.courses.forEach(c => {
            runningPoints += c.points * c.hours;
            runningHours += c.hours;
        });
        dataPoints.push((runningPoints / runningHours).toFixed(2));
    });

    if (currentSemesterCourses.length > 0) {
        let tempPoints = runningPoints;
        let tempHours = runningHours;
        currentSemesterCourses.forEach(c => {
            tempPoints += c.points * c.hours;
            tempHours += c.hours;
        });
        dataPoints.push((tempPoints / tempHours).toFixed(2));
    }

    const ctx = document.getElementById('gpaChart').getContext('2d');
    
    if (gpaChart) {
        gpaChart.destroy();
    }

    gpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative GPA Progress',
                data: dataPoints,
                borderColor: '#0984e3',
                backgroundColor: 'rgba(9, 132, 227, 0.15)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: 4.0
                }
            }
        }
    });
}

// ==========================================
// 6. DYNAMIC ACADEMIC RECOVERY SIMULATOR
// ==========================================

function handleImprovementClick() {
    const currentGPA = calculateCumulativeGPA();
    const allCourses = getAllCoursesFlat();
    const recoveryBox = document.getElementById("improvement-engine-box");

    if (allCourses.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: currentLang === 'ar' ? 'قم بإضافة بعض المواد أولاً لفتح محاكي التحسين.' : 'Please add some courses first to activate the simulator.'
        });
        return;
    }

    // مواد الأولوية (P2) التي حصل فيها الطالب على D- أو C- أو D
    const recoverableCourses = allCourses.filter(c => c.points <= 2.2);

    let alertNotice = "";
    if (currentGPA < 1.5) {
        alertNotice = `<div style="background:#ff7675; color:#fff; padding:10px; border-radius:8px; margin-bottom:15px; font-weight:bold;">${TRANSLATIONS[currentLang].criticalGpa}</div>`;
    } else if (currentGPA < 2.0) {
        alertNotice = `<div style="background:#fdcb6e; color:#2d3436; padding:10px; border-radius:8px; margin-bottom:15px; font-weight:bold;">${TRANSLATIONS[currentLang].warningLowGpa}</div>`;
    }

    let coursesHtml = recoverableCourses.map(c => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px; border-radius:8px; margin-bottom:8px; border:1px solid #dfe6e9;">
            <div style="text-align:left;">
                <strong>${c.name}</strong> <span style="font-size:12px; color:#636e72;">(Current: ${c.grade})</span>
            </div>
            <div>
                <select class="sim-retake-grade" data-course-id="${c.id}" data-old-points="${c.points}" data-hours="${c.hours}" onchange="recalculateSimulation()">
                    <option value="${c.points}">Keep Original (${c.grade})</option>
                    <option value="4.0">Retake -> A+ (4.0)</option>
                    <option value="3.7">Retake -> A (3.7)</option>
                    <option value="3.2">Retake -> B+ (3.2)</option>
                    <option value="3.0">Retake -> B (3.0)</option>
                    <option value="2.6">Retake -> C+ (2.6)</option>
                </select>
            </div>
        </div>
    `).join("");

    if (recoverableCourses.length === 0) {
        coursesHtml = `<p style="color:#2ed573; font-weight:bold;">${currentLang === 'ar' ? 'ممتاز! لا توجد مواد ذات تقديرات منخفضة تحتاج لإعادة.' : 'Great! No low-grade courses need repeating.'}</p>`;
    }

    recoveryBox.innerHTML = `
        <div style="background:#f8f9fa; border:2px dashed #6c5ce7; border-radius:15px; padding:20px; margin-top:20px; text-align:left;">
            <h3 style="color:#6c5ce7; margin-top:0;">${TRANSLATIONS[currentLang].recoveryTitle}</h3>
            ${alertNotice}
            <h4>1. Repeat Low Grade Courses (P2 Priority Optimization):</h4>
            ${coursesHtml}

            <hr style="margin:20px 0; border:none; border-top:1px solid #dfe6e9;">

            <h4>2. ${TRANSLATIONS[currentLang].customCourseAdd} (Playground Mode 🔒):</h4>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input type="text" id="custom-course-name" placeholder="Course Name (Optional)" style="flex:2; padding:8px; border-radius:6px; border:1px solid #ccc;">
                <input type="number" id="custom-course-hours" placeholder="Hours" value="3" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ccc;">
                <select id="custom-course-grade" style="flex:1; padding:8px; border-radius:6px; border:1px solid #ccc;">
                    <option value="4.0">A+</option>
                    <option value="3.7">A</option>
                    <option value="3.0">B</option>
                    <option value="2.4">C</option>
                </select>
                <button onclick="addCustomSimulationCourse()" style="background:#00b894; color:#fff; border:none; border-radius:6px; padding:0 15px; cursor:pointer;">Add</button>
            </div>
            <div id="custom-courses-sim-list"></div>

            <div style="background:#2d3436; color:#fff; padding:15px; border-radius:10px; margin-top:15px; font-size:18px; text-align:center;">
                ${TRANSLATIONS[currentLang].predictedGpaText}
                <strong id="sim-predicted-gpa" style="color:#00cec9;">${currentGPA.toFixed(2)}</strong>
            </div>
        </div>
    `;

    window.customSimCourses = [];
    recalculateSimulation();
}

function addCustomSimulationCourse() {
    const name = document.getElementById("custom-course-name").value || "Custom Course";
    const hours = parseInt(document.getElementById("custom-course-hours").value) || 3;
    const points = parseFloat(document.getElementById("custom-course-grade").value);

    window.customSimCourses.push({ name, hours, points });
    
    // Clear input
    document.getElementById("custom-course-name").value = "";
    
    renderCustomSimList();
    recalculateSimulation();
}

function renderCustomSimList() {
    const list = document.getElementById("custom-courses-sim-list");
    list.innerHTML = window.customSimCourses.map((c, idx) => `
        <div style="display:flex; justify-content:space-between; background:#e3f2fd; padding:6px 12px; border-radius:6px; margin-bottom:5px;">
            <span>🔒 [Custom] ${c.name} (${c.hours} hrs)</span>
            <span>Points: ${c.points} <button onclick="removeCustomSimCourse(${idx})" style="border:none; background:red; color:#fff; border-radius:4px; cursor:pointer;">✕</button></span>
        </div>
    `).join("");
}

function removeCustomSimCourse(idx) {
    window.customSimCourses.splice(idx, 1);
    renderCustomSimList();
    recalculateSimulation();
}

function recalculateSimulation() {
    const allCourses = getAllCoursesFlat();
    let basePoints = 0;
    let baseHours = 0;

    // حساب النقاط الإجمالية الحالية
    allCourses.forEach(c => {
        basePoints += c.points * c.hours;
        baseHours += c.hours;
    });

    // تطبيق تعديلات الإعادة (Retakes)
    const retakeSelects = document.querySelectorAll(".sim-retake-grade");
    retakeSelects.forEach(select => {
        const oldPoints = parseFloat(select.dataset.oldPoints);
        const newPoints = parseFloat(select.value);
        const hours = parseInt(select.dataset.hours);

        // استبدال الفرق بين النقاط
        basePoints += (newPoints - oldPoints) * hours;
    });

    // إضافة المواد التجريبية (Custom Playground Courses)
    if (window.customSimCourses) {
        window.customSimCourses.forEach(c => {
            basePoints += c.points * c.hours;
            baseHours += c.hours;
        });
    }

    const newSimulatedGPA = baseHours > 0 ? (basePoints / baseHours).toFixed(2) : "0.00";
    const simDisplay = document.getElementById("sim-predicted-gpa");
    if (simDisplay) {
        simDisplay.textContent = newSimulatedGPA;
    }
}

// ==========================================
// 7. LANGUAGE TOGGLE & LOCAL STORAGE
// ==========================================

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    document.getElementById("lang-btn").textContent = TRANSLATIONS[currentLang].langBtn;
    document.getElementById("main-title").textContent = TRANSLATIONS[currentLang].title;
    document.getElementById("add-course-btn").textContent = TRANSLATIONS[currentLang].addCourse;
    document.getElementById("save-sem-btn").textContent = TRANSLATIONS[currentLang].saveSem;
    document.getElementById("reset-btn").textContent = TRANSLATIONS[currentLang].reset;
    document.getElementById("saved-title").textContent = TRANSLATIONS[currentLang].savedTitle;
    document.getElementById("final-gpa-text").textContent = TRANSLATIONS[currentLang].finalGpa;
    document.getElementById("improvement-btn").textContent = TRANSLATIONS[currentLang].improvementBtn;
    document.getElementById("print-btn").textContent = TRANSLATIONS[currentLang].printBtn;

    // Update List Headers
    const headers = document.querySelectorAll("#list-header div");
    if (headers.length === 4) {
        headers[0].textContent = TRANSLATIONS[currentLang].subjectHeader;
        headers[1].textContent = TRANSLATIONS[currentLang].gradeHeader;
        headers[2].textContent = TRANSLATIONS[currentLang].hoursHeader;
        headers[3].textContent = TRANSLATIONS[currentLang].actionHeader;
    }

    renderCoursesList();
    renderSavedSemesters();
    calculateCumulativeGPA();
}

function resetCalculator() {
    Swal.fire({
        title: 'Reset All Data?',
        text: TRANSLATIONS[currentLang].confirmReset,
        icon: 'warning',
        showCancelButton: true,
        confirmColor: '#d63031',
        cancelColor: '#b2bec3',
        confirmButtonText: 'Yes, reset'
    }).then((result) => {
        if (result.isConfirmed) {
            currentSemesterCourses = [];
            savedSemesters = [];
            localStorage.clear();
            renderCoursesList();
            renderSavedSemesters();
            calculateCumulativeGPA();
            document.getElementById("improvement-engine-box").innerHTML = "";
        }
    });
}

function saveToLocalStorage() {
    localStorage.setItem("sha_gpa_current", JSON.stringify(currentSemesterCourses));
    localStorage.setItem("sha_gpa_saved", JSON.stringify(savedSemesters));
}

function loadFromLocalStorage() {
    const localCurrent = localStorage.getItem("sha_gpa_current");
    const localSaved = localStorage.getItem("sha_gpa_saved");

    if (localCurrent) currentSemesterCourses = JSON.parse(localCurrent);
    if (localSaved) savedSemesters = JSON.parse(localSaved);
}
