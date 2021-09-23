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
    
      <a class="navbar-brand" href="#" style="padding:10px">
        <button type="button" class="btn btn-sm" href="#menu-toggle" id="menu-toggle"><i class="fa fa-bars"></i></button>
      </a>
      
      
    </div>

    
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">  
        <li><a href="?action=inicio"><i class="fa fa-home" aria-hidden="true"></i></i> Inicio</a></li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        <?php
              if (isset($_SESSION["usuarioRUC"])){
        ?> 
              
                <li><a id="liveclock"></a></li>
                <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-user" aria-hidden="true"></i></i> Bienvenido, <?php echo $_SESSION["usuarioNOMBRE".APP_UNIQUE_KEY] ?><span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <?php if ($_SESSION["usuarioNOMBRE"] == 'SUPERUSUARIO') {
                      
                    ?>
                    <li><a href="?action=admin"><span class="glyphicon glyphicon-log-in" ></span> Administración </a></li>
                    
                    <?php }?>
                    <li><a href="?action=logout"><span class="glyphicon glyphicon-log-out" ></span> Cerrar Sesión </a></li>
                    
                  </ul>
                </li>
        <?php        
            }else{
              echo '
              
                <li><a id="liveclock"></a></li>
                <li><a href="?action=logout">Iniciar Sesión</a></li>
              ';
            }
        ?>

       
      </ul>
      
      
    </div><!-- /.navbar-collapse -->

  </div><!-- /.container-fluid -->
</nav>