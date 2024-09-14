# Recurrente.js - Wrapper para la API de Recurrente

Este proyecto es un wrapper para la API de pagos recurrentes Recurrente, creado para facilitar la integración de pagos en proyectos. Con este paquete, puedes crear, actualizar, obtener y eliminar productos y suscripciones de manera eficiente utilizando solo Node.js y gestionando tus credenciales a través de un archivo .env.

## Beneficios del Proyecto

- Totalmente Tipado: El paquete está desarrollado con TypeScript, lo que proporciona un tipado fuerte en todas las funciones y objetos. Esto te ayuda a detectar errores durante el desarrollo y a mantener un código limpio y seguro.

- Promesas y Flujo Asíncrono: El wrapper sigue un enfoque basado en promesas, lo que permite una integración asíncrona y fluida con tu aplicación. Puedes gestionar productos y suscripciones utilizando async/await o .then()/.catch().

- Configuración Simple: Usa un archivo .env para gestionar tus claves API y URL base, lo que simplifica la configuración.
  Integración Sencilla: Con unas pocas líneas de código, puedes interactuar con la API de Recurrente para manejar productos y suscripciones.

- Modularidad y Flexibilidad: Funciones claras y bien organizadas que permiten crear productos, suscripciones y gestionar estas entidades de manera independiente.

- Manejo de Errores Centralizado: Simplifica la depuración y el manejo de errores con un sistema centralizado que gestiona las respuestas incorrectas de la API.

- Manejo de Webhooks Personalizado con Svix: El paquete incluye una implementación para manejar webhooks de Recurrente, que utiliza Svix para la entrega segura y fiable de webhooks. Esto te permite verificar las firmas de los webhooks, registrar manejadores personalizados para diferentes tipos de eventos y procesar eventos de webhook de manera eficiente y segura.

## Instalación

Instala el paquete directamente desde npm o yarn.

`npm install recurrente-js`

## Configuración de Variables de Entorno

Crea un archivo .env en la raíz de tu proyecto y añade las siguientes claves:

```
RECURRENTE_BASE_URL=https://app.recurrente.com
RECURRENTE_PUBLIC_KEY=tu-public-key
RECURRENTE_SECRET_KEY=tu-secret-key
SVIX_SIGNING_SECRET=tu-svix-signing-key
```

## Ejemplos de Uso

### Crear un Producto

El siguiente código muestra cómo crear un producto de pago único utilizando este wrapper de forma tipada y asíncrona.

```
import { recurrente } from 'recurrente-js';
import { CreateProductRequest } from 'recurrente-js/types/globals';

// Datos de ejemplo para crear un producto
const productData: CreateProductRequest = {
  name: 'Producto Ejemplo',
  pricesAttributes: [
    {
      currency: 'GTQ',
      chargeType: 'one_time',
      amountInCents: 1000,
    },
  ],
  successUrl: 'https://www.example.com/success',
  cancelUrl: 'https://www.example.com/cancel',
  phoneRequirement: 'none',
  addressRequirement: 'none',
  billingInfoRequirement: 'none',
};

// Función asíncrona para crear el producto
async function createProduct() {
  try {
    const productResponse = await recurrente.createProduct(productData);
    console.log('Producto creado:', productResponse);
  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
}

createProduct();
```

### Crear una Suscripción

El siguiente ejemplo muestra cómo crear una suscripción recurrente para un producto de forma asíncrona:

```import { recurrente } from 'recurrente-js';
import { ProductSubscription } from 'recurrente-js/types/globals';

// Datos de ejemplo para crear una suscripción
const subscriptionData: ProductSubscription = {
  product: {
    name: 'Producto Suscripción',
    pricesAttributes: [
      {
        currency: 'GTQ',
        chargeType: 'recurring',
        amountInCents: 500,
        billingIntervalCount: 1,
        billingInterval: 'month',
      },
    ],
    successUrl: 'https://www.example.com/success',
    cancelUrl: 'https://www.example.com/cancel',
  },
};

// Función asíncrona para crear la suscripción
async function createSubscription() {
  try {
    const subscriptionResponse = await recurrente.createSubscription(subscriptionData);
    console.log('Suscripción creada:', subscriptionResponse);
  } catch (error) {
    console.error('Error al crear la suscripción:', error);
  }
}

createSubscription();
```

