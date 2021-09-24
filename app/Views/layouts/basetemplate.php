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
    
    <link rel="shortcut icon" href="<?=base_url()?>/assets/img/favicon.ico">

    <!-- CSS Bootstrap -->
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/bootstrap.min.css">
    
    <!-- Librerias-->
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/bootstrap-datepicker.css">
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/sweetalert.css" />

    <!-- CSS Propios -->
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/loaders.css">
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/pnotify.custom.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/custom.css?<?php echo date('Ymdhiiss')?>">
    

    <?= $this->renderSection('css') ?>

    <!-- CSS Paginas -->
    <title><?php echo APP_NAME; ?></title>

  </head>
  <body>
    
    <div id="wrapper">  
        <!-- Sidebar -->
        <?= $this->include('sys_modules/sidebar') ?>

        <!-- Page Content -->
        <div id="page-content-wrapper">
        <?= $this->include('sys_modules/navbar-toggle') ?>

          <?= $this->renderSection('contenido') ?>
                
            </div>    
            <!-- container-fluid -->
        </div>
        <!-- /#page-content-wrapper -->

        
        
    </div>

   

    <script type="text/javascript" src="<?=base_url()?>/assets/js/libs/vue.js"></script>
    <script type="text/javascript" src="<?=base_url()?>/assets/js/libs/jquery.min.js"></script>
    <script type="text/javascript" src="<?=base_url()?>/assets/js/libs/bootstrap.min.js"></script>
    <script type="text/javascript" src="<?=base_url()?>/assets/js/libs/moment.min.js"></script>
    <?= $this->renderSection('js') ?>
  </body>
</html>
