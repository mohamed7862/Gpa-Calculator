// === المتغيرات الأساسية ===
let savedSemesters = []; // مصفوفة لتخزين الترمات السابقة
let courses = [];        // مصفوفة الكورسات الحالية (التي تعمل عليها الآن)

const gradePoints = {
    'A+': 4.0, 'A': 3.7, 'A-': 3.4, 'B+': 3.2, 'B': 3.0, 'B-': 2.8,
    'C+': 2.6, 'C': 2.4, 'C-': 2.2, 'D+': 2.0, 'D': 1.5, 'D-': 1.0, 'F': 0.0
};

// === عناصر HTML ===
const addCourseBtn = document.getElementById('add-course-btn');
const subjectInput = document.getElementById('subject'); // تأكد أن لديك id="subject" في الـ HTML
// إذا لم يكن لديك id، استخدم document.querySelector('input[type="text"]')
const gradeSelect = document.getElementById('grade');
const creditsSelect = document.getElementById('credits'); // أو document.getElementById('hours') حسب كودك
const coursesList = document.getElementById('courses-list');
const gpaDisplay = document.getElementById('gpa-display');
const savedSemestersBox = document.getElementById('saved-semesters-box');
const semestersList = document.getElementById('semesters-list');

// === 1. إضافة كورس جديد ===
addCourseBtn.addEventListener('click', () => {
    // محاولة للحصول على المدخلات بأكثر من طريقة لتجنب الأخطاء
    const subjectInp = document.querySelector('input[type="text"]');
    const subject = subjectInp.value.trim();
    
    // الحصول على الدرجة والساعات (تأكد من الـ IDs في ملف HTML)
    // سأفترض هنا أنك تستخدم selects، لو الكود مختلف عدل الـ selectors
    const gradeVal = document.querySelector('select:nth-of-type(1)').value; 
    const creditVal = parseFloat(document.querySelector('select:nth-of-type(2)').value);

    if (subject === "") {
        alert("Please enter a subject name!");
        return;
    }

    courses.push({ subject: subject, grade: gradeVal, credits: creditVal });
    
    renderCourses();
    calculateGPA();
    
    subjectInp.value = '';
    subjectInp.focus();
});

// === 2. رسم الكورسات الحالية ===
function renderCourses() {
    coursesList.innerHTML = ''; 
    courses.forEach((course, index) => {
        const row = document.createElement('div');
        row.className = 'course-row'; // تأكد أن كلاس التنسيق موجود في CSS
        // تنسيق مبسط للصف
        row.innerHTML = `
            <div style="flex:1;">${course.subject}</div>
            <div style="flex:1;">${course.grade}</div>
            <div style="flex:1;">${course.credits}</div>
            <div style="flex:0.5;">
                <button onclick="deleteCourse(${index})" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">X</button>
            </div>
        `;
        coursesList.appendChild(row);
    });
}

function deleteCourse(index) {
    courses.splice(index, 1);
    renderCourses();
    calculateGPA();
}

// === 3. دالة الحساب الرئيسية (Master Calculator) ===
function calculateGPA() {
    let totalPoints = 0;
    let totalHours = 0;

    // أولاً: حساب المواد الموجودة حالياً في الجدول (الغير محفوظة بعد)
    courses.forEach(course => {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalHours += course.credits;
    });

    // ثانياً: حساب الترمات المحفوظة (فقط التي عليها علامة صح)
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

// === 4. إضافة 6 مواد (Semester Button) ===
function addSemester() {
    const subjectInp = document.querySelector('input[type="text"]');
    const addBtn = document.getElementById('add-course-btn'); // أو الزرار اللي بيضيف
    
    for (let i = 1; i <= 6; i++) {
        subjectInp.value = "Course " + i; 
        // محاكاة الضغط عالزرار
        // ملاحظة: لو الزرار مش بيشتغل بالكود ده، ممكن ننده دالة الإضافة مباشرة
        // هنا هننده كود الإضافة اللي فوق يدوي لو ال click مش شغال
        const gradeVal = document.querySelector('select:nth-of-type(1)').value; 
        const creditVal = parseFloat(document.querySelector('select:nth-of-type(2)').value);
        courses.push({ subject: "Course " + i, grade: gradeVal, credits: creditVal });
    }
    subjectInp.value = "";
    renderCourses();
    calculateGPA();
}

// === 5. حفظ الترم الحالي (Save & Add New Semester) ===
function saveAndClearSemester() {
    if (courses.length === 0) {
        alert("لا يوجد مواد لحفظها!");
        return;
    }

    let semPoints = 0;
    let semHours = 0;
    
    // حساب النقاط والساعات
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
        courseDetails: [...courses] // <--- السطر السحري: نسخ تفاصيل المواد عشان نرجعها وقت التعديل
    };

    savedSemesters.push(newSemester);

    // تنظيف الشاشة
    courses = [];
    renderCourses();
    renderSavedSemesters();
    calculateGPA();
}

// === 6. رسم قائمة الترمات المحفوظة ===
// === تعديل دالة رسم السيمسترات لإضافة زر الحذف ===
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

// === دالة حذف سيمستر محفوظ ===
function deleteSemester(index) {
    // 1. تأكيد الحذف (اختياري)
    let confirmAction = confirm("Are you sure you want to delete this semester?");
    if (confirmAction) {
        // 2. مسح السيمستر من المصفوفة
        savedSemesters.splice(index, 1);
        
        // 3. إعادة رسم القائمة وإعادة حساب المعدل التراكمي
        renderSavedSemesters();
        calculateGPA();
    }
}

// === 7. تفعيل/تعطيل ترم معين من الحساب ===
function toggleSemester(index) {
    // عكس الحالة (لو صح تبقى غلط والعكس)
    savedSemesters[index].isChecked = !savedSemesters[index].isChecked;
    // إعادة الحساب
    calculateGPA();
}
function editSemester(index) {
    // 1. حماية: لو المستخدم عنده مواد حالية في الجدول مش محفوظة
    if (courses.length > 0) {
        let confirmSwitch = confirm("تنبيه: الجدول الحالي يحتوي على مواد غير محفوظة. هل تريد استبدالها ببيانات الترم الذي تريد تعديله؟");
        if (!confirmSwitch) return; // لو رفض، نوقف العملية
    }

    // 2. استرجاع الترم المطلوب
    const semesterToEdit = savedSemesters[index];

    // 3. وضع مواد الترم ده في الجدول الرئيسي
    courses = [...semesterToEdit.courseDetails]; 

    // 4. حذف الترم من قائمة "المحفوظات" (لأننا بنعدله دلوقتي)
    savedSemesters.splice(index, 1);

    // 5. تحديث الشاشة
    renderCourses();          // إظهار المواد في الجدول للتعديل
    renderSavedSemesters();   // تحديث قائمة المحفوظات (هيختفي منها الترم ده مؤقتاً)
    calculateGPA();           // إعادة الحساب
    
    // رسالة للمستخدم
    alert(`تم استرجاع مواد ${semesterToEdit.name} للتعديل.`);
}
