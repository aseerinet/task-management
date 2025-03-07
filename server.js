const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
 // التأكد من استخدام المنفذ الصحيح لـ Render

// تمكين قراءة بيانات JSON من الطلبات
app.use(express.json());
app.use(cors());


// ✅ تعديل بيانات المستخدم
app.put('/users/:index', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");

        let users = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= users.length) {
            return res.status(400).send("⚠️ المستخدم غير موجود");
        }

        users[req.params.index] = req.body;

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في تحديث المستخدم");
            res.send("✅ تم تعديل المستخدم بنجاح");
        });
    });
});

// ✅ حذف مستخدم
app.delete('/users/:index', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");

        let users = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= users.length) {
            return res.status(400).send("⚠️ المستخدم غير موجود");
        }

        users.splice(req.params.index, 1);

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حذف المستخدم");
            res.send("✅ تم حذف المستخدم بنجاح");
        });
    });
});



// تقديم الملفات الثابتة (index.html، CSS، JS، إلخ)
app.use(express.static(__dirname));

// توجيه الصفحة الرئيسية "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ تحميل المستخدمين من ملف JSON
app.get('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");
        res.json(JSON.parse(data));
    });
});

// ✅ تسجيل مستخدم جديد
app.post('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");

        let users = JSON.parse(data);
        let newUser = req.body;

        // التحقق من البيانات
        if (!newUser.name || !newUser.password) return res.status(400).send("⚠️ يجب إدخال اسم المستخدم وكلمة المرور");

        // منع التكرار
        if (users.some(user => user.name === newUser.name)) return res.status(400).send("⚠️ اسم المستخدم موجود بالفعل");

        users.push(newUser);

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حفظ المستخدم الجديد");
            res.send("✅ تمت إضافة المستخدم بنجاح");
        });
    });
});

// ✅ تحميل المهام من ملف JSON
app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المهام");
        res.json(JSON.parse(data));
    });
});

// ✅ إضافة مهمة جديدة
app.post('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المهام");

        let tasks = JSON.parse(data);
        let newTask = req.body;
        newTask.date = new Date().toISOString().split('T')[0]; // تعيين التاريخ تلقائيًا

        tasks.push(newTask);

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حفظ المهمة الجديدة");
            res.send("✅ تمت إضافة المهمة بنجاح");
        });
    });
});

// ✅ تعديل مهمة
app.put('/tasks/:index', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المهام");

        let tasks = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= tasks.length) {
            return res.status(400).send("⚠️ المهمة غير موجودة");
        }

        tasks[req.params.index] = req.body;

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في تحديث المهمة");
            res.send("✅ تم تعديل المهمة بنجاح");
        });
    });
});

// ✅ حذف مهمة
app.delete('/tasks/:index', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المهام");

        let tasks = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= tasks.length) {
            return res.status(400).send("⚠️ المهمة غير موجودة");
        }

        tasks.splice(req.params.index, 1);

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حذف المهمة");
            res.send("✅ تم حذف المهمة بنجاح");
        });
    });
});

// ✅ تشغيل الخادم على المنفذ الصحيح
app.listen(port, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${port}`);
});



