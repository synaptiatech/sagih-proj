# Sistema de gestión de hoteles

## Generar imagen docker

Para generar las imágenes docker del API Rest y el cliente, se debe ejecutar el siguiente comando su respectiva carpeta. Se deberá especificar la etiqueta según el proceso que se encuentre el proyecto a compilar

- alpha: Versión en fase de pruebas internas
- beta: Versión en fase de prueba
- latest: Versión final

### API Rest

```sh
docker build --force-rm -t macochave/sagih-api:tag .
```

### Cliente web

```sh
docker build --force-rm -t macochave/sagih-web:tag .
```
