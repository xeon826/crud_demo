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
    public static $instance;
    protected $user;
    public $db;
    protected $data = [];
    protected $loader;
    protected $twig;
    protected $asset_path;
    public $gateway;

}
