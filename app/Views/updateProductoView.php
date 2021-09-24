<?= $this->extend('layouts/basetemplate') ?>

<?= $this->section('css')?>
    <link rel="stylesheet" href="<?=base_url()?>/assets/css/admin.css">
<?= $this->endSection()?>

<?= $this->section('contenido')?>
  
    <div class="container-fluid">
        <form id="app" v-on:submit.prevent="saveProducts">
            
            <ol class="breadcrumb">
                <li><a href="?action=inicio">Inicio</a></li>
                <li>Inventario</li>
                <li> {{ title }} </li>
            </ol>
            
            <?php
        
        ?>

            <div class="container-fluid wrap" style="padding: 20px 15px 20px 15px; border-radius: 5px;">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <strong>Carga de archivo Excel</strong>
                                
                                <div class="btn-group pull-right">
                                    <a class="btn btn-primary btn-sm btn-xsm" data-toggle="modal" data-target="#modal_ayuda_actualizarCostoProducto">
                                        Ayuda
                                        <i class="fa fa-question-circle" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="panel-body">

                                <div class="progress">
                                    <div class="progress-bar progress-bar active" role="progressbar"
                                    :aria-valuenow="porcentajeCargaActual" aria-valuemin="0" aria-valuemax="100" :style="{ width: porcentajeCargaActual + '%' }">
                                        {{ porcentajeCargaActual }} %
                                    </div>
                                </div>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-addon">Seleccione el archivo excel a cargar:</span>
                                    <input type="file" name="excelFile" id="excelFile" @change="validateExcelFile" class="form-control" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                </div>
                        
                                

                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <strong>Seleccione empresas</strong>
                            </div>
                            <div class="panel-body">
                                <label class="checkbox-inline" v-for="database in databases">
                                    <input 
                                        type="checkbox"
                                        @click="checkDataBases(database)" 
                                        :value="database.dbname.trim()"> {{ database.nombre.trim() }}
                                </label>
                                
                            </div>
                        </div>
                    </div>
                </div>


                <!-- items en lista -->

                <div class="row">
                    <div class="col-md-12">

                        <div class="panel panel-warning" v-if="advertencias.length > 0 ">
                            <div class="panel-heading">Advertencias </div>
                            <div class="panel-body">
                                <ul>
                                    <li v-for="advertencia in advertencias">
                                        {{ advertencia }}
                                    </li>
                                </li>
                            </div>
                        </div>

                        <div class="panel panel-default">
                            <!-- Default panel contents -->
                        
                            <div class="panel-heading">
                                <strong>Lista de Items:  {{ documento.productos.length || 0 }} </strong>
                                
                            </div>

                            <div class="panel-body">
                                <div class="table-responsive">        
                                    <table class="table table-bordered tableExtras">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%; min-width: 110px;" class="text-center headerTablaProducto">Codigo</th>
                                                <th style="width: 40%; min-width: 300px;" class="text-center headerTablaProducto">Nombre del Articulo</th>
                                                <th style="width: 10%;" class="text-center headerTablaProducto">Precio Actual</th>
                                                <th style="width: 10%;" class="text-center headerTablaProducto">Nuevo Precio</th>
                                                <th style="width: 10%;" class="text-center headerTablaProducto">Variación</th>
                                                <th style="width: 10%;" class="text-center headerTablaProducto">% Variacion</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tablaProductos">
                                            <tr v-for="producto in documento.productos">
                                                <td><input type="text" class="form-control text-center input-sm"  v-model="producto.codigo" readonly></td>
                                                <td><input type="text" class="form-control text-center input-sm"  v-model="producto.nombre" readonly></td>
                                                <td><input type="text" class="form-control text-center input-sm"  v-model="producto.precio" readonly></td>
                                                <td><input type="number" step="0.01" class="form-control text-center input-sm"  v-model="producto.nuevoPrecio" ></td>
                                                <td><input type="text" class="form-control text-center input-sm"  v-model="producto.getValorVariacion()" readonly></td>
                                                <td><input type="text" class="form-control text-center input-sm"  v-model="producto.getPorcentajeVariacion()" readonly></td>
                                                </td>
                                            </tr>
                                        </tbody>
                                        
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row extraButton">
                    <div class="col-md-12">
                        <div class="btn-group btn-group-justified" role="group" aria-label="...">
                        

                            <div class="btn-group" role="group">
                                <button type="submit" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span> Registrar</button>
                            </div>

                            <div class="btn-group" role="group">
                                <button type="button" @click="cancelSubmit()" class="btn btn-danger btn-lg" id="btnCancel"><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span> Cancelar</button>
                            </div>
                    
                        </div>
                    </div>
                </div>    

            </div>

            

            <!-- Modal Info sesion -->
            
            <!-- Modal de Ayuda -->
            

        </form>
    </div>   
           
<?= $this->endSection()?>

<?= $this->section('js')?>
    <script src="<?=base_url()?>/assets/js/pages/inicio.js?<?php echo date('Ymdhiiss')?>"></script>
    <script src="<?=base_url()?>/assets/js/pages/actualizarPreciosProductos.js?<?php echo date('Ymdhiiss')?>"></script>

    
<?= $this->endSection()?>
    

    

  
   



