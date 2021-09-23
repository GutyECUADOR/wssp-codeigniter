<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class InventarioController extends BaseController
{
    public function index()
    {
        return view('inventarioView');
    }
}
