-- Actualizar las guías con las URLs de las imágenes de portada
UPDATE public.guides 
SET image_url = '/guides/habitos-mujer-cover.png'
WHERE title = 'Hábitos Mujer';

UPDATE public.guides 
SET image_url = '/guides/reto-21-dias-mujer-cover.png'
WHERE title = 'Reto 21 Días Mujer';