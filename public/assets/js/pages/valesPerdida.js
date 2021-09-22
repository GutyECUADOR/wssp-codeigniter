class Producto {
    constructor({codigo, nombre, cantidad, precio=0, descuento=0}) {
        this.cantidad = parseInt(cantidad) || 1;
        this.codigo = codigo || '';
        this.descuento = parseFloat(descuento) || 0 ;
        this.nombre = nombre || '';
        this.precio = parseFloat(precio) || 0;
        this.iva = parseFloat(0);
    }

    getIVA(){
        return parseFloat(((this.getSubtotal() * this.iva) / 100).toFixed(2));
    }

    getDescuento(){
        return parseFloat((((this.cantidad * this.precio)* this.descuento)/100).toFixed(2));
    }

    getPeso(){
        return parseFloat((this.peso *this.cantidad).toFixed(2));
    }

    getSubtotal(){
        return parseFloat(((this.cantidad * this.precio) - this.getDescuento(this.descuento)).toFixed(2));
    }

    setPeso(peso){
        this.peso = parseFloat(peso);
    }
    
    setCantidad(cantidad){
        this.cantidad = parseInt(cantidad);
    }

    setDesuento(descuento){
        this.descuento = parseFloat(descuento);
    }
}

class Documento {
    constructor() {
        this.productos = {
            items: [],
            cantidad: 0,
            peso: 0,
            subtotal: 0,
            IVA: 0,
            total: 0
        },
        this.productos_detalle = []
        this.cantidad = 0;
        this.peso = 0;
        this.subtotal = 0;
        this.total = 0
    }

        getCantidad() {
            this.productos.cantidad = this.productos.items.reduce( (total, producto) => {
                return total + producto.cantidad;
            }, 0);
            return this.productos.cantidad;
        }

        getPeso(){
            this.productos.peso = this.productositems.reduce( (total, producto) => { 
                return total + producto.getPeso(); 
            }, 0); 
            return this.productos.peso;
        }

        getSubTotal(){
            this.productos.subtotal = this.productos.items.reduce( (total, producto) => { 
                return total + producto.getSubtotal(); 
            }, 0);
            return this.productos.subtotal;
        }

        getIVA(){
            this.productos.IVA = this.productos.items.reduce( (total, producto) => { 
                return total + producto.getIVA(); 
            }, 0); 
            return this.productos.IVA;
        };

        getTotal(){
            return parseFloat((this.getSubTotal() + this.getIVA()).toFixed(2));
        };
}

const app = new Vue({
    el: '#app',
    data: {
        title: 'Formulario de Vales por Pérdida',
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
                gestion: 'INV',
                bodega: 'B01',
                cantidad: 25
            },
            isloading: false,
            results: []
          },
        documento : new Documento()
    },
    methods:{
        addNewProducto(){
                this.documento.productos.items.push(new Producto({}));
        },
        removeItem(producto){
            let index = this.documento.productos.items.findIndex( productoEnArray => {
                return productoEnArray.codigo === producto.codigo;
            });
            this.documento.productos.items.splice(index, 1);
        },
        async getProductos() {
            this.search_producto.isloading = true;
            let busqueda = JSON.stringify(this.search_producto.busqueda);
            const productos = fetch(`./api/inventario/index.php?action=searchProductos&busqueda=${busqueda}`)
                .then(response => {
                    this.search_producto.isloading = false;
                    return response.json();
                }).catch( error => {
                    console.error(error);
                }); 

            console.log(productos);
            this.search_producto.results = productos.data;
            
        },
        async saveDocumento(){
            if (!this.validateSaveDocument()) {
                return;
            }

            console.log(this.documento);

            let formData = new FormData();
            formData.append('documento', JSON.stringify(this.documento));  
            return;
            fetch(`./api/inventario/index.php?action=saveCreacionReceta`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                swal({
                    title: "Realizado",
                    text: `Se ha generado exitosamente el ingreso #IPC ${data.transaction.newcod}`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: false
                    },
                    function(){
                        window.location = './index.php?action=inventario'
                    });
                
            })  
            .catch(function(error) {
                console.error(error);
            });  

            
        },
        validateSaveDocument(){
           return true;
        }
    },
    mounted(){

    }
 
})

