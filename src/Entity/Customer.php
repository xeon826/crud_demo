<?php
namespace Entity;

use MysqliDb;
use dbObject;
use \DateTime;

class Customer extends dbObject
{
    protected $dbTable = 'tblcustomer';
    protected $dbFields = [
      'id' => ['int'],
      'name' => ['text'],
      'address' => ['text'],
      'phone' => ['/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/'],
      'phone_id' => ['text'],
      'company_id' => ['int'],
      'email' => ['text'],
      'notes' => ['text'],
      'created_at' => ['datetime'],
      'updated_at' => ['datetime']
    ];

    protected $timestamps = ['created_at', 'updated_at'];

    protected $relations = [
      'notes' => ['hasMany', '\Entity\Note', 'note_id']
    ];

    public function address()
    {
        return $this->client_address;
    }

    public function name()
    {
        return $this->name;
    }

    public function email()
    {
        return $this->client_email;
    }

    public function id()
    {
        return $this->id;
    }

    public function phone_id()
    {
        return $this->phone_id;
    }

    public function notes()
    {
        return $this->notes;
    }
}
