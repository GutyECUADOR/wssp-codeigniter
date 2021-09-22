$(document).ready(function() {
    
    var cotizacion = new Cotizacion();
    var newProducto = null;

    $('[data-toggle="tooltip"]').tooltip()

    // Inicio de funciones
    app = {
        OnInit: function () {
        },
        validaProveedor: function () {
            let RUC = document.getElementById("inputRUC").value;
            $.ajax({
                type: 'get',
                url: './api/vehiculos/index.php?action=getInfoProveedor',
                dataType: "json",
                data: { RUC: RUC },
                
                success: function(response) {
                    console.log(response);
                    let cliente = response.data;
                    
                    if (response.data) {
                        const myCliente = new Cliente(cliente.CODIGO, cliente.RUC, cliente.NOMBRE, cliente.EMAIL, cliente.TELEFONO, cliente.DIASPAGO, cliente.FPAGO);
                        cotizacion.proveedor = myCliente;
                        console.log(cotizacion);
        
                        cotizacion.IDDocument = $('#inputIDDocument').val();
                        $('#inputCodigo').val(cliente.CODIGO.trim());
                        $('#inputNombre').val(cliente.NOMBRE.trim());
                      
                    } else {
                        myCliente = null;
                        cotizacion.proveedor = null;
                        cotizacion.IDDocument = null;
                        $('#inputCodigo').val('');
                        $('#inputNombre').val('(Sin identificar)');
                        $('#inputRSocial').val('');
                        $('#inputCorreo').val('');
                        $('#inputTelefono').val('');
                        $('#inputCupo').val('');
        
                        console.log('No data');
        
                    }
        
                }
            });
        },
        getAllProveedores: function (busqueda, tipo) { 
            $.ajax({
                url: './api/vehiculos/index.php?action=getProveedoresWinfenix',
                method: 'GET',
                data: { busqueda, tipo },
        
                success: function (response) {
                    console.log(response);
                    app.printProveedores(response.data);
                   
                }, error: function (error) {
                    alert('No se pudo completar la operación, informe a sistemas. #' + error.status + ' ' + error.statusText);
                },complete: function() {
                }
        
            });
        },
        searchProducto: function (termino) { 
            $.ajax({
                url: './api/vehiculos/index.php?action=searchProducto',
                method: 'GET',
                data: { termino },
        
                success: function (response) {
                    console.log(response);
                  
                    app.showProductosBuscados(response.data);
                   
                }, error: function (error) {
                    alert('No se pudo completar la operación, informe a sistemas. #' + error.status + ' ' + error.statusText);
                },complete: function() {
                }
        
            });
        },
        printProveedores: function (arrayProveedores){
        
            $('#tblResultadosBusquedaClientes').find("tr:gt(0)").remove();
            
            arrayProveedores.forEach(item => {
                let row = `
                    <tr>
                        <td><span class="text-center"> ${item.Codigo} </span></td>
                        <td><span class="text-center"> ${item.Ruc} </span></td>
                        <td><span class="text-center"> ${item.Nombre} </span></td>
                        <td><button type="button" class="btn btn-primary btn-sm btn-block btnSeleccionarProveedor" data-codigo="${item.Ruc}"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Seleccionar</button>
                        </td>
                    </tr>
                    `;
    
                    $('#tblResultadosBusquedaClientes > tbody:last-child').append(row);
            
            });
        },
        showProductosBuscados: function (arrayProductos){
        
            $('#tblResultadosBusquedaProductos').find("tr:gt(0)").remove();
            
            arrayProductos.forEach(item => {
             
                let row = `
                    <tr>
                        <td><span class="text-center"> ${item.codigoItem} </span></td>
                        <td><span class="text-center"> ${item.codigoMaster} </span></td>
                        <td><span class="text-center"> ${item.descripcion} </span></td>
                        <td><button type="button" class="btn btn-primary btn-sm btn-block btnSeleccionarProductos" data-codigo="${item.codigoItem}"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Seleccionar</button>
                        </td>
                    </tr>
                    `;
    
                    $('#tblResultadosBusquedaProductos > tbody:last-child').append(row);
            
            });
        },
        validaProducto: function (codigo){
            console.log(codigo);
            $.ajax({
                type: 'get',
                url: './api/vehiculos/index.php?action=getInfoProducto',
                dataType: "json",
    
                data: { codigo: codigo },
    
                success: function(response) {
                    console.log(response);
                        let producto = response.data;
                        if (producto) {
                            newProducto = new Producto(producto.codigoItem, producto.descripcion.trim(), 1, 0, producto.codigoMaster.trim(), 0, producto.STOCK, producto.TIPOIVA || 0, 12);
                            app.printDataProducto(newProducto);
                            console.log(newProducto);
                        } else {
                            new PNotify({
                                title: 'Item no disponible',
                                text: 'No se ha encontrado el producto con el codigo: ' + codigo,
                                delay: 3000,
                                type: 'warn',
                                styling: 'bootstrap3'
                            });
        
        
                        }
        
                    }
            });
        },
        printDataProducto: function (producto){
            document.getElementById("inputNuevoProductoNombre").value = producto.nombre;
            document.getElementById("inputNuevoProductoCantidad").value = producto.cantidad;
            document.getElementById("inputNuevoProductoPrecioUnitario").value = producto.precio;
            document.getElementById("inputNuevoProductoSubtotal").value = producto.getSubtotal();
        },
        printProductos: function (arrayProductos){
        
            $('#tablaProductos').find("tr:gt(0)").remove();
            
            arrayProductos.forEach(producto => {
                console.log(producto);
                console.log(cotizacion.getTotalServicios());
                console.log(cotizacion.getTotalRepuestos());
                let row = `
                    <tr>
                        <td><input type="text" class="form-control text-center" value="${producto.codigo}" disabled></td>
                        <td><input type="text" class="form-control text-center"  value="${producto.nombre}" readonly></td>
                        <td><input type="number" class="form-control text-center rowcantidad data-codigo="${producto.codigo}"" value="${producto.cantidad}" disabled></td>
                        <td>
                            <input type="text" class="form-control text-center precio_linea" value="${producto.precio}" readonly>
                        </td>
                        <td><input type="text" class="form-control text-center" value="${producto.getSubtotal().toFixed(4)}" readonly></td>
                        <td><input type="text" class="form-control text-center" value="${producto.getIVA().toFixed(4)}" readonly></td>
                        <td><button type="button" class="btn btn-danger btn-sm btn-block btnEliminaRow" data-codigo="${producto.codigo}"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar</button>
                        </td>
                    </tr>
                    `;
    
                    //$("#header ul").append(row);
                    $('#tablaProductos > tbody:last-child').append(row);
            
            });
        },
        printResumen: function (objectResumen){
            $("#txt_unidadesProd").val(objectResumen.sumaTotalItems);
            $("#welltotal").html('$ '+ objectResumen.sumatotalproductosWithIVA.toFixed(4));
            $("#txt_subtotal").val(objectResumen.sumaSubtotalproductos.toFixed(4));
            $("#txt_ivaBienes").val(objectResumen.sumaIVABienes.toFixed(4));
            $("#txt_impuesto").val(objectResumen.sumaIVABienes.toFixed(4));
            $("#txt_descuentoResumen").val(objectResumen.sumaDescuento.toFixed(4));
            $("#txt_totalPagar").val(objectResumen.sumatotalproductosWithIVA.toFixed(4));
        },
        addProductToList: function (newProducto){

            let existeInArray = cotizacion.productos.findIndex(function(productoEnArray) {
                return productoEnArray.codigo === newProducto.codigo;
            });
                
            if (existeInArray === -1){ // No existe el producto en el array
                cotizacion.productos.push(newProducto);
                app.resetnewProducto();
            }else{
                alert('El item ya existe en la lista');
            }
    
            //console.log(cotizacion.productos);
        },
        resetnewProducto: function () {
            newProducto = null;
            document.getElementById("inputNuevoCodProducto").value = "";
            document.getElementById("inputNuevoProductoNombre").value = "";
            document.getElementById("inputNuevoProductoCantidad").value = "";
            document.getElementById("inputNuevoProductoPrecioUnitario").value = "";
            document.getElementById("inputNuevoProductoSubtotal").value = "";
        },
        resumenProdutosInList: function () {
            cotizacion.subtotal = cotizacion.getTotalProductos();
            cotizacion.iva = cotizacion.getIVAProductos();
            cotizacion.total = cotizacion.getTotalProductos() + cotizacion.getIVAProductos();
        
            return {
                sumaSubtotalproductos: cotizacion.getTotalProductos(),
                sumatotalproductosWithIVA: cotizacion.getTotalProductos() + cotizacion.getIVAProductos(),
                sumaTotalItems: cotizacion.sumarFromProductos("cantidad"),
                sumaIVABienes: cotizacion.getIVAProductos(),
                sumaDescuento: cotizacion.getDescuentoProductos()
            };
        },
        deleteProductToList: function (codProdToDelete){

            let index = cotizacion.productos.findIndex(function(productoEnArray) {
                return productoEnArray.codigo === codProdToDelete;
            });
                
            //console.log('elimina el: '+ index);
            cotizacion.productos.splice(index, 1);
    
            //console.log(cotizacion.productos);
            app.printProductos(cotizacion.productos);
        },
        printSubtotalNewProd: function  (){
            $("#inputNuevoProductoSubtotal").val(newProducto.getSubtotal().toFixed(4));
        },
        saveData: function (solicitud, empresa){
            console.log(JSON.parse(solicitud));
            console.log(empresa);
            $.ajax({
                type: 'POST',
                url: './api/vehiculos/index.php?action=saveWinfenixCOM',
                dataType: "json",
        
                data: { solicitud: solicitud},
                
                success: function(response) {
                    console.log(response);
                    alert(response.message + 'Documento Generado: ' + response.newdocument);
                    app.resetForm();

                    if (response.status === true) {
                        window.location.replace('index.php?action=inicio');
                    }
                }
            });
    
        },resetForm: function () {
            cotizacion = new Cotizacion();
            newProducto = null;
            app.printProductos(cotizacion.productos)
            let objectResumen = app.resumenProdutosInList();
            app.printResumen(objectResumen)
            
            
            document.getElementById("inputRUC").value = "";
            document.getElementById("inputNombre").value = "";
            document.getElementById("inputNuevoCodProducto").value = "";
            document.getElementById("inputNuevoProductoNombre").value = "";
            document.getElementById("inputNuevoProductoCantidad").value = "";
            document.getElementById("inputNuevoProductoPrecioUnitario").value = "";
            document.getElementById("inputNuevoProductoSubtotal").value = "";
        
            $('#btnGuardar').prop("disabled", false);
            
        }
    
       
    } 
    // Inicio acciones
    app.OnInit();

    $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });

    $("#inputRUC").on('keyup change', function() {
        app.validaProveedor();
    });

    // Caja de texto de producto nuevo
    $("#inputNuevoCodProducto").on('keyup change', function(event) {
        let codProducto = $('#inputNuevoCodProducto').val();
        app.validaProducto(codProducto);

    });
   
     // Caja de texto de producto nuevo
     $("#btnAgregarProdToList").on('click', function(event) {
        if (newProducto != null && newProducto.precio > 0) {
            
             //Get content of tinimce and reset
          
             app.addProductToList(newProducto);
                 
             app.printProductos(cotizacion.productos);
             let objectResumen = app.resumenProdutosInList();
             app.printResumen(objectResumen);
             
 
             console.log(cotizacion);
        }else{
            alert('No hay producto que agregar a la lista');
        }
 
     });

      // Boton remover fila de tabla productos
    $("#tablaProductos").on('click', '.btnEliminaRow', function(event) {
        let codProdToDelete = $(this).data("codigo"); // Obtenemos el campo data-value custom
        app.deleteProductToList(codProdToDelete);
        let objectResumen = app.resumenProdutosInList();
        app.printResumen(objectResumen);
    });

     /* Multiplica la cantidad del producto a añadir a la lista*/
     $("#inputNuevoProductoCantidad").on('change', function(event) {
        let nuevacantidad = $(this).val();
        //console.log(nuevacantidad);
        if (newProducto != null) {
            newProducto.cantidad = nuevacantidad;
            app.printSubtotalNewProd();
        }
 
     });

     /* Multiplica la cantidad del producto a añadir a la lista*/
     $("#inputNuevoProductoPrecioUnitario").on('change, keyup', function(event) {
        let nuevoValor = $(this).val();
        //console.log(nuevacantidad);
        if (newProducto != null) {
            newProducto.precio = parseFloat(nuevoValor);
            app.printSubtotalNewProd();
        }
 
     });

     // Boton de de envio de orden PDF por email
    $("#searchClienteModal").on("click", function(event) {
        let termino = $('#terminoBusquedaModalCliente').val();
        let tipo = $('#tipoBusquedaModalCliente').val();
        app.getAllProveedores(termino,tipo);
    });

    // Boton de de envio de orden PDF por email
    $("#searchProductoModal").on("click", function(event) {
        let termino = $('#terminoBusquedaModalProducto').val();
        app.searchProducto(termino);
    });

    $("#tblResultadosBusquedaClientes").on('click', '.btnSeleccionarProveedor', function(event) {
        let codigo = $(this).data('codigo');
        console.log(codigo);
        $('#inputRUC').val(codigo);
        app.validaProveedor();
        $('#modalBuscarCliente').modal('toggle');
    });


    $("#tblResultadosBusquedaProductos").on('click', '.btnSeleccionarProductos', function(event) {
        let codigo = $(this).data('codigo');
        console.log(codigo);
        $('#inputNuevoCodProducto').val(codigo);
        app.validaProducto(codigo);
        $('#modalBuscarProducto').modal('toggle');
     });


     // Boton de envio de datos
    $("#btnGuardar").on('click', function(event) {
        event.preventDefault();

        console.log('Guardando...');
        let cotizacionJSON = JSON.stringify((cotizacion));
        if (cotizacion.proveedor != null && cotizacion.productos.length > 0) {
            $(this).prop("disabled", true);
            app.saveData(cotizacionJSON);
        }else{
            alert('El formulario esta incompleto indique cliente y al menos un producto');
        }
       
        
       
        
        
    });

});

