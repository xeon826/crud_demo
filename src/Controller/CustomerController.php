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
            ->where('address', '%'.$_POST['address'].'%', 'like');
            if (isset($_POST['order_by'])) {
                foreach ($_POST['order_by'] as $key=>$value) {
                    $customers->orderBy($key, $value);
                }
            }
            $customers = $customers->get();
            echo $this->twig->render('Customer/tableContent.html.twig', ['customers' => $customers]);
        }
    }

    public function updateAction()
    {
        $this->log($_POST);
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            if (isset($_POST['id'])) {
              $customer = Customer::byId($_POST['id']);
              $data = $_POST;
              unset($data['id']);
              $customer->save($data);
            } else {
              $customer = new Customer($_POST);
              $customer->save();
            }
        }
    }
}
