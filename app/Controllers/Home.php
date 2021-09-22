<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return view('inicio');
    }

    public function login()
    {
        return view('login');
    }
}
