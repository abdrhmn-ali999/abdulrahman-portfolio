<?php
// api/blog.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

// معالجة طلب الـ OPTIONS المسبق (Preflight Request) الذي يرسله المتصفح تلقائياً
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 6;
$offset = ($page - 1) * $limit;

try {
    // جلب العدد الإجمالي للمقالات
    $stmtCount = $pdo->query("SELECT COUNT(*) FROM blog_posts");
    $totalPosts = $stmtCount->fetchColumn();
    $totalPages = ceil($totalPosts / $limit);

    // جلب المقالات المحددة لهذه الصفحة مرتبة من الأحدث إلى الأقدم
    $stmt = $pdo->prepare("SELECT * FROM blog_posts ORDER BY published_at DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $posts = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $posts,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_posts' => $totalPosts,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'DATABASE_ERROR // UNABLE_TO_FETCH_POSTS'
    ]);
}
?>