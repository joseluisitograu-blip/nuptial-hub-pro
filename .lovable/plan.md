

## Plan: Reforzar las paginas legales para cumplimiento Paddle

Tras revisar las tres paginas legales contra los requisitos de Paddle (Merchant of Record), las paginas cubren lo esencial pero faltan clausulas importantes que Paddle revisa antes de aprobar un dominio. Aqui van las mejoras concretas:

---

### 1. Terminos y Condiciones (`src/pages/Terms.tsx`)

Anadir las siguientes clausulas que faltan:

- **Autoridad y edad**: El usuario declara ser mayor de edad o tener autoridad para aceptar los terminos.
- **Credenciales**: Responsabilidad del usuario sobre la confidencialidad de su cuenta.
- **Veracidad de datos**: Obligacion de proporcionar informacion veraz y mantenerla actualizada.
- **Exencion de garantias**: Disclaimer de garantias implicitas (comerciabilidad, idoneidad) en la medida permitida por ley.
- **Contenido del usuario**: Licencia limitada que el usuario otorga a Click Tu Boda para alojar y mostrar su contenido unicamente para prestar el servicio.
- **Indemnizacion**: El usuario indemniza al prestador por reclamaciones derivadas de su contenido o uso indebido.
- **Consecuencias de la terminacion**: Que ocurre con los datos tras cancelar la cuenta (periodo de exportacion o eliminacion).
- **Cesion**: El usuario no puede ceder sin consentimiento; el prestador puede ceder en caso de fusion/adquisicion.
- **Fuerza mayor**: Exencion de responsabilidad por eventos fuera de control razonable.

### 2. Politica de Privacidad (`src/pages/Privacy.tsx`)

- **Responsable mas explicito**: Anadir mencion explicita como "responsable del tratamiento" (controlador de datos) con email de contacto.
- **Email de contacto**: Anadir email concreto (o referencia al formulario de contacto) para ejercer derechos ARCO.
- **Cookies mas detallado**: Ampliar la seccion de cookies con tabla de cookies utilizadas (nombre, finalidad, duracion).
- **Menores**: Anadir clausula indicando que el servicio no esta dirigido a menores de 16 anos.

### 3. Politica de Reembolso (`src/pages/Refund.tsx`)

- Esta pagina ya cumple bien los requisitos de Paddle. Solo anadir una linea reforzando que el periodo de 30 dias cuenta desde la fecha del pedido original.

### 4. Pagina de Cookies (`src/pages/Cookies.tsx` — nueva)

- Crear una pagina dedicada de Politica de Cookies con:
  - Que son las cookies
  - Tabla de cookies utilizadas (esenciales y analiticas)
  - Como gestionarlas/desactivarlas
  - Link a la Politica de Privacidad
- Anadir ruta `/cookies` en `App.tsx`
- Actualizar el enlace en `CookieBanner.tsx` para apuntar a `/cookies` ademas de privacidad
- Anadir enlace "Cookies" en el footer de `Index.tsx`
- Anadir URL en `public/sitemap.xml`

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/pages/Terms.tsx` | Anadir 7 clausulas nuevas |
| `src/pages/Privacy.tsx` | Ampliar responsable, contacto, cookies, menores |
| `src/pages/Refund.tsx` | Pequeno refuerzo en fecha de reembolso |
| `src/pages/Cookies.tsx` | Crear pagina nueva |
| `src/App.tsx` | Anadir ruta `/cookies` |
| `src/components/CookieBanner.tsx` | Anadir enlace a pagina de cookies |
| `src/pages/Index.tsx` | Anadir "Cookies" al footer |
| `public/sitemap.xml` | Anadir URL de cookies |

### Sin cambios

- No se tocan componentes de boda, dashboard, ni backend
- No se requieren migraciones de base de datos

