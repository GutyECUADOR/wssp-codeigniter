<!DOCTYPE html>
<html lang="es">
  <head>
      <!-- Disable cache -->
      <meta http-equiv="Expires" content="0">
      <meta http-equiv="Last-Modified" content="0">
      <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
      <meta http-equiv="Pragma" content="no-cache">
      
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
     
      <link rel="shortcut icon" href="assets\img\favicon.ico">

      <!-- CSS Bootstrap -->
      <link rel="stylesheet" href="assets\css\bootstrap.min.css">
     
      <!-- Librerias-->
      <link rel="stylesheet" href="assets\css\bootstrap-datepicker.css">
      <link rel="stylesheet" href="assets\css\font-awesome.min.css">
      <link rel="stylesheet" type="text/css"  href="assets\css\sweetalert.css" />

      <!-- CSS Propios -->
      
      <link rel="stylesheet" href="assets\css\loaders.css">
      <link rel="stylesheet" href="assets\css\pnotify.custom.min.css">

      <!-- Custom CSS -->
      <link rel="stylesheet" href="assets\css\custom.css?<?php echo date('Ymdhiiss')?>">
      <link rel="stylesheet" href="assets\css\circlemenu.css"> 

      <!-- CSS Paginas -->

      <title><?php echo APP_NAME; ?></title>

  </head>

  <body>
    
    <nav class="navbar navbar-default ">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            
            </button>
            <a class="navbar-brand" href="#" data-toggle="modal" data-target="#modal_info_sesion">
                <span><img alt="Brand" height="25" src="<?php echo LOGO_NAME?>"></span>
                
            </a>
            
            </div>

            
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">  
                <li><a href="<?php echo base_url()?>"><i class="fa fa-home" aria-hidden="true"></i></i> Inicio</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                <?php
                    if (session('logged_in')){
                ?> 
                    
                        <li><a id="liveclock"></a></li>
                        <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-user" aria-hidden="true"></i></i> Bienvenido, <?php echo session('usuario') ?><span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <?php if (session('logged_in')) {
                            
                            ?>
                            <li><a href="?action=admin"><span class="glyphicon glyphicon-log-in" ></span> Administración </a></li>
                            
                            <?php }?>
                            <li><a href="<?php echo base_url('/logout'); ?>"><span class="glyphicon glyphicon-log-out" ></span> Cerrar Sesión </a></li>
                            
                        </ul>
                        </li>
                <?php        
                    }else{
                ?> 
                        <li><a id="liveclock"></a></li>
                        <li><a href="<?php echo base_url('/login')?>">Iniciar Sesión</a></li>
                <?php         
                    }
                ?>

            
            </ul>
            
            
            </div><!-- /.navbar-collapse -->

        </div><!-- /.container-fluid -->
    </nav>

    <div id="menu_circle">
        <div class='selector'>
            <ul>
                

                <li onclick="location.href='?action=ordenPedidoVehiculo';" >
                    <input id='opcion2' type='checkbox' />
                    <label for='opcion2' title="Orden de Pedido del Vehiculo"><i class="fa fa-car fa-3x" aria-hidden="true"></i></i></label>   
                </a>
                </li>

                <li onclick="location.href='?action=inventario';" >
                    <input id='opcion3' type='checkbox' />
                    <label for='opcion3' title="INVENTARIO"><i class="fa fa-cubes fa-3x" aria-hidden="true"></i></i></label>   
                </a>
                </li>

            </ul>
            <button id='center_logo'></button>
            
        </div>
    </div>
      
    
  </body>

    <script src="assets\js\libs\jquery.min.js"></script>
    <script src="assets\js\libs\bootstrap.min.js"></script>
    <script src="assets\js\libs\moment.min.js"></script>
    <script src="assets\js\pages\inicio.js?<?php echo date('Ymdhiiss')?>"></script>

</html>


