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