<?php
// api/config.php

// 1. إعدادات الاتصال بقاعدة البيانات (MySQL Configuration)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // اتركها فارغة '' إذا كنت تستخدم XAMPP محلياً، أو ضع كلمة السر إن وجدت
define('DB_NAME', 'aah_portfolio'); // اسم قاعدة البيانات المطابق لملف db.sql

// 2. إعدادات مكتبة إرسال الإيميلات (PHPMailer / SMTP Configuration)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'your_email@gmail.com');     // اكتب هنا بريدك الإلكتروني الحقيقي (Gmail)
define('SMTP_PASS', 'your_app_password');    // اكتب هنا رمز تطبيق جوجل (App Password) وليس كلمة سر الحساب
define('SMTP_PORT', 587);
define('ADMIN_EMAIL', 'hlt7792@gmail.com');   // البريد الذي ستستلم عليه رسائل الزوار

// 3. تهيئة وبناء الاتصال بقاعدة البيانات عبر الـ PDO
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    
    // تفعيل وضع الأخطاء البرمجية للمساعدة أثناء التطوير
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // جعل جلب البيانات يعود تلقائياً على شكل مصفوفة مفتاح وقيمة (Associative Array)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    // في حال فشل الاتصال، يتم إرجاع استجابة JSON فورية للفرونت إند لمنع انهيار الموقع
    http_response_code(500);
    die(json_encode([
        'success' => false, 
        'message' => 'DATABASE_CONNECTION_FAILED // ARCHIVE_OFFLINE'
    ]));
}
?>