class Cotizacion {
    constructor() {
        this.fecha = new Date()
        this.productos = [],
        this.comentario = 'Orden Pedido Vehiculos'
    }

    getTotalServicios(){
        let total = this.productos
                        .filter(({codigoMaster}) => codigoMaster === 'SERC-027')
                        .reduce(function(previo, actual) {
                            return previo + actual.getSubtotal();
                        }, 0);

        let IVA = this.productos
                        .filter(({codigoMaster}) => codigoMaster === 'SERC-027')
                        .reduce(function(previo, actual) {
                            return previo + actual.getIVA();
                        }, 0);
        this.totalServicios = total ;
        this.IVAServicios = IVA;
        return (total+IVA);
    }

    getTotalRepuestos(){
        let total = this.productos
                        .filter(({codigoMaster}) => codigoMaster === 'COMC-016')
                        .reduce(function(previo, actual) {
                            return previo + actual.getSubtotal();
                        }, 0);

        let IVA = this.productos
                        .filter(({codigoMaster}) => codigoMaster === 'COMC-016')
                        .reduce(function(previo, actual) {
                            return previo + actual.getIVA();
                        }, 0);

        this.totalBienes = total;
        this.IVABienes = IVA;
        return (total+IVA);
    }

    sumarFromProductos(propiedad) {
        let total = 0;
        for ( var i = 0, _len = this.productos.length; i < _len; i++ ) {
            total += parseInt(this.productos[i][propiedad]);
        }
        return total
    }

