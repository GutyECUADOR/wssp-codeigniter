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
      <link rel="stylesheet" type="text/css" href="assets\css\sweetalert.css" />

      <!-- CSS Propios -->
      
      <link rel="stylesheet" href="assets\css\loaders.css">
      <link rel="stylesheet" href="assets\css\pnotify.custom.min.css">

      <!-- Custom CSS -->
      <link rel="stylesheet" href="assets\css\custom.css?<?php echo date('Ymdhiiss')?>">
      <link rel="stylesheet" href="assets\css\signin.css">
      <link rel="stylesheet" href="assets\css\sticky-footer-navbar.css">
       
      <!-- CSS Paginas -->

      <title><?php echo APP_NAME; ?></title>

  </head>

  <body>
    
    <div class="container">          
   
    

        <div class="col">
            <div class="row">
                <?php 
                    echo form_open('loginController/checklogin', 'class="form-signin"  autocomplete="off"  class="formulario" name="formulario_registro"');
                ?>
                    <div class="text-center">
                        <img style="max-width: 75%;" src="<?php echo LOGO_NAME?>" alt="Logo">
                    </div>
                    
                
                    <h2 class="form-signin-heading text-center"><?php echo APP_NAME?></h2>

                    <div class="alert alert-info text-center">
                        <strong>Recuerde</strong>, siempre borrar datos de navegacion antes de ingresar al aplicativo.
                    </div>

                    <?php if (session('message')): ?>
                        <div class="alert alert-danger text-center">
                           <?= session('message') ?>
                        </div>
                    <?php endif; ?>
                    

                    <?php  ?>
                    <input type="hidden" name="preaction" value="<?php echo isset($_GET['preaction']) ? $_GET['preaction'] : ''?>">
                    
                    <select class="form-control" name="empresa" id="empresa" required autofocus>
                        <option value=''>Seleccione Empresa</option>
                        <?php
                            foreach ($databases as $database) {
                                echo "<option value='$database->dbgroup'>$database->nombre</option>";
                            }
                        ?>
                    
                    </select>
                    
                    <input type="text" class="form-control" name="usuario" id="inputuser" maxlength="30" placeholder="Usuario del Sistema o RUC" value="<?= old('usuario') ?>" required>
                    <input type="password" class="form-control" name="password" id="inputpass" placeholder="Contraseña" maxlength="50"  value="<?= old('password') ?>" required >
                
                    <div class="btn-group btn-group-justified" role="group" aria-label="...">
                        
                        <div class="btn-group" role="group">
                            <button type="submit" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-log-in" ></span> Ingresar</button>
                        </div>

                        <div class="btn-group" role="group">
                            <a href="<?php echo base_url().'/'?>" class="btn btn-danger btn-lg"><span class="glyphicon glyphicon-back"></span> Regresar</a>
                        
                        </div>
                    
                        </div>
                
                </form>
            </div>
        </div>      

        </div> <!-- /container -->

        <footer class="footer">
        <div class="container">
            <p class="text-muted">Derechos reservados © 2017 - <?php echo date("Y")?>, Ver <?php echo APP_VERSION ?></p>
        </div>
        </footer>
    
    </div>

      
    
  </body>
</html>


