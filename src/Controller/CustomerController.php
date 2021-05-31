<?php
namespace Controller;

use DateTime;

class CustomerController extends Controller
{
    public function indexAction()
    {
      echo $this->twig->render('Customer/index.html.twig');
    }
}
