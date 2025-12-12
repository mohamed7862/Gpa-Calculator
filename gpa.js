// === المتغيرات الأساسية ===
let savedSemesters = []; // مصفوفة لتخزين الترمات السابقة
let courses = [];        // مصفوفة الكورسات الحالية

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// === عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject') || document.querySelector('input[type="text"]');
const gradeSelect = document.getElementById('grade');
const creditsSelect = document.getElementById('credits'); // تأكد أن الـ ID في الـ HTML هو credits
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === 1. إضافة كورس جديد (يدوي) ===
addCourseBtn.addEventListener('click', () => {
    // 1. التحقق من الحد الأقصى (6 مواد)
    if (courses.length >= 6) {
        alert("عفواً! الحد الأقصى هو 6 مواد فقط في الترم الواحد.");
        return;
    }

    const subject = subjectInput.value.trim();
    const gradeVal = gradeSelect.value;
    const creditVal = parseFloat(creditsSelect.value);

    // 2. التحقق من اسم المادة
    if (subject === "") {
        alert("Please enter a subject name!");
        return;
    }

    // 3. الإضافة للمصفوفة
    courses.push({ subject: subject, grade: gradeVal, credits: creditVal });
    
    // 4. تحديث الشاشة
    renderCourses();
    calculateGPA();
    
    // 5. تنظيف الخانة
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

// دالة حذف كورس واحد من الجدول الحالي
function deleteCourse(index) {
    courses.splice(index, 1);
    renderCourses();
    calculateGPA();
}

// === 3. دالة الحساب الرئيسية (Master Calculator) ===
function calculateGPA() {
    let totalPoints = 0;
    let totalHours = 0;

    // أولاً: حساب المواد الحالية (الجدول)
    courses.forEach(course => {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalHours += course.credits;
    });

    // ثانياً: حساب الترمات المحفوظة (المفعلة فقط)
    savedSemesters.forEach(sem => {
        if (sem.isChecked) {
            totalPoints += sem.totalPoints;
            totalHours += sem.totalHours;
        }
    });

    // العرض النهائي
    if (totalHours > 0) {
        gpaDisplay.innerText = (totalPoints / totalHours).toFixed(2);
    } else {
        gpaDisplay.innerText = "0.00";
    }
}

// === 4. زر إضافة 6 مواد (Semester Button) ===
function addSemester() {
    // حماية: لا يمكن إضافة ترم كامل إذا كان هناك مواد بالفعل
    if (courses.length > 0) {
        alert("الجدول يحتوي على مواد بالفعل! لا يمكن إضافة 6 مواد فوقها.\nيرجى حفظ الترم الحالي أو مسحه أولاً.");
        return;
    }

    const gradeVal = gradeSelect.value; 
    const creditVal = parseFloat(creditsSelect.value);
    
    for (let i = 1; i <= 6; i++) {
        courses.push({ subject: "Course " + i, grade: gradeVal, credits: creditVal });
    }
    
    renderCourses();
    calculateGPA();
}

// === 5. حفظ الترم الحالي (Save & Clear) ===
function saveAndClearSemester() {
    if (courses.length === 0) {
        alert("لا يوجد مواد لحفظها!");
        return;
    }

    let semPoints = 0;
    let semHours = 0;
    
    // حساب إحصائيات الترم للحفظ
    courses.forEach(c => {
        semPoints += (gradePoints[c.grade] || 0) * c.credits;
        semHours += c.credits;
    });
    
    let semGPA = semHours > 0 ? (semPoints / semHours).toFixed(2) : "0.00";

    const newSemester = {
        id: Date.now(),
        name: `Semester ${savedSemesters.length + 1}`,
        totalPoints: semPoints,
        totalHours: semHours,
        gpa: semGPA,
        isChecked: true,
        courseDetails: [...courses] // حفظ نسخة من تفاصيل المواد (للتعديل لاحقاً)
    };

    savedSemesters.push(newSemester);

    // تفريغ الجدول الحالي
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

// === 7. الدوال المساعدة (حذف ترم، تعديل ترم، تفعيل ترم) ===

// حذف ترم محفوظ
function deleteSemester(index) {
    if (confirm("Are you sure you want to delete this semester?")) {
        savedSemesters.splice(index, 1);
        renderSavedSemesters();
        calculateGPA();
    }
}

// تفعيل/تعطيل ترم (Checkbox)
function toggleSemester(index) {
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    calculateGPA();
}

// تعديل ترم محفوظ (استرجاعه للجدول)
function editSemester(index) {
    // حماية: لو المستخدم شغال على مواد حالياً
    if (courses.length > 0) {
        let confirmSwitch = confirm("تحذير: الجدول الحالي يحتوي على مواد غير محفوظة.\nهل تريد استبدالها ببيانات الترم الذي تريد تعديله؟");
        if (!confirmSwitch) return;
    }

    // استرجاع البيانات
    const semesterToEdit = savedSemesters[index];
    courses = [...semesterToEdit.courseDetails]; // نسخ المواد للجدول الرئيسي

    // حذف الترم من المحفوظات (لأنه أصبح قيد التعديل الآن)
    savedSemesters.splice(index, 1);

    // تحديث الواجهة
    renderCourses();
    renderSavedSemesters();
    calculateGPA();
    
    alert(`تم استرجاع ${semesterToEdit.name} للتعديل.`);
}