### Recuperar y Actualizar Productos

Puedes obtener la lista de productos existentes y también actualizar los productos con la API:

```
// Obtener todos los productos
async function getAllProducts() {
  try {
    const products = await recurrente.getAllProducts();
    console.log('Productos recuperados:', products);
  } catch (error) {
    console.error('Error al recuperar productos:', error);
  }
}

// Actualizar un producto existente
async function updateProduct(productId: string) {
  const updatedData = {
    name: 'Producto Actualizado',
    pricesAttributes: [
      {
        currency: 'GTQ',
        chargeType: 'one_time',
        amountInCents: 1500,
      },
    ],
  };

  try {
    const updatedProduct = await recurrente.updateProduct(productId, updatedData);
    console.log('Producto actualizado:', updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
}

getAllProducts();
```

### Eliminar Productos y Cancelar Suscripciones

Eliminar un producto o cancelar una suscripción es tan simple como llamar a las funciones adecuadas con el ID correspondiente.

```
// Cancelar una suscripción
async function cancelSubscription(subscriptionId: string) {
  try {
    const cancelResponse = await recurrente.cancelSubscription(subscriptionId);
    console.log('Suscripción cancelada:', cancelResponse.message);
  } catch (error) {
    console.error('Error al cancelar la suscripción:', error);
  }
}

// Eliminar un producto
async function deleteProduct(productId: string) {
  try {
    const deleteResponse = await recurrente.deleteProduct(productId);
    console.log('Producto eliminado:', deleteResponse.message);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

cancelSubscription('subscription-id');
deleteProduct('product-id');
```

### Manejo de Webhooks

Recurrente utiliza Svix para la entrega de webhooks, lo que proporciona una capa adicional de seguridad y fiabilidad en la comunicación. Svix ayuda a garantizar que los webhooks que recibes sean legítimos y no hayan sido manipulados durante el tránsito.

#### Verificación de la Firma del Webhook

La implementación asume un enfoque de un solo endpoint, donde todos los webhooks se manejan a través de una única ruta, y se utiliza un solo `SVIX_SIGNING_SECRET` global para verificar todos los webhooks entrantes.

Para asegurar que los webhooks son auténticos, puedes utilizar la función verifySvixSignature para verificar la firma del

```
import { verifySvixSignature, handleWebhookEvent } from 'recurrente-webhooks';

// En tu controlador de webhooks
app.post('/webhook', (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    const headers = req.headers;

    // Verificar la firma y obtener el evento
    const event = verifySvixSignature(payload, headers);

    // Procesar el evento
    handleWebhookEvent(event);

    res.status(200).send('Webhook procesado');
  } catch (error) {
    console.error('Error al procesar el webhook:', error);
    res.status(400).send('Firma de webhook inválida');
  }
});
```

#### Manejar Eventos de Webhook

La función handleWebhookEvent se encarga de despachar el evento al manejador registrado correspondiente basado en el tipo de evento recibido.

#### Registrar Manejadores de Eventos de Webhook

##### En Next.js (v14+)

En Next.js 14, los handlers no se registran automáticamente en cada solicitud. Debes asegurarte de registrarlos en cada petición, una posible solución es registrarlos bajo una función al mismo nivel de tu ruta de API:

```
// api/webhook/handlers.ts
import { registerWebhookHandler } from 'recurrente-js/webhooks';

let handlersRegistered = false;

export function initializeWebhookHandlers() {
  if (handlersRegistered) return;

  registerWebhookHandler('payment_intent.failed', (event) => {
    console.log('Manejador personalizado de payment_intent.failed activado!');
  });

  registerWebhookHandler('payment_intent.succeeded', (event) => {
    console.log('Manejador personalizado de payment_intent.succeeded activado!');
  });

  handlersRegistered = true;
}
```

Para luego llamar esa función en tu ruta:

