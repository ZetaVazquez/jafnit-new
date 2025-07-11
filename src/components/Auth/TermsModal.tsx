import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-nutrition-green">
            📄 AUTORIZACIÓN DE COBRO Y CONDICIONES DEL SERVICIO
          </DialogTitle>
          <DialogDescription>
            José Antonio Dietética y Entrenamiento - Términos y Condiciones
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* AUTORIZACIÓN DE COBRO Y CONDICIONES */}
            <div className="space-y-4">
              <p className="text-gray-700">
                En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo y conforme a la normativa vigente sobre servicios y contratación electrónica, José Antonio Dietética y Entrenamiento informa y solicita el consentimiento expreso del cliente en relación con las condiciones de cobro, cancelación, y prestación de servicios.
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">1. AUTORIZACIÓN DE COBRO RECURRENTE</h3>
                <p className="text-gray-700">
                  El/la cliente autoriza expresamente a José Antonio Dietética y Entrenamiento a realizar el cargo automático mensual en su tarjeta de débito/crédito o cuenta bancaria registrada, en concepto de pago del servicio contratado (nutrición, entrenamiento, u otros servicios integrados), con carácter recurrente cada día 1 de mes.
                </p>
                <p className="text-gray-700">
                  Dicha autorización permanecerá vigente mientras exista una relación comercial activa entre el cliente y José Antonio Dietética y Entrenamiento, salvo revocación formal por parte del cliente bajo las condiciones que se detallan a continuación.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">2. CANCELACIÓN DEL COBRO Y DERECHO DE DESISTIMIENTO</h3>
                <p className="text-gray-700">
                  Para suspender el cobro del mes siguiente, el cliente deberá comunicar su intención de baja o pausa del servicio con al menos 15 días naturales de antelación a la siguiente fecha de cobro (día 1 de mes).
                </p>
                <p className="text-gray-700">
                  La solicitud de baja deberá realizarse por escrito (email o formulario habilitado en la web).
                </p>
                <p className="text-gray-700">
                  Pasado ese plazo, el cargo será procesado y no se realizarán devoluciones, salvo en los casos contemplados como fuerza mayor, debidamente acreditados (ej. hospitalización, baja médica oficial, traslado laboral documentado, etc.).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">3. COMPROMISO Y CONDICIONES DE RESULTADOS</h3>
                <p className="text-gray-700">
                  El cliente acepta que los resultados de salud, pérdida de grasa, mejora física o rendimiento deportivo no pueden garantizarse únicamente por la prestación del servicio, sino que dependen del compromiso activo y sostenido con el plan personalizado de:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Alimentación</li>
                  <li>Entrenamiento</li>
                  <li>Descanso y hábitos</li>
                </ul>
                <p className="text-gray-700">
                  Por tanto, el cliente renuncia expresamente a solicitar devoluciones del importe abonado por no obtener los resultados esperados, asumiendo que estos están condicionados a su propia participación, adherencia y constancia con las pautas facilitadas.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">4. PAGOS CON PERMANENCIA</h3>
                <p className="text-gray-700">
                  En caso de haber contratado un plan con descuento y/o permanencia obligatoria (por ejemplo: programas trimestrales o semestrales con condiciones preferenciales), no podrá cancelarse antes de su finalización, y se mantendrá el compromiso de pago íntegro hasta la fecha final del contrato, salvo causas justificadas y debidamente documentadas.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">5. TRATAMIENTO DE DATOS</h3>
                <p className="text-gray-700">
                  Los datos proporcionados serán tratados conforme a la legislación vigente en materia de protección de datos. Podrá ejercer sus derechos de acceso, rectificación o cancelación a través del correo electrónico habilitado.
                </p>
              </div>
            </div>

            {/* INFORMACIÓN SOBRE TRATAMIENTO DE DATOS PERSONALES */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-bold text-nutrition-green">🔐 INFORMACIÓN SOBRE TRATAMIENTO DE DATOS PERSONALES</h2>
              <p className="text-gray-700">
                José Antonio Dietética y Entrenamiento
              </p>
              <p className="text-gray-700">
                Conforme a lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales, se informa a los usuarios y clientes de José Antonio Dietética y Entrenamiento sobre los aspectos esenciales del tratamiento de sus datos personales:
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">🧾 1. RESPONSABLE DEL TRATAMIENTO</h3>
                <p className="text-gray-700">
                  Nombre comercial: José Antonio Dietética y Entrenamiento<br/>
                  Titular: José Antonio Figueiras Núñez<br/>
                  DNI: 34277607V<br/>
                  Dirección: Benito Viceto nº73, esc.2, 3B – 27400 Monforte de Lemos, Lugo<br/>
                  Email: josefiguenu@gmail.com
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">🎯 2. FINALIDAD DEL TRATAMIENTO</h3>
                <p className="text-gray-700">Los datos personales recogidos se utilizarán con las siguientes finalidades legítimas:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>Prestación de servicios de nutrición y entrenamiento personalizado, incluyendo el diseño de planes, asesorías, contacto y seguimiento del cliente.</li>
                  <li>Gestión administrativa y contractual de la relación cliente-profesional: facturación, agenda, pagos, comunicación por medios digitales.</li>
                  <li>Análisis del progreso físico o nutricional del cliente, mediante datos de salud y estilo de vida proporcionados voluntariamente por el interesado.</li>
                  <li>Envío de información relevante sobre el servicio contratado, novedades, cambios o mejoras, a través de correo electrónico, WhatsApp u otros medios.</li>
                  <li>Difusión de testimonios, imágenes o resultados, en caso de consentimiento explícito (ver documento de consentimiento separado).</li>
                  <li>Cumplimiento de obligaciones legales derivadas de la relación contractual (fiscales, contables, jurídicas).</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">🛡️ 3. LEGITIMACIÓN</h3>
                <p className="text-gray-700">
                  La base legal para el tratamiento es el consentimiento expreso del interesado, así como la ejecución del contrato de prestación de servicios firmado voluntariamente por ambas partes.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">⏳ 4. PLAZO DE CONSERVACIÓN</h3>
                <p className="text-gray-700">Los datos se conservarán:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Durante la vigencia del servicio contratado.</li>
                  <li>Tras la finalización, durante el tiempo necesario para cumplir con obligaciones legales (hasta 5 años por normativa fiscal).</li>
                  <li>En caso de consentimiento explícito para fines comerciales (ej. marketing), hasta que se revoque expresamente.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">🌍 5. CESIÓN Y TRANSFERENCIAS</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>No se cederán datos personales a terceros, salvo requerimiento legal o consentimiento explícito.</li>
                  <li>No se realizarán transferencias internacionales de datos.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">✅ 6. DERECHOS DEL CLIENTE</h3>
                <p className="text-gray-700">El usuario podrá ejercer en cualquier momento los siguientes derechos legales:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li><strong>Acceso:</strong> conocer qué datos se tratan y con qué finalidad.</li>
                  <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                  <li><strong>Supresión:</strong> solicitar el borrado de sus datos cuando ya no sean necesarios.</li>
                  <li><strong>Limitación del tratamiento:</strong> solicitar la restricción del uso en determinadas circunstancias.</li>
                  <li><strong>Portabilidad:</strong> recibir sus datos en formato digital y transmitirlos a otro profesional.</li>
                  <li><strong>Oposición:</strong> negarse al tratamiento de datos por motivos legítimos.</li>
                  <li><strong>Retirada del consentimiento:</strong> sin efectos retroactivos y con implicaciones sobre el servicio prestado.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  Para ejercer estos derechos, puede escribir a:<br/>
                  📧 josefiguenu@gmail.com<br/>
                  🏠 O mediante carta postal a la dirección arriba indicada.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">🚨 7. OBLIGATORIEDAD DE LOS DATOS</h3>
                <p className="text-gray-700">
                  Los datos solicitados son necesarios para la correcta prestación del servicio. En caso de no facilitar dichos datos, no podrá garantizarse el desarrollo completo del programa de nutrición o entrenamiento contratado.
                </p>
              </div>
            </div>

            {/* CONDICIONES GENERALES DE CONTRATACIÓN */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-bold text-nutrition-green">CONDICIONES GENERALES DE CONTRATACIÓN</h2>
              <p className="text-gray-700">
                José Antonio Dietética y Entrenamiento
              </p>
              <p className="text-gray-700">
                Estas condiciones regulan la contratación de los servicios ofrecidos por José Antonio Dietética y Entrenamiento (en adelante, "la Empresa") a través de su página web, y son aceptadas expresamente por el/la cliente en el momento del registro o contratación de cualquier servicio.
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">1. IDENTIFICACIÓN DE LA EMPRESA</h3>
                <p className="text-gray-700">
                  Nombre comercial: José Antonio Dietética y Entrenamiento<br/>
                  NIF: 34277607V<br/>
                  Email de contacto: josefiguenu@gmail.com<br/>
                  Domicilio: Benito Viceto, nº73, esc.2, 3B, 27400 Monforte de Lemos, Lugo
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">2. SERVICIOS CONTRATADOS</h3>
                <p className="text-gray-700">
                  Los servicios ofrecidos incluyen planes personalizados de alimentación, entrenamiento, asesoramiento y acompañamiento hábitos. La contratación da acceso a:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Entrevista inicial y evaluación personalizada.</li>
                  <li>Acceso a planes mensuales y seguimientos.</li>
                  <li>Asesoramiento profesional continuado durante el periodo contratado.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <strong>Condiciones para el cambio y evolución:</strong><br/>
                  La mejora de resultados está condicionada a la constancia en los tres pilares fundamentales: plan de alimentación, ejercicio físico y calidad del sueño. La empresa no garantiza resultados sin cumplimiento continuado de estos aspectos.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">3. PAGOS Y RENOVACIÓN</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>El pago de los servicios se realiza por adelantado, y siempre antes del día 1 de cada mes.</li>
                  <li>Si no se comunica baja con al menos 5 días naturales de antelación, el servicio se renovará automáticamente y se efectuará el cargo correspondiente.</li>
                  <li>En caso de cobro no deseado por no haber comunicado la baja en plazo, no se realizará devolución del importe salvo causa mayor debidamente justificada (enfermedad, hospitalización, fuerza mayor).</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">4. FORMA DE PAGO</h3>
                <p className="text-gray-700">Los pagos podrán realizarse mediante:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Tarjeta bancaria (pago online seguro por pasarela de pago).</li>
                  <li>Transferencia bancaria (solo bajo acuerdo previo).</li>
                  <li>No se aceptarán pagos en metálico.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">5. CANCELACIONES Y BAJAS</h3>
                <p className="text-gray-700">El cliente podrá solicitar la baja:</p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>Mediante correo electrónico a josefiguenu@gmail.com.</li>
                  <li>Con al menos 5 días de antelación al día 1 del mes siguiente.</li>
                </ul>
                <p className="text-gray-700 mt-2"><strong>Condiciones especiales:</strong></p>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>No se realizarán devoluciones de cuotas una vez iniciado el mes contratado.</li>
                  <li>Si el cliente no participa en el servicio o no sigue el plan enviado, no se generará derecho a reembolso alguno.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">6. RESPONSABILIDAD</h3>
                <ul className="list-disc list-inside text-gray-700 ml-4">
                  <li>El cliente declara estar en condiciones físicas y de salud aptas para seguir un plan de entrenamiento y/o nutrición.</li>
                  <li>La empresa no se hace responsable de consecuencias derivadas del incumplimiento del plan o de la falta de información por parte del cliente sobre condiciones de salud relevantes.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-nutrition-green">7. PROTECCIÓN DE DATOS</h3>
                <p className="text-gray-700">
                  Todos los datos personales recogidos durante el registro o el uso del servicio se tratan conforme al Reglamento General de Protección de Datos (UE 2016/679). Puedes consultar la información completa sobre protección de datos en esta misma página.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h3 className="font-semibold text-nutrition-green mb-2">📝 8. ACEPTACIÓN</h3>
                <p className="text-gray-700">
                  El usuario, al marcar la casilla de aceptación en el formulario de registro, declara haber leído y comprendido estas condiciones, y aceptarlas en su totalidad.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold text-nutrition-green mb-2">Aceptación digital por el/la cliente:</h3>
              <p className="text-gray-700">
                Mediante el registro en la web y la contratación del servicio, el/la cliente manifiesta su consentimiento expreso a las condiciones aquí expuestas.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;