<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\DataBaseModel;
use App\Models\UsuarioModel;

class Login extends BaseController {

    private $dataBaseModel;
    private $usuarioModel;

    public function __construct() {
        $this->dataBaseModel = new DataBaseModel();
        $this->usuarioModel = new UsuarioModel();
    }

	public function index() {
		$databases = $this->dataBaseModel
                        ->where('activo', 1)
                        ->orderBy('nombre', 'asc')
                        ->findAll();
        helper('form');
        return view('login', compact('databases'));
	}

	public function checklogin() {
        $usuario = strtoupper($this->request->getPost('usuario'));
        $password = $this->request->getPost('password');
        $codedatabase = $this->request->getPost('empresa');

        if (!empty($usuario) && !empty($codedatabase)) {
			$query = $this->usuarioModel
                        ->select('Codigo, Nombre, Grupo')
                        ->where('Codigo', $usuario)
                        ->find();
          
           

			if ($query && $usuario==trim($query[0]->Codigo)) { // && $password==trim($dataDB->Clave) Pendiente verificaciond de contraseña
                $dataDB = $query[0];
                $session_data = array(
					'codigo'  => $dataDB->Codigo,
					'codedatabase' => trim($codedatabase),
					'usuario'  => $dataDB->Nombre,
					'user_role'     => trim($dataDB->Grupo),
					'logged_in' => TRUE
				);
               
                $session = session();
                $session->set($session_data);
                return redirect()->to(base_url('/'));	
            } else {
               
				return  redirect()
                            ->to(base_url('/login'))
                            ->withInput()
                            ->with('message','No se ha podido ingresar con el usuario <strong>'.$usuario.'</strong> en la empresa seleccionada');	
			}
		}else {
			return redirect()->to(base_url('/login'));	
		}
	}

	public function logout(){
    	$this->session->destroy();
		return redirect()->to(base_url('/'));	
	}

    public function test() {
        echo 'Controller listo';
	}
}