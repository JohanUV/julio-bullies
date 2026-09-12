# Julio Bullies — sitio web del criadero

Sitio estático (HTML + CSS + JS, sin frameworks) para el criadero de Julio. Presenta a **Ramón Dino**
(macho Brazilian Bully), el próximo cruce con la hembra American Bully y la sección de cachorros "próximamente".
Está en **español, inglés y portugués**: el selector ES / EN / PT del menú cambia todos los textos sin recargar.

## Estructura

```
criadero-web/
├── index.html      Página única (textos base en español, con atributos data-i18n)
├── css/style.css   Tema oscuro, acento naranja, Bebas Neue
├── js/i18n.js      Traducciones ES / EN / PT (una clave por texto)
├── js/main.js      Idioma, WhatsApp, menú, galería, lightbox, videos
├── img/            Fotos de Ramón Dino en WebP (máx. 1400 px)
├── img/logo/       Logo en tres versiones (vertical, horizontal, isotipo) + favicon y og.jpg
└── video/          Dos videos MP4 540p (~3 MB c/u) con su poster .jpg
```

## Antes de publicar (datos pendientes)

Todo lo que falta se completa en `js/main.js`, en las dos primeras constantes:

1. **`WHATSAPP`**: número de Julio con código de país, sin `+` ni espacios (ej. `593991234567`).
   Mientras esté vacío, los botones de WhatsApp solo bajan a la sección de contacto.
2. **`PESO_KG`**: ya está en `45`. Cámbialo ahí si el peso varía.

Otros pendientes a confirmar con Julio:

- **La hembra.** No había fotos ni nombre; su tarjeta muestra "Fotos próximamente". Cuando lleguen, reemplazar
  la tarjeta `pcard--soon` en `index.html` por una igual a la de Ramón Dino y agregar el nombre en `js/i18n.js` (`pair.femaleName`).
- **Temperamento.** El texto es genérico; ajustarlo con lo que diga Julio.
- **Redes sociales.** Si tiene Instagram o Facebook, agregarlas al `<footer>`.

## Idiomas

- El idioma inicial se elige así: parámetro `?lang=en` en la URL → idioma guardado en el navegador → idioma del navegador → español.
- Para editar un texto, buscar su clave en `js/i18n.js` y cambiarla en los tres idiomas.

## Cómo probarlo

Abrir `index.html` con doble clic o con Live Server en VS Code.

## Cómo publicarlo

Como ModuForm: subir la carpeta a un repo de GitHub e importarlo en Vercel (ya incluye `vercel.json` con caché para imágenes y videos).

## Logo

El logo (`img/logo/`) sigue el estilo de sambakennels.com: Ramón Dino ilustrado sobre un brochazo con la bandera de Ecuador y el nombre en letras pesadas.
Se generó a partir de la foto frontal: fondo eliminado con `rembg`, estilizada con Pillow (colores planos + contorno blanco) y compuesta en
`design/logo/logo.html`. Para regenerarlo, abrir ese HTML en el navegador con `?v=v` (vertical), `?v=h` (horizontal) o `?v=m` (isotipo)
y capturarlo con fondo transparente. El nombre "Julio Bullies" es definitivo; el criadero está en Ecuador.
