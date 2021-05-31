<?php
namespace Controller;

use MysqliDb;
use dbObject;
use DateTime;
use DateTimeZone;
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
        require $_SERVER['DOCUMENT_ROOT'].'/Connections/parameters.php';
        $this->loader = new FilesystemLoader($_SERVER['DOCUMENT_ROOT'].'/src/views/');
        $this->twig = new Environment($this->loader);
        $this->asset_path = $asset_path;
        $this->js_bundle_ver = $js_bundle_ver;
        $this->db = new MysqliDb($parameters);
    }
}
