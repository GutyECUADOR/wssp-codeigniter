class Cotizacion {
    constructor() {
        this.cliente = null,
        this.bodega = null,
        this.localidadEnvio = null,
        this.productos = [],
        this.formaPago = 'CON',
        this.codDestinoEnvio = null,
        this.requiereEnvio = false,
        this.precioEnvio = 0,
        this.pesoEnvio = 0,
        this.comentario = 'proforma'
    }

    
    sumarKey(propiedad) {
        return this.productos.filter(({tipoArticulo}) => tipoArticulo == '1')
            .reduce( (total, producto) => {
            return total + producto[propiedad];
        }, 0);
    }

    
    /* Subtotal General*/

    getTotalFactura(){
        return this.productos.reduce( (total, producto) => { 
            return total + producto.getSubtotal(); 
        }, 0); 
    }

    getIVAFactura(){
        return this.productos.reduce( (total, producto) => { 
            return total + producto.getIVA(); 
        }, 0); 
    }

    getDescuentoProductos(){
        return this.productos.reduce( (total, producto) => { 
            return total + producto.getDescuento(); 
        }, 0); 
    }

    getPesoProductos(){
        return this.productos.reduce( (total, producto) => { 
            return total + producto.getPeso(); 
        }, 0); 
    }

  /* Subtotal de productos */
    getSubTotalProductos(){
        return this.productos.filter(({tipoArticulo}) => tipoArticulo == '1')
        .reduce( (total, producto) => { 
        return total + producto.getSubtotal(); 
        }, 0); 
    }

    getIVAProductos(){
        return this.productos.filter(({tipoArticulo}) => tipoArticulo == '1')
        .reduce( (total, producto) => { 
        return total + producto.getIVA(); 
        }, 0); 
    }

    getTotalProductos(){
        return this.getSubTotalProductos() + this.getIVAProductos();
    }

    /* Subtotal de envio */
    getSubTotalEnvio(){
        return this.productos.filter(({tipoArticulo}) => tipoArticulo == '5')
        .reduce( (total, producto) => { 
        return total + producto.getSubtotal(); 
        }, 0); 
    }

    getIVAEnvio(){
        return this.productos.filter(({tipoArticulo}) => tipoArticulo == '5')
        .reduce( (total, producto) => { 
        return total + producto.getIVA(); 
        }, 0); 
    }

    getTotalEnvio(){
        return this.getSubTotalEnvio() + this.getIVAEnvio();
    }

    getTotalSeguroEnvio(){
        return (this.getSubTotalProductos() + this.getIVAProductos() ) * 0.01;
    }

}

class Cliente {
    constructor(RUC, nombre, email, telefono, vendedor, tipoPrecio, diasPago, formaPago) {
      this.RUC = RUC;
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.vendedor = vendedor;
      this.tipoPrecio = tipoPrecio;
      this.diasPago = diasPago;
      this.formaPago = formaPago;
      
    }

    getTipoPrecio() {
        return + this.tipoPrecio;
    }
}

class Producto {
    constructor(codigo, nombre, tipoArticulo, cantidad, precio, peso, descuento, stock, tipoIVA, valorIVA) {
      this.codigo = codigo;
      this.nombre = nombre;
      this.tipoArticulo = tipoArticulo
      this.cantidad = cantidad;
      this.precio = precio;
      this.peso = parseFloat(peso);
      this.descuento = descuento;
      this.stock = stock;
      this.tipoIVA = tipoIVA;
      this.valorIVA = parseFloat(valorIVA);
      this.vendedor = null;
      this.descripcion = null;
      this.archivos = null;
     
    }

    getIVA(){
        return (this.getSubtotal() * this.valorIVA) / 100;
    }

    getDescuento(){
        return ((this.cantidad * this.precio)* this.descuento)/100;
    }

    getPeso(){
        return this.peso *this.cantidad;
    }

    getSubtotal(){
        return (this.cantidad * this.precio) - this.getDescuento(this.descuento);
    }

    setDescripcion(descripcion){
        this.descripcion = descripcion;
    }
}

class NuevoCliente {
    constructor(RUC, tipoIdentificacion, nombre, grupo, tipo, email, canton, direccion, telefono, vendedor) {
        this.RUC = RUC;
        this.tipoIdentificacion = tipoIdentificacion
        this.nombre = nombre;
        this.grupo = grupo;
        this.tipo = tipo;
        this.email = email;
        this.canton = canton;
        this.direccion = direccion;
        this.telefono = telefono;
        this.vendedor = vendedor;
    }
}

const app = new Vue({
    el: '#modalBuscarDestino',
    data: {
      titulo: 'Indique detalles del Envio por Tramaco',
      localidad: {
          provincia: '',
          canton: '',
          parroquia: '',
          codigoDestino: '',
          callePrimaria: '',
          calleSecundaria: '',
          numero: '',
          referencia: '',
          telefono: '',
          codigoPostal: '',
          observaciones: ''
      }
    }
    
})


