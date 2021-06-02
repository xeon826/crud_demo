<?php
namespace Controller;

use DateTime;

use MysqliDb;
use dbObject;
use Entity\Customer;

class CustomerController extends Controller
{
    public function indexAction()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $customers = Customer::ArrayBuilder()->get();
            echo $this->twig->render('Customer/index.html.twig', ['customers' => $customers]);
        } else {
            $customers = Customer::ArrayBuilder()
            ->where('title', '%'.$_POST['title'].'%', 'like')
            ->where('phone', '%'.$_POST['phone'].'%', 'like')
            ->where('address', '%'.$_POST['address'].'%', 'like')
            ->get();
            echo $this->twig->render('Customer/tableContent.html.twig', ['customers' => $customers]);
        }
    }
}
