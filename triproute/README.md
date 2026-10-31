# TripRoute RD

Asistente de viajes por República Dominicana. Eliges lugares en un mapa, la app
los reparte entre los días del viaje en el orden más razonable, calcula horarios
y traslados, controla el presupuesto y te da el itinerario listo para compartir
o imprimir.

Web estática: no hay servidor, ni base de datos, ni cuenta de usuario. Todo se
guarda en el propio teléfono. Funciona sin conexión una vez instalada.

---

## Cómo se usa

1. **Viaje** — destino, fechas, personas, presupuesto, ritmo y dónde duermes.
2. **Lugares** — busca en el mapa o en el catálogo y toca `+` para meter sitios
   en el viaje. También puedes tocar cualquier punto del mapa para añadir uno tuyo.
3. **Itinerario** — pulsa *Optimizar*: reparte las paradas por días y las ordena.
   Después puedes arrastrarlas a mano con el asa (⠿) o moverlas con los botones.
4. **Gastos** — presupuesto estimado a partir del itinerario, línea a línea.
5. **Resumen** — texto para WhatsApp, PDF, archivo `.ics` para el calendario y
   un enlace por día que abre la ruta completa en Google Maps.

## Cómo correrlo

Hace falta servirlo por HTTP (la app usa módulos de JavaScript, que no funcionan
abriendo el archivo con doble clic):

```bash
cd triproute
python3 -m http.server 4173
```

Y abrir <http://localhost:4173>. En el móvil, con el ordenador y el teléfono en
la misma red, la IP del ordenador: `http://192.168.x.x:4173`.

Para publicarlo (GitHub Pages, Netlify, Vercel…) basta con subir la carpeta tal
cual: no hay nada que compilar.

## Instalarlo en el iPhone

1. Abre la web en **Safari** (en Chrome iOS no aparece la opción).
2. Botón de compartir → **Añadir a pantalla de inicio**.
3. Se abre a pantalla completa, sin barra del navegador, y funciona sin conexión.

---

## Qué cambió respecto al prototipo

El prototipo era un único `index.html` de ~830 líneas con el HTML, el CSS, el
JavaScript y los datos mezclados, y funciones globales llamadas desde `onclick`.
Funcionaba, pero cada mejora obligaba a tocar ese archivo entero.

### Arquitectura

```
triproute/
├── index.html              Cáscara de la app (nada de lógica)
├── manifest.json           PWA
├── sw.js                   Service worker: la app entera, offline
├── css/
│   ├── app.css             Estilos (claro y oscuro)
│   └── print.css           Hoja de impresión → PDF
├── vendor/leaflet/         Leaflet 1.9.4 local, sin CDN
└── js/
    ├── main.js             Arranque
    ├── store.js            Estado único + persistencia + acciones
    ├── util.js  geo.js     Utilidades puras (fechas, horas, dinero, esfera)
    ├── data/
    │   ├── catalog.js      Categorías, ritmos, estilos, partidas de gasto
    │   └── places/         Catálogo por regiones (ver places/_schema.md)
    ├── services/
    │   ├── config.js       Clave de Google y qué APIs están activas
    │   ├── travel.js       Distancias y tiempos (estimados o Routes API)
    │   ├── places-api.js   Búsqueda local + Places API (New)
    │   └── map/            provider.js → leaflet.js | google.js
    ├── core/
    │   ├── planner.js      Reparto por días + optimización del orden
    │   ├── schedule.js     Línea de tiempo de un día y sus avisos
    │   ├── budget.js       Presupuesto a partir del itinerario
    │   └── exporters.js    Texto, PDF, .ics, descargas
    └── ui/
        ├── tabs.js  modal.js  toast.js  dragsort.js  map-host.js
        └── views/          trip · explore · itinerary · budget · summary · settings
```

Tres reglas que explican el resto:

- **Un solo estado.** Todo vive en `store.js` y se toca con acciones
  (`pickPlace`, `moveItem`, `setTrip`…). No hay variables globales sueltas ni
  `onclick="funcionGlobal()"` en el HTML.
