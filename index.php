<?php
use \Bramus\Router\Router;
use Controller\Controller as Controller;

if (session_status() == PHP_SESSION_NONE) {
    $a_long_time = 315360000;
    ini_set('session.gc_maxlifetime', $a_long_time);
    session_set_cookie_params($a_long_time, '/');
    session_start(['cookie_lifetime' => $a_long_time]);
}
require __DIR__ . '/vendor/autoload.php';
$router = new Router();

// $router->before('GET|POST', '/.*', function () {
//     $allowed_urls = ['/conditions', '/login', '/clients/fixTheThingAction'];
//     if (!isset($_COOKIE['user_id']) && !in_array($_SERVER['REDIRECT_URL'], $allowed_urls)) {
//         header('location: /login');
//         die();
//     }
// });
$router->setNamespace('\Controller');
$routes = [
  ['GET|POST', '/something', function() {
    echo 'asdfasdfasdfasdf';
  }],
  ['GET|POST', '/login', 'CustomerController@loginAction']
];
foreach ($routes as $route) {
    $router->match($route[0], $route[1], $route[2]);
}

// Define routes
// Run it!
$router->run();
