<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class RestDataBaseController extends ResourceController
{
    protected $modelName = 'App\Models\DataBaseModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

}