<?= $this->extend('layouts/inicioTemplate') ?>

<?= $this->section('css')?>
    <link rel="stylesheet" href="assets\css\circlemenu.css"> 
<?= $this->endSection()?>


<?= $this->section('contenido')?>
    <!--Inicio Contenido -->
    <?= $this->include('sys_modules/navbar') ?>

    <div id="menu_circle">
        <div class='selector'>
            <ul>
                <!-- <li onclick="location.href='<?= base_url('/inventario'); ?>';" >
                    <input id='opcion2' type='checkbox' />
                    <label for='opcion2' title="Orden de Pedido del Vehiculo"><i class="fa fa-car fa-3x" aria-hidden="true"></i></i></label>   
               
                </li> -->

                <li onclick="location.href='<?= base_url('/inventario'); ?>';" >
                    <input id='opcion3' type='checkbox' />
                    <label for='opcion3' title="INVENTARIO"><i class="fa fa-cubes fa-3x" aria-hidden="true"></i></i></label>   
                </li>

            </ul>
            <button id='center_logo'></button>
            
        </div>
    </div>

    
    

    <!--Fin Contenido -->
<?= $this->endSection()?>

<?= $this->section('js')?>
    <script src="assets\js\pages\inicio.js?<?php echo date('Ymdhiiss')?>"></script>
<?= $this->endSection()?>
    

    

  
   



