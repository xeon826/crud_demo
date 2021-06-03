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
      // Regex for ensuring phone number matches correct format
      'phone' => ['/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/'],
    ];

    // One-to-many between customer and notes
    protected $relations = [
      'notes' => ['hasMany', '\Entity\Note', 'note_id']
    ];

    // Methods for retrieving row values
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
