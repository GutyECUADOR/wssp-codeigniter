class Supervisor {
    constructor() {
        this.search_text = '',
        this.codigo = '',
        this.nombre = ''
    }
}

class Vehiculo {
    constructor() {
        this.search_text = '',
        this.placas = '',
        this.nombre = '',
        this.fechamatricula = new Date().toISOString().slice(0,10),
        this.proximafechaMatricula = new Date().toISOString().slice(0,10),
        this.fechaMantenimiento = new Date().toISOString().slice(0,10),
        this.proximaFechaMantenimiento = new Date().toISOString().slice(0,10),
        this.kilometraje = 0
    }
}

class Producto {
    constructor(codigo, nombre) {
        this.codigo = codigo || '',
        this.nombre = nombre || ''
    }
}


class Documento {
    constructor() {
        this.supervisor = new Supervisor(),
        this.vehiculo = new Vehiculo(),
        this.items = [],
        this.observacion = ''
    }

}

const app = new Vue({
    el: '#app',
    data: {
        title: 'Orden de Pedído del Vehiculo',
        documento : new Documento(),
        nuevo_producto : new Producto(),
        search_documentos: {
            busqueda: {
                fechaINI: '',
                fechaFIN: '',
                texto: '',
                cantidad: 25
            },
            isloading: false,
            results: []
        },
        search_producto: {
            busqueda: {
                texto: '',
                cantidad: 25
            },
            isloading: false,
            results: []
        }
    },
    methods:{
        getDocumentos() {
            this.search_documentos.isloading = true;
            let texto = this.search_documentos.busqueda.texto;
            let fechaINI = this.search_documentos.busqueda.fechaINI;
            let fechaFIN = this.search_documentos.busqueda.fechaFIN;
            let busqueda = JSON.stringify({ texto, fechaINI, fechaFIN});
            fetch(`./api/vehiculos/index.php?action=getDocumentos&busqueda=${busqueda}`)
            .then(response => {
                return response.json();
            })
            .then(productos => {
              console.log(productos);
              this.search_documentos.isloading = false;
              this.search_documentos.results = productos.data;
             
            }).catch( error => {
                console.error(error);
            }); 
            
        },
        getSupervisor() {
            let cedula = this.documento.supervisor.search_text;
            let busqueda = JSON.stringify({cedula});
            fetch(`./api/vehiculos/index.php?action=getEmpleadoByID&busqueda=${busqueda}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
              console.log(response);
                if (response.error) {
                    alert(response.message)
                }

                if (response.data) {
                    const supervisor = response.data;
                    this.documento.supervisor.codigo = supervisor.Codigo.trim();
                    this.documento.supervisor.nombre = supervisor.Nombre.trim();
                }else{
                    new PNotify({
                        title: 'Item no disponible',
                        text: `No se ha encontrado el supervidor con el ID: ' ${this.documento.supervisor.search_text}`,
                        delay: 3000,
                        type: 'warn',
                        styling: 'bootstrap3'
                    });
                }

            }).catch( error => {
                console.error(error);
            }); 
                
        },
        getVehiculo() {
            let placa = this.documento.vehiculo.search_text;
            let busqueda = JSON.stringify({placa});
            fetch(`./api/vehiculos/index.php?action=getVehiculoByPlaca&busqueda=${busqueda}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
              console.log(response);
                if (response.error) {
                    alert(response.message)
                }

                if (response.data) {
                    const vehiculo = response.data;
                    this.documento.vehiculo.placas = vehiculo.Codigo.trim();
                    this.documento.vehiculo.nombre = vehiculo.Nombre.trim();
                }else{
                    new PNotify({
                        title: 'Item no disponible',
                        text: `No se ha encontrado el Vehiculo con el ID: ' ${this.documento.supervisor.search_text}`,
                        delay: 3000,
                        type: 'warn',
                        styling: 'bootstrap3'
                    });
                }

            }).catch( error => {
                console.error(error);
            }); 
                
        },
        getProducto() {
            fetch(`./api/vehiculos/index.php?action=getProducto&busqueda=${this.search_producto.busqueda.texto}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
              console.log(response);
                if (response.data) {
                    const producto = response.data;
                    this.nuevo_producto = new Producto(producto.codigo?.trim(), producto.descripcion?.trim());
                }else{
                    new PNotify({
                        title: 'Item no disponible',
                        text: `No se ha encontrado el producto con el codigo: ${this.search_producto.busqueda.texto}`,
                        delay: 3000,
                        type: 'warn',
                        styling: 'bootstrap3'
                    });
                }

             
            }).catch( error => {
                console.error(error);
            }); 
                
        },
        getProductos() {
            this.search_producto.isloading = true;
            let busqueda = this.search_producto.busqueda.texto;
            fetch(`./api/vehiculos/index.php?action=searchProductos&busqueda=${busqueda}`)
            .then(response => {
                return response.json();
            })
            .then(productos => {
              console.log(productos);
              this.search_producto.isloading = false;
              this.search_producto.results = productos.data;
             
            }).catch( error => {
                console.error(error);
            }); 
            
        },
        selectProduct(codigo){
            this.search_producto.busqueda.texto = codigo.trim();
            this.getProducto();
            $('#modalBuscarProducto').modal('hide');
        },
        addToList(){
            let existeInArray = this.documento.items.findIndex((productoEnArray) => {
                return productoEnArray.codigo === this.nuevo_producto.codigo;
            });

            if (existeInArray === -1 && this.nuevo_producto.codigo.length > 0) {
               
                this.documento.items.push(this.nuevo_producto);
                this.nuevo_producto = new Producto();
                this.search_producto.busqueda.texto = '';
            }else{
                swal({
                    title: "Ops!",
                    text: `El item ${this.nuevo_producto.codigo} ya existe en la lista o no es un producto válido.`,
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: false
                    });
            }

            
        },
        removeItem(id){
            let index = this.documento.items.findIndex( productoEnArray => {
                return productoEnArray.codigo === id;
            });
            this.documento.items.splice(index, 1);
        },
        async saveDocumento(){

            if (!this.validateSaveDocument()) {
                return;
            }
            console.log(this.documento);

            let formData = new FormData();
            formData.append('solicitud', JSON.stringify(this.documento));  
            
            fetch(`./api/vehiculos/index.php?action=saveOrdenPedido`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert(data.message);
                    return false;
                }

                console.log(data);
                swal({
                    title: "Realizado",
                    text: `Se ha generado exitosamente la solicitud. Documento generado: ${data.newcod}`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: false
                    });

              
                fetch(`./api/documentos/index.php?action=sendEmail&IDDocument=${data.newcod}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        alert(data.message);
                        return false;
                    }
                    swal({
                        title: "Envio de Email",
                        text: `${data.message}`,
                        type: "info",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Aceptar",
                        closeOnConfirm: false
                        },
                        function(){
                            window.location = './index.php?action=ordenPedidoVehiculo'
                        });
                    
                }).catch( error => {
                    console.error(error);
                }); 
     
                
                
            })  
            .catch(function(error) {
                console.error(error);
            });  

            
        },
        validateSaveDocument(){
           if (this.documento.supervisor.codigo.length === 0) {
            swal({
                title: "Sin Supervisor.",
                text: `No se ha indicado un supervisor.`,
                type: "warning",
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
                });
            return false;
           }else if (this.documento.vehiculo.placas.length === 0 || this.documento.vehiculo.kilometraje === 0) {
            swal({
                title: "Datos incompletos.",
                text: `No se han ingresado toda la información del vehiculo.`,
                type: "warning",
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
                });
            return false;
           }
           else if (this.documento.items.length === 0) {
            swal({
                title: "Lista en blanco.",
                text: `La lista de items está en blanco.`,
                type: "warning",
                showCancelButton: false,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Aceptar",
                closeOnConfirm: false
                });
            return false;
           }else{
            return true
           }
            
        }
    },
    mounted(){

    }
 
})
