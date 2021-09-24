<!-- Modal -->
<div class="modal" id="modal_info_sesion" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Información de Sesión</h4>
      </div>
      <div class="modal-body">

        <div class="panel panel-default">
            <div class="panel-heading">Conexion por defecto</div>
            <div class="panel-body">
            <?php echo session('codedatabase')?>
            <?php echo session('codigo') ?>
            </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>