# Vela · PWA

Lector guiado para entrenar la lectura. Funciona sin internet después de la primera visita.

## Archivos

```
index.html        La app completa
manifest.json     Nombre, colores e íconos para instalarla
sw.js             Service worker: guarda todo para usarla sin internet
lib/              pdf.js 3.11.174 y JSZip 3.10.1 (para leer PDF y EPUB)
fonts/            Sora y Literata (fuentes variables)
icons/            Íconos 192, 512, maskable y Apple
```

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo, por ejemplo `vela`.
2. Sube todo el contenido de esta carpeta a la raíz del repositorio.
3. En el repositorio entra a Settings → Pages, elige la rama `main` y la carpeta `/ (root)`.
4. Abre `https://TU-USUARIO.github.io/vela/` en el celular.
5. En Android (Chrome): menú ⋮ → "Instalar app". En iPhone (Safari): Compartir → "Agregar a pantalla de inicio".

Cualquier hosting con HTTPS sirve igual (Netlify, Firebase Hosting, Vercel). Usa siempre rutas relativas, como ya están.

## Probarla en tu computadora

```
cd vela-pwa
python -m http.server 8000
```

Abre `http://localhost:8000`. Si abres el `index.html` con doble clic, el service worker no funciona.

## Cuando cambies algo

Sube el número de `VERSION` en `sw.js` (por ejemplo `vela-v1` → `vela-v2`). Así los celulares descartan la copia vieja y descargan la nueva. La app recibe la versión nueva la siguiente vez que se abra con internet.

## Datos

Los libros se guardan en IndexedDB y las estadísticas en localStorage, solo en ese dispositivo. La app pide almacenamiento persistente para que el navegador no los borre cuando falte espacio.

Si desinstalas la app o borras los datos del sitio, se pierden los libros y el historial.

## Abrir PDFs desde el explorador de archivos

En Chrome de escritorio, con la app instalada, puedes hacer clic derecho en un PDF o EPUB → "Abrir con" → Vela. Esto viene configurado en `file_handlers` del manifest.

## Empaquetar con Capacitor

1. Copia esta carpeta como `www/` de tu proyecto Capacitor (`webDir: "www"` en `capacitor.config`).
2. `npx cap sync android`.
3. Para que la pantalla no se apague mientras lees, instala `@capacitor-community/keep-awake` y llama `KeepAwake.keepAwake()` al dar play y `KeepAwake.allowSleep()` al pausar (en las funciones `play()` y `pause()` de `index.html`). El método del navegador (`navigator.wakeLock`) no siempre funciona dentro del WebView.
4. Dentro de Capacitor el service worker no hace falta, porque los archivos ya van incluidos en el APK.