$(document).ready(function() {

    // Documento listo
    disableEnter();
    startJSBoostrap();
    //getProvinciasTramaco();
    
    var cotizacion = new Cotizacion();
    var newProducto = null;
    var promocion = null;
    var nuevoIDDocumentGenerated = null;

    $("#testButton").on("click", function(event) {
        Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
    });

    
    
    $("#inputRUC").on("keyup change", function(event) {
        let ruc = $(this).val();
        let bodegaDefault = $('#hiddenBodegaDefault').val();

        if (ruc) {
            validaCliente(ruc).done(function (response) {
                let cliente = response.data;
                if (response.data) {
                    const myCliente = new Cliente(cliente.RUC, cliente.NOMBRE, cliente.EMAIL, cliente.TELEFONO, cliente.VENDEDOR, cliente.TIPOPRECIO, cliente.DIASPAGO, cliente.FPAGO);
                    cotizacion.cliente = myCliente;
                    cotizacion.bodega = bodegaDefault;
                    checkFormasPago();
                    printDataCliente(cliente);
                } else {
                    clearDataCliente();
                }
            });
        }else{
            clearDataCliente();
        }

        
        console.log(cotizacion);
    });
    
    $("#modalBuscarDestino").on('shown.bs.modal', function(){
        let peso = cotizacion.getPesoProductos();
        app.localidad.codigoDestino = '';
        app.localidad.provincia = '';
        app.localidad.canton = '';
        app.localidad.parroquia = '';
        $("#infopesocalculo").html(peso);
    });

    $("#envioProvincia").on("change", function(event) {
        let provincia = $(this).val()
        console.log(provincia);
        getCantonesTramaco(provincia);
    });

    $("#envioCanton").on("change", function(event) {
        let canton = $(this).val()
        console.log(canton);
        getParroquiasTramaco(canton);
    });

    $("#envioParroquia").on("change", function(event) {
        
        let provincia = $("#envioProvincia").val();
        let canton = $("#envioCanton").val();
        let parroquia = $("#envioParroquia").val();
    
        getCodigoEnvio(provincia, canton, parroquia).done(function (response) {
            let codParroquiaDest = response.data.CODIGO_TMC;
            let peso = cotizacion.getPesoProductos();
            $("#codigoEnvio_detalle").val(codParroquiaDest);
            cotizacion.codDestinoEnvio = codParroquiaDest;
            app.localidad.codigoDestino = codParroquiaDest;

            if (codParroquiaDest) {
                validaCostoEnvio(codParroquiaDest, peso).done(function (response) {
                    let precioTramaco = response.envioTramaco;
                    let precioKAO = response.envioKAO;

                    if (precioTramaco && precioKAO) { 
                        cotizacion.precioEnvio = precioKAO;
                        cotizacion.pesoEnvio = cotizacion.getPesoProductos();
                        $("#txt_valortramaco_envio").val(precioKAO);

                        new PNotify({
                            title: 'Realizado',
                            text: `Costo de envio definido por KAO $ ${precioKAO}`,
                            delay: 3000,
                            type: 'success',
                            styling: 'bootstrap3'
                        });
                    
                        
                    }else{
                       
                        alert(`Error al consultar costo de envio, informe a administracion. ${response.cuerpoRespuesta.excepcion} `);
                    }
                });
            }else{
                alert('No se pudo encontrar el codigo de envio');
            }
            

        });

    });

    


    $("#RUCnuevoCliente").on("change", function(event) {
        let ruc = $(this).val();
        if (ruc) {
            validaClienteNuevo(ruc).done(function (response) {
                let cliente = response.data;
                if (cliente) { 
                    alert(`La cedula o RUC: ${cliente.RUC} ya existe para el cliente: ${cliente.NOMBRE}`);
                }
            });
        }

    });

    $("#searchClienteModal").on('click', function(event) {
        event.preventDefault();
        
        let terminoBusqueda = $('#terminoBusquedaModalCliente').val();
        let tipoBusqueda = $('#tipoBusquedaModalCliente').val(); 
        if (terminoBusqueda.length > 0) {
            buscarClientes(terminoBusqueda, tipoBusqueda).done(function (response) {
                let clientes = response.data;
                printBusquedaClientes(clientes);
            });
        }else{
            alert('Indique un termino de busqueda');
        }
        
    });
    
    
    $("#btnGuardarNuevoCliente").on('click', function (event) {
        event.preventDefault();
       
        let ruc = $("#RUCnuevoCliente").val();
        let tipoIdentificacion = $("#tipoIdentificacion").val();
        let nombre = $("#nombreCliente").val();
        let grupo = $("#grupoCliente").val();
        let tipo = $("#tipoCliente").val();
        let email = $("#emailCliente").val();
        let canton = $("#cantonCliente").val();
        let direccion = $("#direccionCliente").val();
        let telefono = $("#telefonoCliente").val();
        let vendedor = $("#vendedorCliente").val();

        switch (tipoIdentificacion) {
            case 'R':
                let reg_ruc = /^([0-9]){13}$/;  
                if (!reg_ruc.test(ruc)) {
                    alert('El RUC del nuevo cliente no cumple el formato esperado, 13 digitos.');
                    return false;
                }
                break;

            case 'P':
                    let reg_pass = /^([0-9]){3,13}$/;  
                    if (!reg_pass.test(ruc)) {
                        alert('El Pasporte del nuevo cliente no cumple el formato esperado, minimo 3 digitos maximo 13');
                        return false;
                    }
                    break;
        
            default:
                let reg_cedula = /^([0-9]){10}$/;  
                if (!reg_cedula.test(ruc)) {
                    alert('La cedula del nuevo cliente no cumple el formato esperado, 10 digitos');
                    return false;
                }
                break;
        }

        /* INICIO VALIDACIONES */
       

        let reg_nombre = /^[a-zA-Z]+(\s*[a-zA-Z]*)*[a-zA-Z]+$/; 
        if (!reg_nombre.test(nombre)) {
            alert('El nombre del nuevo cliente no cumple el formato esperado, no se admiten ACENTOS ni Ñ');
            return false;
        }

        let reg_email = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        if (!reg_email.test(email)) {
            alert('El correo del nuevo cliente no es valido');
            return false;
        }

        


        /* FIN VALIDACIONES */



        if (ruc && nombre && grupo && email && telefono && vendedor) {
           
            let nuevoCliente = new NuevoCliente(ruc, tipoIdentificacion, nombre, grupo, tipo, email, canton, direccion, telefono, vendedor);
            console.log(nuevoCliente);
            let nuevoClienteJSON = JSON.stringify((nuevoCliente));
            
            validaClienteNuevo(ruc).done(function (response) {
                let cliente = response.data;
                if (cliente === false) { // No existe el cliente
                    new PNotify({
                        title: 'Espere...',
                        text: 'Registrando nuevo cliente',
                        delay: 2000,
                        type: 'info',
                        styling: 'bootstrap3'
                    });
                    saveNuevoCliente(nuevoClienteJSON);
                }else{
                    alert(`La cedula o RUC: ${cliente.RUC} ya existe para el cliente: ${cliente.NOMBRE}`);
                }
            });

           
        }else{
            alert('Complete todos los campos para realizar el registro.');
        }
      
    });

    $("#formaPago").on('change', function (event) {
        if ($(this).val()=='CRE') {
            $("#condicionPago").val('EFE'); 
            $("#condicionPago").prop("disabled", true); 

        }else if ($(this).val() == 'CON'){
            $("#condicionPago").prop("disabled", false); 
        }

        cotizacion.formaPago = $(this).val();
        let codPromo = $('#inputNuevoProductoCodProm').val();
        let formaPago = $('#condicionPago').val();

        if (newProducto != null) {
            validaDescuento(codPromo, formaPago).done(function (response) {
                let porcentPromo = parseInt(response.data.PORCEN) || 0;
                newProducto.descuento = porcentPromo;
                printDataProducto(newProducto, promocion);
            });
        }
    });

    $("#condicionPago").on('change', function (event) {
        let codPromo = $('#inputNuevoProductoCodProm').val();
        let formaPago = $('#condicionPago').val();

        if (newProducto != null) {
            validaDescuento(codPromo, formaPago).done(function (response) {
                let porcentPromo = parseInt(response.data.PORCEN) || 0;
                newProducto.descuento = porcentPromo;
                printDataProducto(newProducto, promocion);
            });
        }
        
    });

    $("#vendedorCliente").on('keyup change', function (event) {
        let codVendedor = $(this).val();
        
        validaCodigoVendedor(codVendedor).done(function (response) {
            let vendedor = response.data;
            printVendedor(vendedor);
        });
       
    });

    
    
    $("#searchProductoModal").on('click', function(event) {
        event.preventDefault();
        if (cotizacion.cliente == null) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Indique un cliente antes de agregar productos.',
              })
            return;
        }

        let terminoBusqueda = document.getElementById("terminoBusquedaModalProducto").value;
        let tipoBusqueda = document.getElementById("tipoBusquedaModalProducto").value;
        console.log(terminoBusqueda);
        
        buscarProductos(terminoBusqueda, tipoBusqueda).done(function (response) {
            let productos = response.data;
            printBusquedaProductos(productos);
        });

        
        
    });

    
    $("#tblResultadosBusquedaClientes").on('click', '.btnSeleccionaCliente', function(event) {
        event.preventDefault();
        let ruc = $(this).data("codigo"); 
        let bodegaDefault = $('#hiddenBodegaDefault').val();
        $("#inputRUC").val(ruc);

        validaCliente(ruc).done(function (response) {
            let cliente = response.data;
            if (response.data) {
                const myCliente = new Cliente(cliente.RUC, cliente.NOMBRE, cliente.EMAIL, cliente.TELEFONO, cliente.VENDEDOR, cliente.TIPOPRECIO, cliente.DIASPAGO, cliente.FPAGO);
                cotizacion.cliente = myCliente;
                cotizacion.bodega = bodegaDefault;
                checkFormasPago();
                printDataCliente(cliente);
            } else {
                clearDataCliente();
            }
        });
        
        $('#modalBuscarCliente').modal('hide');
    });


   
    $("#tblResultadosBusquedaProductos").on('click', '.btnSeleccionaProducto', function(event) {
        event.preventDefault();
        let codProducto = $(this).data("codigo"); 
        $("#inputNuevoCodProducto").val(codProducto);
        let codPromo = $('#inputNuevoProductoCodProm').val();
        let formaPago = $('#condicionPago').val();
        let clienteRUC = $('#inputRUC').val();
        
     
        validaProducto(codProducto, clienteRUC, codPromo, formaPago);
        $('#modalBuscarProducto').modal('toggle'); 
        

        
    });
    


    // Boton de envio de datos
    $("#btnGuardar").on('click', function(event) {
        event.preventDefault();
       
        if (cotizacion.cliente != null && cotizacion.productos.length > 0) {
            let cotizacionJSON = JSON.stringify((cotizacion));
            console.log('Guardando:', cotizacion);
            saveData(cotizacionJSON);
        
        
        }else{
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El formulario esta incompleto indique cliente y al menos un producto',
                footer: 'Si el problema persiste, informe a sistemas.'
                })
        }

        
       
        
    });

    // Boton de envio de datos
    $("#btnCancel").on('click', function(event) {
        event.preventDefault();
        alert('No se ha registrado el documento.');
        location.reload();
    });

     // Boton de envio de datos
     $("#btnAddEnvio").on('click', function(event) {
        event.preventDefault();
        if (cotizacion.productos.length >= 1) {
            $('#modalBuscarDestino').modal('show');
        }else{
            Swal.fire({
                type: 'warning',
                title: 'Sin productos',
                text: 'Agregue al menos 1 producto y su peso para agregar envio'
            })
        }
      
      
    });

    // Boton remover fila de tabla productos
    $("#tablaProductos").on('click', '.btnEliminaRow', function(event) {
        let codProdToDelete = $(this).data("codigo"); // Obtenemos el campo data-value custom
        deleteProductToList(codProdToDelete);
        let objectResumen = resumenProdutosInList();
        printResumen(objectResumen);
    });

    // Boton remover fila de tabla productos
    $("#tablaEnvio").on('click', '.btnEliminaRow', function(event) {
        $("#txt_valortramaco_envio").val(0);
        let codProdToDelete = $(this).data("codigo"); // Obtenemos el campo data-value custom
        deleteProductToList(codProdToDelete);
        let objectResumen = resumenProdutosInList();
        printResumen(objectResumen);
    });

    // Caja de texto de producto nuevo
    $("#inputNuevoCodProducto").on('keyup change', function(event) {
       
        if (cotizacion.cliente == null) {
           
            Swal.fire({
            type: 'warning',
            title: 'Sin cliente',
            text: 'Indique un cliente antes de agregar productos',
            footer: 'Indique una cedula o RUC valido y registrado.'
            })

            $('#inputNuevoCodProducto').val('');
            $('#inputRUC').focus();
            $('#modalBuscarCliente').modal('show');
            resetnewProducto();
            return;
        }

        let codProducto = $('#inputNuevoCodProducto').val();
        let clienteRUC = $('#inputRUC').val();
        let codPromo = $('#inputNuevoProductoCodProm').val();
        let formaPago = $('#condicionPago').val();

        if (codProducto.length > 0) {
            if (codProducto.toUpperCase()=='TTR-01') {
                return; // No se puede agregar TTR directamente
            }
            validaProducto(codProducto, clienteRUC, codPromo, formaPago);
        }else{
            resetnewProducto();
        }
        
       

    });

    $("#btnDetallePromo").on('click', function (event) {
        let codPromo = document.getElementById('inputNuevoProductoCodProm').value;
        
        if (codPromo) {
            $('#modalDetallePromo').modal('show');
            validaPromo(codPromo);
        }else{
           
            Swal.fire({
                type: 'warning',
                title: 'Sin promocion',
                text: 'No se ha encontrado un codigo de promocion para este producto..'
                })
            return;
        }
    });

    // Caja de texto de producto nuevo
    $("#btnAgregarProdToList").on('click', function(event) {
        let existeInArray = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo == 'TTR-01';
        });

        if (existeInArray != -1){  // Verificamos si ya se agrego TTR de envio
            Swal.fire({
                type: 'warning',
                title: 'Ya se agregado costo de envio.',
                text: 'Elimine costo de envio (TTR). Para recalcular costo de envio con los nuevos items en lista. No olvide agregar el peso respectivo.'
            });
    
            return;
        }
       

       if (newProducto != null) {
           
            //Get content of tinimce and reset
            let text = tinyMCE.get('extraDetailContent').getContent();
            newProducto.descripcion = text;
            newProducto.vendedor = cotizacion.cliente.vendedor;

            addProductToList(newProducto);
                
            printProductos(cotizacion.productos);
            let objectResumen = resumenProdutosInList();
            printResumen(objectResumen);
            

            console.log(cotizacion);
       }else{
         
           Swal.fire({
            type: 'warning',
            title: 'Codigo de producto invalido',
            text: 'No hay producto que agregar a la lista'
          });
           
       }

    });

    // Caja de texto de producto nuevo
    $("#btnAgregarEnvioToList").on('click', function(event) {
        
       
        let clienteRUC = $('#inputRUC').val();
        let codPromo = $('#inputNuevoProductoCodProm').val();
        let formaPago = $('#condicionPago').val();
        
        validaProducto("TTR-01", clienteRUC, codPromo, formaPago);
        console.log(cotizacion);
      

       
     });

     // Caja de texto de producto nuevo
    $("#btntest").on('click', function(event) {
        app.localidad.codigoDestino = '899';
        app.localidad.ruc = '1600505505';
        console.log(JSON.stringify(app.localidadEnvio));
       
     });

    /* Multiplica la cantidad del producto a añadir a la lista*/
    $("#inputNuevoProductoCantidad").on('keyup change', function(event) {
        let nuevacantidad = $(this).val() || 0;
        console.log(nuevacantidad);
        if (newProducto != null) {
            newProducto.cantidad = parseInt(nuevacantidad);
            printSubtotalNewProd();
        }
 
     });

    /* Multiplica el precio del producto a añadir a la lista*/
    $("#inputNuevoProductoPrecioUnitario").on('keyup change', function(event) {
        let nuevoPrecio = $(this).val() || 0;
        console.log(nuevoPrecio);
        if (newProducto != null) {
            newProducto.precio = parseFloat(nuevoPrecio);
            printSubtotalNewProd();
        }
 
     });

    /* Establece el valor del descuento del producto a agregar*/
    $("#inputNuevoProductoDescuento").on('change', function(event) {
        let nuevodescuento = $(this).val();
        //console.log(nuevodescuento);
        if (newProducto != null) {
            newProducto.descuento = nuevodescuento;
            //console.log(newProducto.getDescuento(nuevodescuento));
            printSubtotalNewProd();
        }
        
 
     });
    

    // Evento de calculo de productos extra
    $("#tablaProductos").on('change', '.rowcantidad', function(event) {
        let codProducto = $(this).data('codigo'); 
        let cantidad = $(this).val() || 0; 

        let existeInArray = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo == 'TTR-01';
        });

        if (existeInArray != -1){  // Verificamos si ya se agrego TTR de envio
            Swal.fire({
                type: 'warning',
                title: 'Ya se agregado costo de envio.',
                text: 'Elimine costo de envio (TTR). Para recalcular costo de envio con los nuevos items en lista. No olvide agregar el peso respectivo.'
            });
           
            return;
        }
       
      
        updateCantidadProducto(codProducto, cantidad);
    });

    $("#tablaProductos").on('change', '.rowpeso', function(event) {
        let codProducto = $(this).data('codigo'); 
        let peso = parseFloat($(this).val()) || 0; 
        updatePesoProducto(codProducto, peso);
    });

    $("#tablaProductos").on('change', '.rowvendedor', function(event) {
        let codProducto = $(this).data('codigo'); 
        let codVendedor = $(this).val() || '999'; 

        validaCodigoVendedor(codVendedor).done(function (response) {
            let vendedor = response.data;
            if (vendedor) { 
                
                updateVendedorProducto(codProducto, codVendedor);
            }else{
                new PNotify({
                    title: 'Dato no valido',
                    text: 'El codigo del vendedor no es valido, no se actualizo el vendedor.',
                    delay: 2000,
                    type: 'error',
                    styling: 'bootstrap3'
                });
                
            }
        });

        
    });

    
    // Caja de comentarios y observaciones 
    $("#comment").on("keyup change", function(event) {
       cotizacion.comentario = $(this).val();
       
    });

    // Caja de comentarios y observaciones 
    $("#comment_envio").on("keyup change", function(event) {
        cotizacion.comentarioExtraEnvio = $(this).val();
        
     });

    // Boton de busqueda de documentos 
    $("#searchDocumentModal").on("click", function(event) {
        let fechaINI = document.getElementById("fechaINIDoc").value;
        let fechaFIN = document.getElementById("fechaFINDoc").value;
        let busqueda = document.getElementById("terminoBusquedaModalDocument").value;
        let tipoDOC = document.getElementById("tipoBusquedaModalProducto").value;
        console.log(tipoDOC);
        if (fechaINI.length > 0) {
            buscarDocumentos(fechaINI, fechaFIN, busqueda, tipoDOC);
            
        }else{
            Swal.fire({
                type: 'warning',
                title: 'Datos de busqueda incompletos',
                text: 'Indique rango de fechas'
              })
        }
     });

    // Boton de creacion de PDF en busqueda de documentos
    $("#tblResultadosBusquedaDocumentos").on("click", '.btnModalGeneraPDF', function(event) {
        let IDDocument = $(this).data("codigo");
        window.open('././api/cotizaciones/index.php?action=generaProforma&IDDocument='+IDDocument);
       
    });
     
    // Boton de envio de email en busqueda de documentos
    $("#tblResultadosBusquedaDocumentos").on("click", '.btnModalSendEmail', function(event) {
        let IDDocument = $(this).data("codigo");
        sendEmailByDocument(IDDocument);
    });

    // Boton de envio de email personalizado en busqueda de documentos
    $("#tblResultadosBusquedaDocumentos").on("click", '.btnModalSendCustomEmail', function(event) {
        let IDDocument = $(this).data("codigo");
        $('#modalBuscarDocumento').modal('hide');
        showModalEmail(IDDocument);
       
    });

    // Boton de envio de email personalizado en busqueda de documentos
    $("#btnSendCustomEmail").on("click", function(event) {
        alert('Enviando, espere...');
        $(this).attr("disabled", true);
        tinyMCE.triggerSave();
        let IDDocument = $('#emailIDDocument').val();
        let emails = $('#emailDestinatario').val();
        let menssage = $('#mailContent').val();
       
        sendCustomEmailByDocument(IDDocument, emails, menssage);
    });

    // Boton de creacion de PDF en busqueda de documentos
    $("#tblResultadosBusquedaDocumentos").on("click", '.btnModalLoadData', function(event) {
        let IDDocument = $(this).data("codigo");
        loadDataByDocument(IDDocument);
    });

    



    /* Funciones */

    function validaGuardado() {
      
        let cotizacionJSON = JSON.stringify((cotizacion));
        console.log('Guardando:', cotizacion);
       
        Swal.fire({
            title: 'Confirmacion de Guardado',
            text: 'Guardar la cotizacion?',
            type: 'info',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Si, Grabar',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                saveData(cotizacionJSON);
            }
        });
       
    }

    function saveData(formData){
       
        console.log(JSON.parse(formData));
        $.ajax({
            type: 'POST',
            url: './api/cotizaciones/index.php?action=saveCotizacion',
            dataType: "json",
    
            data: { formData: formData },
            
            success: function(response) {
                console.log(response);

                if (response.status == 'OK') {
                    nuevoIDDocumentGenerated = response.data.new_cod_VENCAB;
                    mySwal(response.data.mensaje + 'ID de documento generado: ' + response.data.new_cod_VENCAB, "success" , nuevoIDDocumentGenerated);
                }else{
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'No se pudo registrar. '+ response.mensaje,
                        footer: 'Si el problema persiste, informe a sistemas.'
                      })
                }
                
               
            }
        });

       

    }

    function saveNuevoCliente(formData) {

        $.ajax({
            type: 'POST',
            url: './api/cotizaciones/index.php?action=saveNuevoCliente',
            dataType: "json",

            data: { formData: formData },

            success: function (response) {
                console.log(response);
                new PNotify({
                title: 'Atencion',
                text: response.mensaje,
                delay: 2000,
                type: response.status,
                styling: 'bootstrap3'
                });

                if(response.status == 'success'){
                    $("#RUCnuevoCliente").val('');
                    $("#nombreCliente").val('');
                    $("#emailCliente").val('');
                    $("#direccionCliente").val('');
                    $("#telefonoCliente").val('');
                }


            }
        });



    }

    

    function addProductToList(newProducto){

        let existeInArray = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo === newProducto.codigo;
        });
            
        if (existeInArray === -1){ // No existe el producto en el array
            cotizacion.productos.push(newProducto);
            $('#inputNuevoCodProducto').val('');
            $("#inputNuevoProductoPrecioUnitario").prop("readonly", true); 
            resetnewProducto();
        }else{
           
            Swal.fire({
                type: 'warning',
                title: 'Oops...',
                text: `El item ${newProducto.codigo} ya existe en la lista`
              })
        }

        //console.log(cotizacion.productos);
    }


    function deleteProductToList(codProdToDelete){

        let index = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo === codProdToDelete;
        });
            
        //console.log('elimina el: '+ index);
        cotizacion.productos.splice(index, 1);

        //console.log(cotizacion.productos);
        printProductos(cotizacion.productos);
    }

    function checkFormasPago(){
        console.log(cotizacion.cliente);

        $("#formaPago option[value='CRE']").remove();
        if (cotizacion.cliente) {
            console.log(cotizacion.cliente.formaPago);
            if (cotizacion.cliente.formaPago == 'CRE') {
                $('#formaPago').append(`<option value="CRE">CREDITO</option>`); 
            }
        }
    }

    function resetnewProducto() {
        newProducto = null;
        
        $('#inputNuevoProductoNombre').val('');
        $('#inputNuevoProductoCantidad').val('');
        $('#inputNuevoProductoPrecioUnitario').val('');
        $('#inputNuevoProductoPesoUnitario').val('');
        $('#inputNuevoProductoSubtotal').val('');
        /*Promos Inputs */
        $('#inputNuevoProductoStockLocal').val('');
        $('#inputNuevoProductoCodProm').val('');
        $('#inputNuevoProductoValidezProm').val('');
       
        $('#inputNuevoProductoDesc').val('');
        tinyMCE.get('extraDetailContent').setContent('');
        
        
    }

   
    function printDataCliente(cliente) {
        $('#inputCodigo').val(cliente.CODIGO.trim());
        $('#inputNombre').val(cliente.NOMBRE.trim());
        $('#inputRSocial').val(cliente.EMPRESA.trim());
        $('#inputCorreo').val(cliente.EMAIL.trim());
        $('#inputTelefono').val(cliente.TELEFONO.trim());
        $('#inputDiasPago').val(cliente.DIASPAGO.trim() + ' (' + cliente.FPAGO.trim() + ')');
        $('#inputVendedor').val(cliente.VENDEDOR.trim() + ' (' + cliente.VENDEDORNAME.trim() + ')');
        $('#inputNuevoVendedor').val(cliente.VENDEDOR.trim());
        $('#inputTipoPrecioCli').val(cliente.TIPOPRECIO.trim());
    }

    function clearDataCliente() {
        myCliente = null;
        cotizacion.cliente = null;
        cotizacion.bodega = null;
        $('#inputCodigo').val('');
        $('#inputNombre').val('(Sin identificar)');
        $('#inputRSocial').val('');
        $('#inputCorreo').val('');
        $('#inputTelefono').val('');
        $('#inputDiasPago').val('');
        $('#inputVendedor').val('');
        $('#inputNuevoVendedor').val('');
        $('#inputTipoPrecioCli').val('');
    }
    

    function printDataProducto(producto, promocion){
        document.getElementById("inputNuevoProductoNombre").value = producto.nombre;
        document.getElementById("inputNuevoProductoCantidad").value = producto.cantidad;
        document.getElementById("inputNuevoProductoStockLocal").value = parseFloat(producto.stock).toFixed(2);
        document.getElementById("inputNuevoProductoCodProm").value = typeof (promocion.codpvtprom) != 'undefined' ? promocion.codpvtprom.trim() : '' ;
        document.getElementById("inputNuevoProductoValidezProm").value = typeof (promocion.fecfinprom) != 'undefined' ? promocion.fecfinprom.trim() : '-';
        document.getElementById("inputNuevoProductoPrecioUnitario").value = parseFloat(producto.precio).toFixed(2);
        document.getElementById("inputNuevoProductoPesoUnitario").value = parseFloat(producto.peso).toFixed(2);
        document.getElementById("inputNuevoProductoDesc").value = producto.descuento;
        document.getElementById("inputNuevoProductoSubtotal").value = producto.getSubtotal().toFixed(2);
    }

  
    function printProductos(arrayProductos){
        
        $('#tablaProductos').html('');
        $('#tablaEnvio').html('');
        
        arrayProductos.forEach(producto => {
            let row = `
                <tr>
                    <td><input type="text" class="form-control text-center input-sm" value="${producto.codigo}" disabled></td>
                    <td><input type="text" class="form-control text-center input-sm"  value="${producto.nombre}" readonly></td>
                    <td><input type="number" class="form-control text-center input-sm rowcantidad" data-codigo="${producto.codigo}" value="${producto.cantidad}" min="1" oninput="validity.valid||(value='1');"></td>
                    <td><input type="text" class="form-control text-center input-sm rowvendedor" data-codigo="${producto.codigo}" value="${producto.vendedor}" min="1"></td>
                    <td>
                        <input type="text" class="form-control text-center input-sm" value="${parseFloat(producto.precio).toFixed(2)}" readonly>
                    </td>
                    <td>
                        <input type="number" class="form-control text-center input-sm rowpeso" data-codigo="${producto.codigo}" step="0.01" value="${parseFloat(producto.peso).toFixed(2)}" min="0.1" oninput="validity.valid||(value='0.1');">
                    </td>
                    <td><input type="text" class="form-control text-center input-sm" value="${parseFloat(producto.stock).toFixed(2)}" disabled></td>
                    <td><input type="text" class="form-control text-center input-sm" value="${producto.descuento}" disabled></td>
                    <td><input type="text" class="form-control text-center input-sm" value="${producto.getSubtotal().toFixed(2)}" readonly></td>
                    <td><input type="text" class="form-control text-center input-sm" value="${producto.getIVA().toFixed(2)}" readonly></td>
                    <td><button type="button" class="btn btn-danger btn-sm btn-block btnEliminaRow" data-codigo="${producto.codigo}"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
                    </td>
                </tr>
                `;

                if (producto.codigo=='TTR-01') {
                    $('#tablaEnvio').append(row);
                }else{
                    $('#tablaProductos').append(row);
                }
                
        
        });
    }

    function updateCantidadProducto (codigoProducto, newCantidad) {
        let indexProducto = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo === codigoProducto;
        });

        console.log(parseInt(newCantidad) || 0);
        cotizacion.productos[indexProducto].cantidad = parseInt(newCantidad);
        
        console.log(cotizacion.productos);
        printProductos(cotizacion.productos);
        let objectResumen = resumenProdutosInList();
        printResumen(objectResumen);

    }

    function updatePesoProducto (codigoProducto, peso) {
        let indexProducto = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo == codigoProducto;
        });
        
        cotizacion.productos[indexProducto].peso = peso;
        
        console.log(cotizacion.productos);
        printProductos(cotizacion.productos);
        let objectResumen = resumenProdutosInList();
        printResumen(objectResumen);

    }

    function updateVendedorProducto (codigoProducto, codigoVendedor) {
        
        let indexProducto = cotizacion.productos.findIndex(function(productoEnArray) {
            return productoEnArray.codigo === codigoProducto;
        });
        
        cotizacion.productos[indexProducto].vendedor = codigoVendedor;

        new PNotify({
            title: 'Realizado',
            text: `Vendedor ${codigoVendedor} actualizado en ${codigoProducto}`,
            delay: 2000,
            type: 'success',
            styling: 'bootstrap3'
        });
        
        console.log(cotizacion.productos);
        printProductos(cotizacion.productos);
        let objectResumen = resumenProdutosInList();
        printResumen(objectResumen);

    }

    function printBusquedaClientes(arrayClientes){
        $('#tblResultadosBusquedaClientes').find("tr").remove();
        let cont = 1;
        arrayClientes.forEach(cliente => {
            let row = `
            <tr>
                <th scope="row">${cont}</th> 
                <td>${cliente.RUC}</td>
                <td>${cliente.NOMBRE.trim()}</td>
                <td><button type="button" class="btn btn-primary btn-sm btn-block btnSeleccionaCliente" data-codigo="${cliente.RUC.trim()}"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Seleccionar</button></td>
                
            </tr>
                `;

                $('#tblResultadosBusquedaClientes > tbody:last-child').append(row);
            cont++;

        });
    }

    function printBusquedaPromociones(arrayPromos) {
        //$('#tblResultadosBusquedaClientes').find("tr:gt(0)").remove();
        $('#tblResultadosDetallePromo').find("tr:gt(0)").remove();
        let cont = 1;
        arrayPromos.forEach(promocion => {
            let row = `
            <tr>
                <th>${promocion.CODIGO}</th> 
                <td>${promocion.TIPO}</td>
                <td>${promocion.NOMBRE}</td>
                <td>${promocion.PORCEN}</td>
                
            </tr>
                `;

            $('#tblResultadosDetallePromo > tbody:last-child').append(row);
            cont++;

        });
    }

    function printBusquedaProductos(arrayProductos){
        $('#tblResultadosBusquedaProductos').find("tr:gt(0)").remove();
        let cont = 1;
        let precioDisplay = 'Prec_A';
        console.log(precioDisplay);
        arrayProductos.forEach(producto => {
            let row = `
            <tr>
                <th scope="row">${cont}</th> 
                <td>${producto.Codigo}</td>
                <td>${producto.Nombre.trim()}</td>
                <td>${parseFloat(producto.PreaA.trim()).toFixed(2)}</td>
                <td>${producto.Stock}</td>
                <td><button type="button" class="btn btn-primary btn-sm btn-block btnSeleccionaProducto" data-codigo="${producto.Codigo.trim()}"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button></td>
                
            </tr>
                `;

                $('#tblResultadosBusquedaProductos > tbody:last-child').append(row);
            cont++;

        });
    }

    function printBusquedaDocumentos(arrayDocumentos){
        $('#tblResultadosBusquedaDocumentos').find("tr:gt(0)").remove();
        let cont = 1;
        arrayDocumentos.forEach(documento => {
            let row = `
            <tr>
                <th scope="row">${cont}</th> 
                <td>${documento.TIPO}</td>
                <td>${documento.FECHA.trim()}</td>
                <td>${documento.CLIENTE.trim()}</td>
                <td>${documento.BODEGA.trim()}</td>
                <td>${documento.total.trim()}</td>
                <td>${documento.id.trim()}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-sm btn-block dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Opciones <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" data-codigo="${documento.id.trim()}" class="btnModalGeneraPDF"> <span class="glyphicon glyphicon-save-file" aria-hidden="true"></span> Generar PDF</a></li>
                            <li><a href="#" data-codigo="${documento.id.trim()}" class="btnModalSendEmail"> <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Enviar por email (default)</a></li>
                            <li><a href="#" data-codigo="${documento.id.trim()}" class="btnModalSendCustomEmail"> <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Enviar por email (personalizado)</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
                `;

                $('#tblResultadosBusquedaDocumentos > tbody:last-child').append(row);
            cont++;

        });
    }

    function validaCliente(CI_RUC) {
       
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getInfoCliente',
            dataType: "json",
    
            data: { ruc: CI_RUC },
            
            success: function(response) {
                console.log(response);
            }
        });
    }

    function getCodigoEnvio(provincia, canton, parroquia) {
       
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getCodigoEnvio',
            dataType: "json",
            data: { provincia: provincia, canton: canton, parroquia: parroquia },

            success: function(response) {
                console.log(response);
            }
        });
       
    }

    function validaCostoEnvio(codParroquiaDest, peso) {
       
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getAPITramaco_costo_envio',
            dataType: "json",
            data: { codParroquiaDest: codParroquiaDest, peso: peso },

            success: function(response) {
                console.log(response);
            }
        });
       
    }


    function validaClienteNuevo(CI_RUC) {
        
        return  $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getInfoCliente',
            dataType: "json",
    
            data: { ruc: CI_RUC },
            
            success: function(response) {
                console.log(response);
            }
        });
    }

    function getInfoProducto(codProducto, clienteRUC){

        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getInfoProducto', 
            dataType: "json",

            data: { codigo: codProducto, clienteRUC: clienteRUC },

            success: function(response) {
                console.log(response);
            }
        });
      
    }

    function validaProducto(codProducto, clienteRUC, codPromo, formaPago) {
        switch (codProducto.toUpperCase()) {
            case 'TTR-01':

                let totalPeso = cotizacion.getPesoProductos();
                console.log(totalPeso);
            
                if (totalPeso > 0 && cotizacion.codDestinoEnvio) {
                    console.log('Servicio de transporte');
                    $("#inputNuevoProductoPrecioUnitario").prop("readonly", false); 
                    getInfoProducto(codProducto, clienteRUC).done(function (response) {
                        if (response.status == 'OK' &&  response.data.producto) {
                        let producto = response.data.producto;
                        promocion = response.data.promocion;
                            let precioFactura =  cotizacion.productos.reduce( (total, producto) => { 
                                return total + (producto.getSubtotal() + producto.getIVA()); 
                            }, 0) * 0.01 ; 

                            precioFactura += cotizacion.precioEnvio;

                            validaDescuento(codPromo, formaPago).done(function (response) {
                                newProducto = new Producto(producto.CODIGO, producto.NOMBRE, producto.TIPOARTICULO, 1, precioFactura, totalPeso, 0, producto.STOCKLOCAL, producto.TIPOIVA || 0, producto.VALORIVA);
                               
                                let porcentPromo = parseInt(response.data.PORCEN) || 0;
                                newProducto.descuento = porcentPromo;
                                printDataProducto(newProducto, promocion);

                                newProducto.vendedor = cotizacion.cliente.vendedor;

                                cotizacion.requiereEnvio = true;
                                addProductToList(newProducto);
                                printProductos(cotizacion.productos);
                                let objectResumen = resumenProdutosInList();
                                printResumen(objectResumen);
                                $('#modalBuscarDestino').modal('hide');
                             
                               

                            });
                            
                        } else {
                            new PNotify({
                                title: 'Item no disponible',
                                text: 'No se ha encontrado el producto con el codigo: ' + codProducto,
                                delay: 1000,
                                type: 'warn',
                                styling: 'bootstrap3'
                            });
                            cotizacion.requiereEnvio = false;
                            resetnewProducto();
                        }
                    });
                }else{
                    new PNotify({
                        title: 'Envio sin peso',
                        text: 'No se puede agregar tarifa de envio con peso 0 Kgs o sin destino indicado',
                        delay: 3000,
                        type: 'error',
                        styling: 'bootstrap3'
                    });
                    cotizacion.requiereEnvio = false;
                }

                break;
        
            default:
                $("#inputNuevoProductoPrecioUnitario").prop("readonly", true); 
                getInfoProducto(codProducto, clienteRUC).done(function (response) {
                    if (response.status == 'OK' &&  response.data.producto) {
                    let producto = response.data.producto;
                    promocion = response.data.promocion;

                    console.log('ProductoDB', producto);
                   
                        validaDescuento(codPromo, formaPago).done(function (response) {
                            newProducto = new Producto(producto.CODIGO, producto.NOMBRE, producto.TIPOARTICULO, 1, producto.PRECIO, producto.PESO, 0, producto.STOCKLOCAL, producto.TIPOIVA || 0, producto.VALORIVA);
                            let porcentPromo = parseInt(response.data.PORCEN) || 0;
                            newProducto.descuento = porcentPromo;
                            printDataProducto(newProducto, promocion);
                        });
                       
                    } else {
                        new PNotify({
                            title: 'Item no disponible',
                            text: 'No se ha encontrado el producto con el codigo: ' + codProducto,
                            delay: 1000,
                            type: 'warn',
                            styling: 'bootstrap3'
                        });
                        resetnewProducto();
                    }
                });
                break;
        }
        
    }

    function validaDescuento(codPromo, formaPago){
        
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getInfoPromocionByCod', // API retorna objeto JSON de producto, false caso contrario.
            dataType: "json",

            data: { codPromo: codPromo, formaPago: formaPago },

            success: function (response) {
                console.log('Descuento', response);
                
            }
        });

    }


    function validaPromo(codPromo) {

        $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getInfoPromocion', // API retorna objeto JSON de producto, false caso contrario.
            dataType: "json",

            data: { codPromo: codPromo },

            success: function (response) {
                console.log(response);
                let ArrayPromociones = response.data;
                printBusquedaPromociones(ArrayPromociones);
            }
        });

    }

    function validaCodigoVendedor (codVendedor) {

        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=getVendedor', // API retorna objeto JSON de producto, false caso contrario.
            dataType: "json",

            data: { codVendedor: codVendedor },

            success: function (response) {
                console.log(response);
            }
        });

    }



    function buscarClientes(terminoBusqueda, tipoBusqueda) {
        $("#loaderClientes").css("display", "block");
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=searchClientes',
            dataType: "json",
    
            data: { terminoBusqueda:terminoBusqueda, tipoBusqueda:tipoBusqueda },
            
            success: function(response) {
                console.log(response);
                $("#loaderClientes").css("display", "none");
            }
        });

    }


    function buscarProductos(terminoBusqueda, tipoBusqueda) {
        $("#loaderProductos").css("display", "block");
       
        return $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=searchProductos',
            dataType: "json",
    
            data: { terminoBusqueda:terminoBusqueda, tipoBusqueda:tipoBusqueda },
            
            success: function(response) {
                $("#loaderProductos").css("display", "none");
                console.log(response);
                
            }
        });

    }

    function buscarDocumentos(fechaINI, fechaFIN, stringBusqueda, tipoDOC) {
        $("#loaderDocumentos").css("display", "block");
       
        $.ajax({
            type: 'get',
            url: './api/cotizaciones/index.php?action=searchDocumentos',
            dataType: "json",
    
            data: { fechaINI:fechaINI, fechaFIN:fechaFIN, stringBusqueda: stringBusqueda, tipoDOC: tipoDOC },
            
            success: function(response) {
                console.log(response);
                let arrayDocumentos = response.data;
                $("#loaderDocumentos").css("display", "none");
                printBusquedaDocumentos(arrayDocumentos);
                //console.log(arrayDocumentos);
            }
        });

    }

    function printSubtotalNewProd (){
        $("#inputNuevoProductoSubtotal").val(newProducto.getSubtotal().toFixed(2));
    }
   
    function resumenProdutosInList() {
        
        return {
            subTotalProductos: cotizacion.getSubTotalProductos().toFixed(2),
            IVAProductos: cotizacion.getIVAProductos().toFixed(2),
            totalProductos: cotizacion.getTotalProductos().toFixed(2),

            subTotalEnvio: cotizacion.getSubTotalEnvio().toFixed(2),
            IVAEnvio: cotizacion.getIVAEnvio().toFixed(2),
            totalEnvio: cotizacion.getTotalEnvio().toFixed(2),

            sumaSubtotalproductos: cotizacion.getTotalFactura(),
            sumatotalproductosWithIVA: cotizacion.getTotalFactura() + cotizacion.getIVAFactura(),
            sumaTotalItems: cotizacion.sumarKey("cantidad"),
            sumaTotalPeso: cotizacion.getPesoProductos(),
            totalSeguroEnvio: cotizacion.getTotalSeguroEnvio(),
            sumaIVABienes: cotizacion.getIVAFactura(),
            sumaDescuento: cotizacion.getDescuentoProductos()
        };
    }

    function printResumen(objectResumen){
        $("#inputSubTotalProductos").val(objectResumen.subTotalProductos);
        $("#inputIVAProductos").val(objectResumen.IVAProductos);
        $("#inputTotalProductos").val(objectResumen.totalProductos);

        $("#inputSubTotalEnvio").val(objectResumen.subTotalEnvio);
        $("#inputIVAEnvio").val(objectResumen.IVAEnvio);
        $("#inputTotalEnvio").val(objectResumen.totalEnvio);
       

        $("#txt_unidadesProd").val(objectResumen.sumaTotalItems);
        $("#welltotal").html('$ '+ objectResumen.sumatotalproductosWithIVA.toFixed(2));
        $("#txt_subtotal").val(objectResumen.sumaSubtotalproductos.toFixed(2));
        $("#txt_impuesto").val(objectResumen.sumaIVABienes.toFixed(2));
        $("#txt_costo_seguro_envio").val(objectResumen.totalSeguroEnvio.toFixed(2));
        $("#txt_descuentoResumen").val(objectResumen.sumaDescuento.toFixed(2));
        $("#txt_totalPagar").val(objectResumen.sumatotalproductosWithIVA.toFixed(2));
    }

    function printVendedor(vendedor) {
        $("#vendedorClienteName").val(vendedor.NOMBRE);
    }
   
    

    function mySwal(mensajem, tipoAlerta = 'info', newcodigoVENCAB) {
        Swal.fire({
            title: 'Atención',
            text: mensajem + ', desea enviar email con la cotizacion al cliente?',
            type: tipoAlerta,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
                
                let IDDocument = newcodigoVENCAB;
                $('#modalBuscarDocumento').modal('hide');
                showModalEmail(IDDocument);

               
                
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              
              location.reload();
            }
          })
    }

    function showModalEmail(IDDocument){
        fetch(`././api/cotizaciones/index.php?action=getInfoVENCAB&IDDocument=${ IDDocument }`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let infoIDDocument = data.data;
            $('#modalSendEmail').modal('show');
            $('#emailDestinatario').val(infoIDDocument.EMAIL);
            $('#emailIDDocument').val(IDDocument);
            console.log(data);
                
        }).catch(function(err) {
            console.error(err);
        });  
    }

    function sendCustomEmailByDocument(IDDocument, emails, message){

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            animation : true,
            timer: 5000
            
          });

        fetch(`././api/cotizaciones/index.php?action=sendEmailByCustomEmail&email=${ emails }&IDDocument=${ IDDocument }&message=${ message }`)
            .then(function(response) {
                console.log(response);
                return response.json();
            })
            .then(function(response) {
                console.log(response);
                Toast.fire({
                    type: 'success',
                    title: response.data.mensaje
                    })

                    if (response.data.status == 'ok') {
                        alert('Enviado.');
                        location.reload();
                    }
            })
            .catch(function(err) {
                console.error(err);
                alert('Se a producido un error al enviar. #configSMTP error', err);
            });
        
    }

    function sendEmailByDocument(IDDocument){

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            animation : true,
            timer: 5000
            
          });

        fetch(`././api/cotizaciones/index.php?action=getInfoVENCAB&IDDocument=${ IDDocument }`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data.data);
                console.log(data.data.EMAIL);

                let emails = prompt("Indique los emails a los que enviar:", data.data.EMAIL);
                    if(emails==undefined) {
                        return;
                    }else if(emails==""){
                        alert("Se requiere al menos 1 email para el envio.");
                        return;
                    }else{
                        fetch(`././api/cotizaciones/index.php?action=sendEmailByCustomEmail&email=${ emails }&IDDocument=${ IDDocument }`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(response) {
                            console.log(response);
                            Toast.fire({
                                type: 'success',
                                title: response.data.mensaje
                              })

                        })
                        .catch(function(err) {
                            console.error(err);

                        });
                    }
            }).catch(function(err) {
                console.error(err);
            });
    }

    function loadDataByDocument(IDDocument) {
        if (confirm('Está seguro que desea cargar la informacion del documento: ' +IDDocument + '?, esto borrara la informacion ingresada actualmente.')) {
            
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                animation : true,
                timer: 5000
                
              });
    
            fetch(`././api/cotizaciones/index.php?action=getInfoVENCAB&IDDocument=${ IDDocument }`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    let VEN_CAB = data.data;
                    let RUC = $("#inputRUC").val(VEN_CAB.RUC);
                    validaCliente(RUC);

                    // Carga de VEN_MOV
                    fetch(`././api/cotizaciones/index.php?action=getInfoVENMOV&IDDocument=${ IDDocument }`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function (data){
                        let VEN_MOV = data.data;
                        console.log(VEN_MOV);
                        cotizacion.productos = [];
                        VEN_MOV.forEach(producto => {
                            let loadproducto = new Producto(producto.CODIGO.trim(), producto.Nombre.trim(), producto.TIPOARTICULO, parseInt(producto.CANTIDAD), parseFloat(producto.PRECIO), producto.PESO, 0, 0, producto.tipoiva, producto.IVA);
                            console.log(loadproducto);
                            cotizacion.productos.push(loadproducto);
                            //console.log(cotizacion.productos);
                            printProductos(cotizacion.productos);
                            let objectResumen = resumenProdutosInList();
                            printResumen(objectResumen);
                        });

                        console.log(cotizacion);
                    })
                   
                }).catch(function(err) {
                    console.error(err);
                });

        }
    }
    

    function uploadFiles(codOrden, codProducto, archivos, descripcion) {

        if (archivos) {
            let formdata = new FormData();
            formdata.append('codOrden', codOrden);
            formdata.append('codProducto', codProducto);
            formdata.append('descripcion', descripcion);

            for (let cont = 0; cont < archivos.length; cont++) {
                formdata.append("file[]", archivos[cont]);
            }
            
            $.ajax({
                url:'././api/cotizaciones/index.php?action=uploadFile',
                processData:false,
                contentType:false,
                type:'POST',
                data: formdata,
                success:function(respuesta){
                  
                    let resultJSON = JSON.parse(respuesta);
                    console.log(resultJSON);

                    console.log(resultJSON.resultados);
                    let extraData = JSON.stringify(resultJSON.resultados);
                  
                        $.ajax({
                            url:'././api/cotizaciones/index.php?action=saveExtraData',
                            type:'POST',
                            data: { extraData: extraData },
                            success:function(respuesta){
                                console.log(respuesta);
                                
                            }
                        });
                    
                    
                }
            });
        }
        
    }

    function getProvinciasTramaco() {

        fetch(`././api/cotizaciones/index.php?action=getProvinciasTramaco`)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                console.log(result.data);
                let arrayData = result.data;
                let $dropdown = $("#envioProvincia");
                $.each(arrayData, function() {
                    $dropdown.append($("<option />").val(this.PROVINCIA).text(this.PROVINCIA));
                });
                    
            }).catch(function(err) {
                console.error(err);
            });
    
        
    }

    function getCantonesTramaco(provincia='PICHINCHA') {

        fetch(`././api/cotizaciones/index.php?action=getCantonesTramaco&provincia=${ provincia }`)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                let $dropdown_cantones = $("#envioCanton");
                let $dropdown_parroquias = $("#envioParroquia");
                $dropdown_cantones.empty()
                    .append('<option selected="selected" value="">Seleccione por favor</option>')
                ;

                $dropdown_parroquias.empty()
                    .append('<option selected="selected" value="">Seleccione por favor</option>')
                ;

                console.log(result.data);
                let arrayProvincias = result.data;
                $.each(arrayProvincias, function() {
                    $dropdown_cantones.append($("<option />").val(this.CANTON).text(this.CANTON));
                });
                    
            }).catch(function(err) {
                console.error(err);
            });
    
        
    }

    function getParroquiasTramaco(canton='QUITO') {

        fetch(`././api/cotizaciones/index.php?action=getParroquiasTramaco&canton=${ canton }`)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                let $dropdown = $("#envioParroquia");
                $dropdown.empty()
                    .append('<option selected="selected" value="">Seleccione por favor</option>')
                ;

                console.log(result.data);
                let arrayProvincias = result.data;
                $.each(arrayProvincias, function() {
                    $dropdown.append($("<option />").val(this.PARROQUIA).text(this.PARROQUIA));
                });
                    
            }).catch(function(err) {
                console.error(err);
            });
    
        
    }

});

/* FIN DOC Ready */

function disableEnter() {
    $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
}

function startJSBoostrap() {
    PNotify.prototype.options.styling = "bootstrap3";
    PNotify.prototype.options.styling = "fontawesome";
    $('[data-toggle="tooltip"]').tooltip();

    let options = {
        title: 'Informacion Extra',
        content: '',
        placement: 'bottom',
        container: 'body',
        trigger : 'click',
        html: true,
        template: `
            <div class="popover" role="tooltip">
                <div class="arrow"></div>
                <h3 class="popover-title"></h3>
                <textarea class="form-control popover-content" rows="3" id="extraProdDescription"></textarea>
            </div>`,

        
        };

    $('[data-toggle="popover"]').popover(options);
    
}


