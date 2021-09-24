<!-- Modal -->
<div class="modal fade" id="modal_ayuda_actualizarCostoProducto" tabindex="-1" role="dialog" >
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Ayuda</h4>
      </div>
      <div class="modal-body">
        <p>Considerar los siguientes aspectos para una carga correcta de los artículos, el archivo excel debe cumplir con lo siguiente:</p>
        <ol>
        <li>El archivo puede tener varias hojas, pero se leerá la primera hoja unicamente para la carga de productos. Asegúrese de que la primera hoja de su archivo sea el listado de productos a actualizar.</li>
        <li>Debe tener una sola columna "CODIGO" en mayusculas el mismo que indica el codigo del producto en Winfenix.</li>
        <li>Debe tener una sola columna "PRECIOSIN" en mayusculas el mismo que indica el nuevo precio del producto.</li>
        <li> Pueden existir otras columnas, pero las columnas obligatorias son CODIGO y PRECIOSIN.</li>

          
        </ol>

        <img src="<?= base_url().AYUDA_ACTUALIZAR_PRECIOS_PRODUCTOS?>" class="img-fluid">
        <a class="btn btn-success btn-block" href="<?= base_url().PLANTILLA_ACTUALIZAR_PRECIOS_PRODUCTOS; ?>" role="button">
        <i class="fa fa-download" aria-hidden="true"></i>    
        Descargar Plantilla de Ejemplo</a>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>