-- Insertar las guías en la base de datos
INSERT INTO public.guides (title, description, pdf_url, regular_price, discounted_price, category, is_active)
VALUES 
  (
    'Hábitos Mujer',
    'Guía completa para desarrollar hábitos saludables específicamente diseñada para mujeres. Incluye consejos de nutrición, ejercicio y bienestar.',
    'habitos-mujer.pdf',
    10.00,
    5.00,
    'Nutrición y Hábitos',
    true
  ),
  (
    'Reto 21 Días Mujer',
    'Desafío de 21 días para transformar tu estilo de vida. Plan estructurado con ejercicios diarios, recetas y seguimiento de progreso.',
    'reto-21-dias-mujer.pdf',
    10.00,
    5.00,
    'Entrenamiento',
    true
  );