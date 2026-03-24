import { VARS } from '../config/vars.config.js';

export const generateHTML = ({ username, password }) => {
	console.log('CREANDO CUERPO DE CORREO', { username, password });
	const html = `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
</head>

<body style="padding: 1rem; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
    <main style="padding: 2rem 2rem; display: flex; place-content: center; place-items: center;">
        <div style="border-radius: 16px; padding: 1rem 1rem; position: relative;">
            <div
                style="position: absolute; background-color: #146bcc; width: 64px; height: 64px; border-radius: 50%; top: -2rem; display: flex; place-content: center; place-items: center;">
            </div>
            <h1 style="color: #146bcc;">
                Sistema Administrativo de Gestión de la Industria Hotelera - SAGIH
            </h1>
            <p>
                Se ha creado un usuario en el sistema para ti, tus datos de acceso lo
                encuentras abajo. Recomendamos cambiar tu contraseña.
            </p>
            <p><b>Usuario:</b> ${username}</p>
            <p><b>Contraseña:</b> ${password}</p>
            <a style="background-color: #146bcc; color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; line-height: 2;"
                href="${VARS.API_SERVER_URL}">Iniciar
                sesión</a>
        </div>
    </main>
</body>

</html>`;
	return html;
};