- **Los datos no son código.** Los lugares están en `js/data/places/*.js`,
  uno por región. Añadir sitios es copiar un bloque y cambiar los campos.
- **El mapa es intercambiable.** Las vistas hablan con una interfaz
  (`setMarkers`, `setRoute`, `focus`, `fitTo`…) que implementan Leaflet y Google
  Maps por separado. Cambiar de uno a otro es un interruptor en Ajustes.

### Optimizador de rutas

El prototipo encadenaba las paradas por cercanía (vecino más próximo) y partía
la lista en trozos iguales. Ahora son cuatro pasos:

1. **Reparto por días.** Con base fija se agrupan los lugares por zonas
   (k-means sobre las coordenadas) para que cada día conduzcas menos; en ruta de
   paso se hace un recorrido único y se corta por la capacidad de cada día.
2. **Orden dentro del día.** Vecino más próximo como punto de partida y luego
   búsqueda local **2-opt + or-opt**, que es lo que elimina las idas y vueltas.
3. **El coste no es solo el camino.** Cada orden candidato se *simula* entero:
   suma minutos de carretera, pero también penaliza llegar a un sitio cerrado,
   llegar tarde a una hora fijada, ver un mirador a mediodía en vez de al
   atardecer, esperar a que abran y pasarse de la hora de fin del día.
4. **Reparación entre días.** Si mover una parada a otro día mejora el conjunto,
   se mueve. Es lo que saca del lunes el museo que cierra los lunes.

Además respeta: horas fijas (reservas, barcos, tours), horarios de apertura,
cierres semanales conocidos, días marcados como *traslado* o *libre*, el ritmo
elegido (colchón entre paradas) y la parada para comer —que se salta si la
visita de mediodía es larga y ya se come allí—.

### Otras mejoras

| | Prototipo | Ahora |
|---|---|---|
| Lugares | 28, en el JS | 103 en 25 provincias, por regiones y documentados |
| Orden | Vecino más próximo | 2-opt + or-opt sobre horario simulado |
| Días | Reparto en trozos iguales | Por zonas o en ruta, con capacidad real |
| Reordenar | No se podía | Arrastrar (táctil), botones ↑↓ y "mover a día" |
| Salidas | Texto | Texto, PDF, `.ics`, enlaces de ruta, copia `.json` |
| Fechas | Una etiqueta por día | Días reales, con nota, horario y tipo propios |
| Presupuesto | Siete campos fijos | Estimado desde el itinerario, editable, por persona |
| Avisos | Ninguno | Cerrado, llegas tarde, se sale del día, cierra los lunes |
| Offline | No | Service worker; Leaflet local, sin CDN |
| Diálogos | `alert()` y `prompt()` | Hojas inferiores y avisos no bloqueantes |
| Tema | Claro | Claro y oscuro automáticos |

Los tips de cada lugar siguen estando, se pueden sobrescribir con tus propias
notas, y los datos del prototipo (viaje, itinerario y tips guardados en
`localStorage`) se importan solos la primera vez que abres esta versión.

---

## Google Maps Platform

La app funciona **sin ninguna clave**: mapa de OpenStreetMap y tiempos
estimados. Si pones una clave en **Ajustes** (⚙️), se activan tres cosas,
cada una opcional:

| API | Para qué | Qué pasa sin ella |
|---|---|---|
| **Maps JavaScript API** | Mapa de Google | Se usa Leaflet/OpenStreetMap |
| **Places API (New)** | Buscar cualquier sitio de RD por nombre, y el botón *Ajustar GPS* que corrige las coordenadas de un lugar | Solo se busca en el catálogo local |
| **Routes API** | Tiempos de conducción reales entre paradas | Se estiman por distancia y tipo de carretera |

Pasos:

