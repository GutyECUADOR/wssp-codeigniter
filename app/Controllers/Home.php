<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        $db = \Config\Database::connect();
       
        $query = $db->query('SELECT TOP 100 * FROM dbo.INV_ARTICULOS');
        $result = $query->getResult();

        var_dump($result);
        $data = array('numero' => 13, 'result' => $result);
        return view('welcome_message', $data);
    }
}
