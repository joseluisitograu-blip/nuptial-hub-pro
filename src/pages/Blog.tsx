-- Tabla de artículos del blog
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text default '',
  content text not null,
  cover_image text default '',
  author text default 'BodasFácil',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_posts enable row level security;

-- Cualquiera puede leer posts publicados
create policy "Public read published posts" on public.blog_posts
  for select using (published = true);

-- Admin puede hacer todo
create policy "Admin full access blog" on public.blog_posts
  for all using (
    auth.uid() in (select user_id from public.user_roles where role = 'admin')
  );

-- Insertar el primer artículo
insert into public.blog_posts (slug, title, description, content, cover_image, published) values (
  'checklist-boda-completo',
  'Checklist de boda: 50 tareas que no puedes olvidar',
  'La guía definitiva para organizar tu boda paso a paso. Desde la pedida hasta el día después, todo lo que necesitas tener controlado.',
  '## Tu guía completa para organizar la boda perfecta

Organizar una boda puede parecer abrumador. Hay cientos de detalles que controlar y es fácil que algo se te escape. Por eso hemos creado este checklist completo con las 50 tareas esenciales que toda pareja debería tener en cuenta.

### 12-18 meses antes

**1. Definir el presupuesto**
Antes de empezar a buscar proveedores, sentaos juntos y definid cuánto queréis gastar. Tened en cuenta ahorros, aportaciones familiares y un margen del 10% para imprevistos.

**2. Elegir la fecha aproximada**
Pensad en la época del año que más os gusta. Tened en cuenta el clima, la disponibilidad de los invitados principales y los precios según temporada.

**3. Hacer la lista de invitados**
La lista de invitados condiciona todo lo demás: el tamaño del venue, el catering, el presupuesto. Empezad con una lista amplia y luego id ajustando.

**4. Buscar y reservar el venue**
Las fincas y espacios más demandados se reservan con más de un año de antelación. Visitad al menos 3-5 opciones antes de decidir.

**5. Contratar al fotógrafo/a**
Los buenos fotógrafos de boda también se reservan con mucha antelación. Revisad portfolios, pedid referencias y aseguraos de que su estilo encaja con el vuestro.

### 9-12 meses antes

**6. Elegir el catering**
Haced pruebas de menú con al menos 2-3 empresas. Tened en cuenta las alergias e intolerancias de vuestros invitados.

**7. Buscar el vestido de novia**
Los vestidos a medida o de diseñador necesitan entre 6-9 meses de producción más las pruebas de ajuste.

**8. Contratar la música**
DJ, banda en directo o ambos. Definid qué tipo de ambiente queréis para cada momento: ceremonia, cóctel, banquete y fiesta.

**9. Crear vuestra web de boda**
Con BodasFácil podéis tener vuestra web lista en minutos. RSVP online, playlist colaborativa, muro de fotos, agenda del día y mucho más. Todo desde 30€.

**10. Elegir las alianzas**
Visitad joyerías, probad diferentes estilos y tened en cuenta que pueden necesitar ajustes que requieren tiempo.

### 6-9 meses antes

**11. Enviar los Save the Date**
Avisad a vuestros invitados con suficiente antelación, especialmente a los que vienen de lejos.

**12. Reservar el alojamiento para invitados**
Si la boda es fuera de la ciudad, negociad tarifas especiales con hoteles cercanos.

**13. Contratar el floristería**
Las flores definen la estética de la boda. Llevad fotos de inspiración y confiad en los consejos del profesional.

**14. Planificar la luna de miel**
Investigad destinos, comparad precios y reservad con antelación para conseguir mejores ofertas.

**15. Definir la ceremonia**
Civil o religiosa, escribir vuestros votos, elegir las lecturas y la música de la ceremonia.

### 3-6 meses antes

**16. Enviar las invitaciones**
Si usáis BodasFácil, compartid el enlace o el QR directamente. Sin imprenta, sin correos perdidos.

**17. Planificar el menú definitivo**
Confirmad el menú con el catering incluyendo opciones para alérgicos y vegetarianos.

**18. Contratar el servicio de peluquería y maquillaje**
Haced una prueba con suficiente antelación para aseguraros de que os gusta el resultado.

**19. Organizar el plan de mesas**
Con BodasFácil podéis gestionar el plan de mesas directamente desde el dashboard. Los invitados lo ven solo un día antes de la boda.

**20. Preparar los discursos**
Si alguien va a dar un discurso, avisadle con tiempo para que pueda prepararlo.

### 1-3 meses antes

**21. Confirmar todos los proveedores**
Llamad a cada proveedor para reconfirmar fecha, hora y detalles.

**22. Prueba del vestido final**
Última prueba de ajuste del vestido y los complementos.

**23. Preparar la playlist**
Con BodasFácil, vuestros invitados pueden sugerir y votar canciones. La playlist se crea sola.

**24. Planificar el ensayo**
Organizad un ensayo de la ceremonia con las personas clave.

**25. Preparar el kit de emergencias**
Hilo, aguja, tiritas, ibuprofeno, agua, snacks... os salvará la vida.

### La última semana

**26. Confirmar el número final de invitados**
Revisad las confirmaciones del RSVP y dad el número definitivo al catering.

**27. Preparar los pagos finales**
Tened preparados los sobres o transferencias para los proveedores del día.

**28. Delegar responsabilidades**
Asignad a personas de confianza tareas concretas para el día de la boda.

**29. Preparar las maletas**
Maleta para la noche de bodas y maleta para la luna de miel.

**30. Descansar**
En serio. Dormid bien, comed bien y disfrutad del momento.

---

### Bonus: las 20 tareas que se suelen olvidar

31. Cambiar el nombre en los documentos oficiales (si aplica)
32. Contratar un seguro de boda
33. Preparar los regalos para los padrinos
34. Organizar el transporte de invitados
35. Preparar un plan B para lluvia
36. Elegir las lecturas de la ceremonia
37. Preparar la música de entrada de la novia
38. Confirmar el horario con el DJ
39. Preparar la lista de fotos imprescindibles para el fotógrafo
40. Organizar el after party
41. Preparar el libro de firmas (con BodasFácil es digital)
42. Contratar un vídeo de boda
43. Elegir el ramo de novia
44. Preparar los centros de mesa
45. Confirmar el código de vestimenta
46. Preparar las bolsas de bienvenida para invitados de fuera
47. Organizar el momento del ramo
48. Preparar la decoración del coche
49. Elegir el pastel de boda
50. Escribir las notas de agradecimiento

---

## ¿Necesitas ayuda para organizar tu boda?

Con **BodasFácil** tienes un checklist integrado en tu dashboard, junto con control de presupuesto, gestión de regalos y la web de boda más completa del mercado. Todo desde 30€, pago único.

👉 [Crear mi boda en bodasfacil.com](https://bodasfacil.com/auth)',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
  true
);
