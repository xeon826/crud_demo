<?php
namespace Controller;

use MysqliDb;
use dbObject;
use \Twig\Loader\FilesystemLoader;
use \Twig\Environment;
use Twig_SimpleFilter;

class Controller
{
    public $db;
    protected $data = [];
    protected $loader;
    protected $twig;
    protected $asset_path;
    public function __construct()
    {
        // Hypothetically if there were more than two controllers in this demo, they would all inherit from this parent class.
        // I've kept it here for illustration purposes
        require $_SERVER['DOCUMENT_ROOT'].'/Connections/parameters.php';
        $this->loader = new FilesystemLoader($_SERVER['DOCUMENT_ROOT'].'/src/views/');
        $this->twig = new Environment($this->loader);
        // Url for resource path, usually "http://localhost:8080/" in development and "/" in production
        $this->asset_path = $asset_path;
        $this->db = new MysqliDb($parameters);
        $this->twig->addGlobal('asset_path', $this->asset_path);
    }

    // Easily print data to error_log
    protected function log($arg)
    {
        if (is_object($arg) || is_array($arg)) {
            error_log(print_r($arg, true));
        } else {
            error_log($arg);
        }
    }
}
