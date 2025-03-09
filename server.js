const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // إتاحة الوصول للصور عبر رابط مباشر

// إعداد التخزين للصور باستخدام Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        let username = req.body.username || 'default'; // استخدام اسم المستخدم لحفظ الصورة
        cb(null, `${username}.jpg`);
    }
});

const upload = multer({ storage: storage });

// تحميل المستخدمين
app.get('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");
        res.json(JSON.parse(data));
    });
});

// تسجيل مستخدم جديد
app.post('/users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");

        let users = JSON.parse(data);
        let newUser = req.body;

        if (!newUser.name || !newUser.password) return res.status(400).send("⚠️ يجب إدخال اسم المستخدم وكلمة المرور");
        if (users.some(user => user.name === newUser.name)) return res.status(400).send("⚠️ اسم المستخدم موجود بالفعل");
        
        newUser.isAdmin = newUser.name === "admin"; // تعيين admin فقط كمشرف تلقائيًا
        users.push(newUser);

        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حفظ المستخدم الجديد");
            res.send("✅ تمت إضافة المستخدم بنجاح");
        });
    });
});

// تعديل المستخدمين وإعطاء صلاحية المشرف
app.put('/users/:index', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");
        let users = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= users.length) return res.status(400).send("⚠️ المستخدم غير موجود");
        
        users[req.params.index] = req.body;
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في تحديث المستخدم");
            res.send("✅ تم تعديل المستخدم بنجاح");
        });
    });
});

// حذف المستخدم
app.delete('/users/:index', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("❌ خطأ في قراءة ملف المستخدمين");
        let users = JSON.parse(data);
        if (req.params.index < 0 || req.params.index >= users.length) return res.status(400).send("⚠️ المستخدم غير موجود");
        users.splice(req.params.index, 1);
        fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("❌ خطأ في حذف المستخدم");
            res.send("✅ تم حذف المستخدم بنجاح");
        });
    });
});

// حفظ الصور على الخادم لكل مستخدم باسمه
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send("⚠️ لم يتم رفع أي ملف");
    res.send({ message: "✅ تم حفظ الصورة بنجاح على الخادم", imageUrl: `/uploads/${req.file.filename}` });
});

app.listen(port, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${port}`);
});
