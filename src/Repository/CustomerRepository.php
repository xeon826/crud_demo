<?php
namespace Repository;

use Entity\Client;
use MysqliDb;
use dbObject;

class ClientRepository extends Repository
{
    public $id;
    public $has_user_permissions;
    public $has_client_permissions;
    public $is_ready;

    public function __construct()
    {
        parent::__construct();
    }

    public function findByFilterQuery($request)
    {
        $clients = Client::ArrayBuilder()->where('company_id', $this->user->company_id);
        if (!empty($request['group_id'])) {
            $clients->where('group_id', $request['group_id']);
        }
        if (!empty($request['name'])) {
            $clients->where('name', '%'.$request['name'].'%', 'like');
        }
        if (!empty($request['phone'])) {
            $clients->where('phone', '%'.$request['client_phn_1'].'%', 'like');
        }
        if (!empty($request['address'])) {
            $clients->where('address', '%'.$request['address'].'%', 'like');
        }
        if (!empty($request['status'])) {
            $clients->where('status', $request['status']);
        }
        if (!empty($request['email'])) {
            $clients->where('email', '%'.$request['email'].'%', 'like');
        }
        if (isset($request['order_by'])) {
          foreach ($request['order_by'] as $key => $value) {
            $field = $key;
            // $field = strpos($field, 'clients') ? 'tbl'.$field : $field;
            $clients->orderBy($field, $value);
          }
        }
        return $clients;
    }

    public function findAll() {
      return $clientJson = Client::ArrayBuilder()->where('id', $this->user->id)->get();
    }
}
