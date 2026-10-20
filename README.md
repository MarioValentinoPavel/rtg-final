# Reescribe tu Guion · versión final

Landing de la masterclass gratuita de Mario Valentino Pavel (M.V.P). Concepto: **control de realización en directo**. La página es una emisión de televisión que pasa de recitar el guion de otros a dirigir el tuyo.

Web estática (HTML + CSS + JS, sin build). Todos los archivos están en la raíz, sin subcarpetas, para poder subirla a GitHub arrastrando los archivos.

```
rtg-final/
├── index.html         # estructura y textos
├── style.css          # estilos
├── main.js            # prompter, cuenta atrás, escaleta, palanca T, test y WhatsApp
├── cam1-coche.jpg     # CAM 1 · De copiloto
├── cam2-ascensor.jpg  # CAM 2 · Con la cámara en la mano (también en la portada)
├── .nojekyll
└── README.md
```

## Secciones

1. **Apertura**: prompter con el guion de otros en bucle, titular y monitor CAM 2 con cuenta atrás 3·2·1 y rótulo con tu nombre.
2. **Masterclass**: monitor PGM con el vídeo y «Lo que vas a aprender».
3. **Escaleta**: los 3 actos como la escaleta de un programa. El bloque que cruza el centro de la pantalla pasa a «En antena».
4. **Realización**: mesa de mezcla con palanca T entre CAM 1 (coche) y CAM 2 (ascensor), más los botones Corte y Auto.
5. **Tu turno**: test de 5 preguntas + nombre + primera línea. El resultado sale como un guion personalizado en el prompter y se envía por WhatsApp.
6. **Cierre**: «Fin de la emisión. El resto lo escribes tú.»

## Editar

- **Vídeo de la masterclass**: en `main.js`, pon el enlace de YouTube o Vimeo en `videoUrl`. Mientras esté vacío, al pulsar play sale «La masterclass se estrena muy pronto» con un botón al test.
- **WhatsApp**: el número está en `main.js` (`whatsapp: '34633712475'`) y en el pie de `index.html`.
- **Fotos**: sustituye `cam1-coche.jpg` y `cam2-ascensor.jpg` por otras con el mismo nombre (formato vertical 3:4 para que no se recorten).
- **Preguntas y resultados del test**: arrays `Q` y `RES` dentro de `main.js`.
- **Colores**: variables al principio de `style.css` (`--ink`, `--paper`, `--tally`…).

## Publicar en GitHub Pages

Con `gh` autenticado como MarioValentinoPavel:

```bash
git init
git add .
git commit -m "Reescribe tu Guion · versión final"
git branch -M main
gh repo create rtg-final --public --source=. --remote=origin --push
```

Después, en **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.
