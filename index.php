<?php
use \Bramus\Router\Router;

require __DIR__ . '/vendor/autoload.php';
$router = new Router();
// Set namespace
$router->setNamespace('\Controller');
// Define routes
$routes = [
  ['GET|POST', '/customer/index', 'CustomerController@indexAction'],
  ['GET|POST', '/customer/update', 'CustomerController@updateAction']
];
foreach ($routes as $route) {
    $router->match($route[0], $route[1], $route[2]);
}

// Run it!
$router->run();
