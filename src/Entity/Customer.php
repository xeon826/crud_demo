<?php
namespace Entity;

use MysqliDb;
use dbObject;
use \DateTime;

class Customer extends dbObject
{
    protected $dbTable = 'customerlist';
    protected $dbFields = [
      'id' => ['int'],
      'title' => ['text'],
      'address' => ['text'],
      'phone' => ['/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/'],
    ];

    protected $relations = [
      'notes' => ['hasMany', '\Entity\Note', 'note_id']
    ];

    public function id()
    {
        return $this->id;
    }

    public function address()
    {
        return $this->client_address;
    }

    public function title()
    {
        return $this->title;
    }

    public function phone()
    {
        return $this->phone;
    }

    public function notes()
    {
        return $this->notes;
    }

}
