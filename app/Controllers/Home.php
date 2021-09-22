<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        $db = \Config\Database::connect('sbio');
       
        $query = $db->query('SELECT TOP 10 * FROM dbo.Empleados');
        $result = $query->getResult();

        var_dump($result);
        $data = array('numero' => 13, 'result' => $result);
        return view('welcome_message', $data);
    }
}
