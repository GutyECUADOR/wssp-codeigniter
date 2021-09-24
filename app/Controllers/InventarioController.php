<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class InventarioController extends BaseController
{
    public function index() {
        $db = \Config\Database::connect();
        $query = $db->query("SELECT TOP 100 * FROM dbo.sys_menus WHERE modulo ='inventario' AND activo = 1 ORDER BY orden");
        $items_menu = $query->getResult();
       
       
        return view('inventarioView', compact('items_menu'));
    }

    public function updateProducto() {
        $db = \Config\Database::connect();
        $query = $db->query("SELECT TOP 100 * FROM dbo.sys_menus WHERE modulo ='inventario' AND activo = 1 ORDER BY orden");
        $items_menu = $query->getResult();
        return view('updateProductoView', compact('items_menu'));
    }
}
