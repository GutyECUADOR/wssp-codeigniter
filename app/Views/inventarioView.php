<?= $this->extend('layouts/basetemplate') ?>

<?= $this->section('css')?>
    <link rel="stylesheet" href="assets\css\admin.css">
<?= $this->endSection()?>

<?= $this->section('contenido')?>
  
    <div class="container-fluid">
    <h2>Módulo de Inventario</h2>
    
    <div class="row">
        <div class="col-md-4">
        <div class="card">
            <div class="card-body">
            <h4 class="card-title">Actualizacion de Precios</h4>
            <h6 class="card-subtitle mb-2 text-muted">Inventario</h6>
            <p class="card-text">Permite la actualizacion de precios de los articulos de Winfenix mediante una plantilla Excel.</p>
            <a href="#" class="btn btn-primary" role="button">Ir al Formulario</a>
            </div>
        </div> 
        </div> <!-- end col -->
        

        
    </div>
        
    
    </div>    
           
<?= $this->endSection()?>

<?= $this->section('js')?>
    <script src="assets\js\pages\inicio.js?<?php echo date('Ymdhiiss')?>"></script>
<?= $this->endSection()?>
    

    

  
   