    getTotalProductos(){
        let total = 0;
        for ( var i = 0, _len = this.productos.length; i < _len; i++ ) {
            total += parseFloat(this.productos[i].getSubtotal());
        }
        return total
    }

    getIVAProductos(){
        let total = 0;
        for ( var i = 0, _len = this.productos.length; i < _len; i++ ) {
            total += parseFloat(this.productos[i].getIVA());
        }
        return total
    }

    getDescuentoProductos(){
        let total = 0;
        for ( var i = 0, _len = this.productos.length; i < _len; i++ ) {
            total += parseFloat(this.productos[i].getDescuento());
        }
        return total
    }
}

class Cliente {
    constructor(codigo, RUC, nombre, email, telefono, diasPago, formaPago) {
      this.codigo = codigo;
      this.RUC = RUC;
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.diasPago = diasPago;
      this.formaPago = formaPago;
      
    }

    getTipoPrecio() {
        return this.tipoPrecio;
    }
}

class Producto {
    constructor(codigo, nombre, cantidad, precio, codigoMaster, descuento, stock, tipoIVA, valorIVA) {
      this.codigo = codigo;
      this.nombre = nombre;
      this.cantidad = cantidad;
      this.precio = precio;
      this.codigoMaster = codigoMaster;
      this.descuento = descuento;
      this.stock = stock;
      this.tipoIVA = tipoIVA;
      this.valorIVA = valorIVA;
    }

    getIVA(){
        this.valIVA =  (this.getSubtotal() * this.valorIVA) / 100;
        return (this.getSubtotal() * this.valorIVA) / 100;
        
    }

    getDescuento(){
        this.valdescuento = ((this.cantidad * this.precio)* this.descuento)/100;
        return ((this.cantidad * this.precio)* this.descuento)/100;
    }

    getSubtotal(){
        this.valsubtotal = (this.cantidad * this.precio) - this.getDescuento();
        return (this.cantidad * this.precio) - this.getDescuento();
    }

    setDescripcion(descripcion){
        this.descripcion = descripcion;
    }
}