```

// /api/webhook/route.ts
import { NextResponse } from 'next/server';
import { initializeWebhookHandlers } from '../../handlers';
import { handleWebhookEvent, verifySvixSignature } from 'recurrente-js/webhooks';

export async function POST(req: Request) {
  initializeWebhookHandlers(); // Asegura que los handlers estén registrados

  const body = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id'),
    'svix-timestamp': req.headers.get('svix-timestamp'),
    'svix-signature': req.headers.get('svix-signature'),
  };

  try {
    const event = verifySvixSignature(body, headers);
    handleWebhookEvent(event);
    return NextResponse.json({ status: 'Webhook procesado' });
  } catch (error) {
    return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 });
  }
}
```

##### En una App Normal con Express

En Express, puedes registrar los handlers globalmente al iniciar el servidor:

```
// app.ts
import express from 'express';
import { verifySvixSignature, handleWebhookEvent, registerWebhookHandler } from 'recurrente-js/webhooks';

const app = express();
app.use(express.json());

// Registra los handlers una vez al iniciar la app
registerWebhookHandler('payment_intent.failed', (event) => {
  console.log('¡Handler personalizado de payment_intent.failed activado!');
});

registerWebhookHandler('payment_intent.succeeded', (event) => {
  console.log('¡Handler personalizado de payment_intent.succeeded activado!');
});

app.post('/webhook', (req, res) => {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;

  try {
    const event = verifySvixSignature(payload, headers);
    handleWebhookEvent(event);
    res.status(200).send('Webhook procesado');
  } catch (error) {
    res.status(400).send('Firma de webhook inválida');
  }
});

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
```

#### Eventos Disponibles

- payment_intent.succeeded
- payment_intent.failed
- subscription.create
- subscription.past_due
- subscription.paused
- subscription.cancel

Puedes registrar manejadores para estos eventos según tus necesidades utilizando `registerWebhookHandler`.

### Contribuir

Si deseas contribuir al proyecto, sigue estas pautas y asegúrate de cumplir con los estándares y buenas prácticas definidos:

1. **Haz un fork del repositorio** y clona el proyecto localmente.
2. **Crea una nueva rama** para tu funcionalidad o corrección (`git checkout -b nueva-funcionalidad`).
3. **Realiza los cambios necesarios** en el código, asegurándote de seguir las guías de estilo y prácticas establecidas:
   - **Mensajes de Commit**: Asegúrate de que tus commits sigan la convención de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para mantener un historial claro y estructurado.
   - **Linting y Estilo**: Este proyecto utiliza la [Google TypeScript Style Guide](https://github.com/google/gts) y tiene integrado el sistema `gts` para asegurar un código consistente. Utiliza los siguientes comandos:
     1. `npm run lint`: Verifica que el código siga las reglas de estilo.
     2. `npm run fix`: Corrige automáticamente los errores de estilo.
     3. `npm run clean`: Limpia archivos generados automáticamente.
   - **Nomenclatura**: Las interfaces, variables y funciones deben seguir la convención de `camelCase`. Para manejar casos en los que se requiera `snake_case`, el proyecto incluye utilidades para convertir entre estos formatos.
   - **Escribe tests**: Antes de integrar nuevas funcionalidades, asegúrate de crear los tests correspondientes. El proyecto utiliza `jest` para pruebas unitarias. Ejecuta los tests con `npm run test` y verifica que todo funcione correctamente antes de enviar los cambios.
4. **Haz commit de tus cambios** usando un mensaje descriptivo (`git commit -am 'feat: agrega nueva funcionalidad'`).
5. **Haz push a tu rama** (`git push origin nueva-funcionalidad`).
6. **Crea un pull request** desde tu repositorio forkeado hacia el repositorio original para revisión.

## Contacto

Si tienes preguntas o sugerencias, no dudes en contactarme:

Correo electrónico: herdezx@gmail.com

Invitame un almuerzo: https://app.recurrente.com/s/pc-store/almuerzo

---

Este proyecto fue creado para facilitar la integración de pagos recurrentes en una SaaS que me encuentro desarrollando. Si te ha sido útil, considera compartirlo o contribuir para mejorarlo. ¡Gracias!
