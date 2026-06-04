<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'METHOD_NOT_ALLOWED']);
    exit();
}

require_once 'config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

$name    = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
$email   = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($data['subject']) ? strip_tags(trim($data['subject'])) : '';
$message = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

// التقاط عنوان الـ IP الخاص بالزائر لحفظه في الجدول
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if (empty($name) || empty($email) || empty($subject) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'VALIDATION_FAILED // INVALID_INPUT_DATA']);
    exit();
}

try {
    // تم تعديل اسم الجدول إلى contacts وإضافة حقل ip ليتطابق مع db.sql تماماً
    $sql = "INSERT INTO contacts (name, email, subject, message, ip, created_at) 
            VALUES (:name, :email, :subject, :message, :ip, NOW())";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message,
        ':ip'      => $ip
    ]);

    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = SMTP_PORT;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom(SMTP_USER, 'Portfolio Gateway');
            $mail->addAddress(ADMIN_EMAIL);
            $mail->addReplyTo($email, $name);

            $mail->isHTML(true);
            $mail->Subject = "New Contact Node: " . $subject;
            $mail->Body    = "
                <h3>حزمة بيانات جديدة من استمارة الاتصال:</h3>
                <p><strong>الاسم:</strong> {$name}</p>
                <p><strong>البريد الإلكتروني:</strong> {$email}</p>
                <p><strong>الموضوع:</strong> {$subject}</p>
                <p><strong>عنوان IP للزائر:</strong> {$ip}</p>
                <p><strong>الرسالة:</strong><br/>" . nl2br($message) . "</p>
            ";

            $mail->send();
        } catch (Exception $e) {
            // فشل الإرسال بالبريد لا يعطل نجاح العملية لأن البيانات تم حفظها بالقاعدة بنجاح
        }
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'TRANSMISSION COMPLETE // LOGS ARCHIVED']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DATABASE_ERROR // UNABLE_TO_ARCHIVE_PAYLOAD']);
}