1. En [Google Cloud](https://console.cloud.google.com/google/maps-apis/api-list),
   crea un proyecto, activa las APIs que quieras y crea una clave.
2. **Restringe la clave por referente HTTP** a tu dominio (por ejemplo
   `https://tuusuario.github.io/*`). Una clave sin restringir y publicada en una
   web la puede usar cualquiera y la factura es tuya.
3. Pégala en Ajustes. Se guarda solo en ese navegador; no viaja a ningún sitio
   ni está en el código.

Los tiempos que devuelve Routes se guardan en caché por tramo, así que recalcular
el itinerario no vuelve a gastar cuota.

---

## Añadir o corregir lugares

Todo está en [`js/data/places/`](js/data/places/), un archivo por región, con el
formato explicado en [`_schema.md`](js/data/places/_schema.md). Añadir un sitio
es copiar un bloque:

```js
{
  id: "playa-caleton", name: "Playa Caletón",
  province: "María Trinidad Sánchez", town: "Río San Juan",
  lat: 19.6389, lng: -70.0686,
  type: "playa", dwell: 120, price: 0,
  hours: null, best: "manana",
  desc: "Cala pequeña de arena blanca y agua tranquila.",
  tip: "Llega antes de las 10:00: es diminuta y se llena.",
  tags: ["familia", "comida-cerca"]
}
```

**Las coordenadas son aproximadas** (del orden de 100–500 m). Sirven de sobra
para ordenar una ruta, pero no para navegar a ciegas. Dos formas de afinarlas:
el botón *Ajustar GPS* de la ficha (necesita Places API), o editar `lat`/`lng`
a mano con el valor que dé Google Maps. Los precios y horarios cambian a menudo
en RD: trátalos como una estimación.

---

## Siguiente paso recomendado

Por orden de valor respecto al esfuerzo:

1. **Publicarla.** GitHub Pages sobre esta carpeta y listo. Sin eso, "añadir a
   pantalla de inicio" obliga a tener el ordenador encendido.
2. **Compartir un viaje por enlace.** Serializar el estado comprimido en el hash
   de la URL (`#plan=...`). Sigue sin backend y resuelve el 80 % de "pásamelo".
   Un par de tardes.
3. **Backend, solo cuando haga falta de verdad.** El disparador es querer que
   dos personas editen el mismo viaje desde dos teléfonos. La vía más corta es
   Supabase o Firebase: autenticación por correo o Google, una tabla `trips` con
   el JSON del estado y `updated_at`, y sincronizar al guardar. `store.js` ya
   está aislado: cambiar `localStorage` por "localStorage + nube" se toca en un
   solo archivo.
4. **Fotos de los lugares.** El prototipo usaba imágenes de Unsplash que no se
   correspondían con el sitio real. Mejor: Places Photos (de pago) o fotos
   propias en `assets/` referenciadas desde el catálogo.
5. **Tráfico y horarios reales.** Routes API con `TRAFFIC_AWARE` y la hora
   prevista de salida, y horarios de apertura desde Places en vez de los fijos
   del catálogo.
6. **App nativa, si alguna vez hace falta.** Capacitor envuelve esto tal cual y
   da notificaciones y GPS en segundo plano. Solo merece la pena si se quiere
   avisar "sal ya para llegar a tu reserva".

---

## Detalles técnicos

- Sin framework, sin build, sin `node_modules`. Módulos ES nativos.
- Leaflet 1.9.4 local en `vendor/` (BSD-2-Clause). Los *tiles* vienen de CARTO
  sobre OpenStreetMap y sí necesitan conexión: sin ella el mapa se queda gris y
  el resto de la app sigue funcionando.
- Probado en Safari iOS, Chrome Android y navegadores de escritorio.
- Para iOS: inputs de 16 px (Safari no hace zoom al enfocarlos), objetivos
  táctiles de 44 px o más, `env(safe-area-inset-*)` para el notch y la barra
  inferior, arrastre con Pointer Events (el *drag & drop* nativo no existe en
  Safari móvil) y hojas inferiores en vez de `alert()`.
- El PDF se genera con la impresión del navegador y `print.css`. En el iPhone:
  *Compartir → Imprimir → pellizcar sobre la vista previa → Guardar en Archivos*.
