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

    <?= $this->renderSection('css') ?>

    <!-- CSS Paginas -->
    <title><?php echo APP_NAME; ?></title>

  </head>
  <body>
    <?= $this->include('sys_modules/navbar') ?>
    <?= $this->renderSection('contenido') ?>

    <script type="text/javascript" src="assets\js\libs\vue.js"></script>
    <script type="text/javascript" src="assets\js\libs\jquery.min.js"></script>
    <script type="text/javascript" src="assets\js\libs\bootstrap.min.js"></script>
    <script type="text/javascript" src="assets\js\libs\moment.min.js"></script>
    <?= $this->renderSection('js') ?>
  </body>
</html>
