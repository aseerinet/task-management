const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();




const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// السماح للخادم بخدمة الملفات الثابتة مثل index.html
app.use(express.static(__dirname));

// توجيه الطلبات إلى index.html عند زيارة "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${port}`);
});






app.use(express.json()); // تمكين قراءة بيانات JSON من الطلبات
app.use(cors()); // السماح للمتصفح بإرسال الطلبات

// تحميل المستخدمين من ملف JSON
app.get('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المستخدمين");
            return;
        }
        res.json(JSON.parse(data));
    });
});

// تسجيل مستخدم جديد
app.post('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المستخدمين");
            return;
        }

        let users = JSON.parse(data);
        let newUser = req.body;

        // التأكد من أن جميع البيانات مطلوبة
        if (!newUser.name || !newUser.password) {
            res.status(400).send("الرجاء إدخال اسم المستخدم وكلمة المرور");
            return;
        }

        // التحقق مما إذا كان المستخدم موجودًا بالفعل
        if (users.some(user => user.name === newUser.name)) {
            res.status(400).send("اسم المستخدم موجود بالفعل");
            return;
        }

        users.push(newUser);

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.status(500).send("خطأ في حفظ المستخدم الجديد");
                return;
            }
            res.send("تمت إضافة المستخدم بنجاح");
        });
    });
});

// تحميل المهام من ملف JSON
app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المهام");
            return;
        }
        res.json(JSON.parse(data));
    });
});

// إضافة مهمة جديدة
app.post('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المهام");
            return;
        }

        let tasks = JSON.parse(data);
        let newTask = req.body;
        newTask.date = new Date().toISOString().split('T')[0];

        tasks.push(newTask);

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                res.status(500).send("خطأ في حفظ المهمة الجديدة");
                return;
            }
            res.send("تمت إضافة المهمة بنجاح");
        });
    });
});

// تعديل مهمة
app.put('/tasks/:index', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المهام");
            return;
        }
        let tasks = JSON.parse(data);
        tasks[req.params.index] = req.body;

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                res.status(500).send("خطأ في تحديث المهمة");
                return;
            }
            res.send("تم تعديل المهمة بنجاح");
        });
    });
});

// حذف مهمة
app.delete('/tasks/:index', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("خطأ في قراءة ملف المهام");
            return;
        }
        let tasks = JSON.parse(data);
        tasks.splice(req.params.index, 1);

        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                res.status(500).send("خطأ في حذف المهمة");
                return;
            }
            res.send("تم حذف المهمة بنجاح");
        });
    });
});

// تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('الخادم يعمل على http://localhost:3000');
});