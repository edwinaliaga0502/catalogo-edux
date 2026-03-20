# 🚀 Guía de Despliegue - Catálogo EDUX IMPORT

¡Felicidades! Tu catálogo está listo. Sigue estos pasos para ponerlo en línea y activar el panel de administración.

## Paso 1: Subir a GitHub (Sin usar códigos)
Para que el panel de control (`/admin`) funcione, tus archivos deben estar en GitHub.
1. Entra a [GitHub.com](https://github.com) y crea una cuenta si no tienes una.
2. Haz clic en el botón **"New"** (Verde) para crear un nuevo repositorio.
3. Ponle un nombre, por ejemplo: `catalogo-edux`.
4. Déjalo en **Public** y haz clic en **"Create repository"**.
5. En la siguiente pantalla, busca donde dice **"uploading an existing file"**.
6. **Arrastra y suelta** todos los archivos de tu carpeta `Catalogo Edux` (index.html, data.json, script.js, la carpeta admin, etc.).
7. Haz clic en el botón verde **"Commit changes"**.

## Paso 2: Conectar con Netlify
1. Ve a [Netlify.com](https://netlify.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2. Haz clic en **"Add new site"** -> **"Import from existing project"**.
3. Selecciona **GitHub**. Te pedirá permiso, acéptalo.
4. Busca y selecciona tu repositorio `catalogo-edux`.
5. Haz clic en **"Deploy site"**. ¡Tu web ya tiene una dirección (URL)!

## Paso 3: Activar el Panel de Administración (MUY IMPORTANTE)
En el panel de Netlify de tu nuevo sitio:
1. Ve a **Site configuration** -> **Identity**.
2. Haz clic en **"Enable Identity"**.
3. Baja hasta **Registration preferences**, dale a **Edit settings** y cámbialo a **"Invite only"**.
4. Baja más hasta **Services** -> **Git Gateway** y haz clic en **"Enable Git Gateway"**.

## Paso 4: Crear tu usuario para el Admin
1. En la misma pestaña de **Identity**, haz clic en el botón **"Invite users"**.
2. Escribe tu correo electrónico.
3. Recibirás un correo de Netlify. Haz clic en el enlace, crea tu contraseña y ¡LISTO!

---
### ¿Por qué la página salía en blanco?
1. **Mismatch de Datos**: He corregido la estructura interna de los archivos para que el panel de administración pueda leerlos correctamente.
2. **Local vs Producción**: Recuerda que el panel de administración **solo funciona cuando la web ya está subida a Netlify**. Si intentas abrirlo desde tu computadora, siempre se verá en blanco o dará error.

---
### ¿Cómo editar?
Una vez subida a Netlify, solo tienes que entrar a: `tu-web.netlify.app/admin`
Ingresas con tu correo y la contraseña que creaste, y verás el panel visual para subir productos y cambiar precios.
