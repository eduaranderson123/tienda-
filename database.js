const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sisconted';

mongoose.connection.on('connected', () => {
    console.log('✅ Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Conexión a MongoDB cerrada');
});

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
});

// Esquemas flexibles (strict: false) para aceptar datos dinámicamente.
// Definir _id como String garantiza compatibilidad con IDs pasados (timestamps largos).
const schemaOptions = { strict: false, versionKey: false };
const baseSchema = { _id: { type: String, default: () => Date.now().toString() } };

const ProductoSchema = new mongoose.Schema(baseSchema, schemaOptions);
const UsuarioSchema = new mongoose.Schema(baseSchema, schemaOptions);
const PedidoSchema = new mongoose.Schema(baseSchema, schemaOptions);
const ReporteSchema = new mongoose.Schema(baseSchema, schemaOptions);
const IngresoSchema = new mongoose.Schema(baseSchema, schemaOptions);
const EgresoSchema = new mongoose.Schema(baseSchema, schemaOptions);
const ConfigSchema = new mongoose.Schema({ _id: { type: String, default: 'main' }, id: { type: String } }, schemaOptions);
const FacturaCompraSchema = new mongoose.Schema(baseSchema, schemaOptions);
const ProveedorCompraSchema = new mongoose.Schema(baseSchema, schemaOptions);

const Producto = mongoose.model('productos', ProductoSchema);
const Usuario = mongoose.model('usuarios', UsuarioSchema);
const Pedido = mongoose.model('pedidos', PedidoSchema);
const Reporte = mongoose.model('reportes', ReporteSchema);
const Ingreso = mongoose.model('ingresos', IngresoSchema);
const Egreso = mongoose.model('egresos', EgresoSchema);
const Config = mongoose.model('configuracion', ConfigSchema);
const FacturaCompra = mongoose.model('facturas_compras', FacturaCompraSchema);
const ProveedorCompra = mongoose.model('provedores_compras', ProveedorCompraSchema);

async function seedDatabase() {
    try {
        const adminCount = await Usuario.countDocuments();
        if (adminCount === 0) {
            await Usuario.create({
                _id: 'admin-default-id',
                nombre: 'Administrador',
                user: 'admin',
                pass: '1234',
                rol: 'admin'
            });
            console.log('[Seed] ✅ Creado usuario administrador base.');
        }

        const configCount = await Config.countDocuments();
        if (configCount === 0) {
            await Config.create({
                _id: 'main',
                id: 'main',
                categorias: ['General'],
                unidades: ['Und', 'Kg', 'Lt'],
                empresa: {
                    nombre: 'Mi Empresa Local',
                    nit: '000-000',
                    telefono: '000000',
                    direccion: 'Calle Falsa 123',
                    tema: 'predefinido'
                }
            });
            console.log('[Seed] ✅ Creada configuración base.');
        }
    } catch (e) {
        console.error('Error inicializando la base de datos:', e);
    }
}

mongoose.connection.once('open', seedDatabase);

module.exports = {
    Producto,
    Usuario,
    Pedido,
    Reporte,
    Ingreso,
    Egreso,
    Config,
    FacturaCompra,
    ProveedorCompra
};
