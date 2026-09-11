# Módulo Funcional — MakersPay

Producto ficticio: **MakersPay**, billetera digital. El usuario inicia sesión, ve su saldo, y envía dinero a otro usuario registrado usando su número de celular.

## 1. Técnicas y tipos de prueba utilizados

Skills usadas: `risk-based-testing` (matriz de riesgo) → `test-planning` (escenarios) → `test-case-management` (casos de prueba formales). Plantilla de reporte de bug tomada de `ai-bug-triage` (solo el formato, sin su parte de clustering por IA).

- **Partición de equivalencia**: clases válidas (monto entre $5.000 y $2.000.000, saldo suficiente) vs. inválidas (bajo el mínimo, sobre el máximo, saldo insuficiente).
- **Análisis de valores límite (BVA)**: $4.999 / $5.000 / $5.001 y $1.999.999 / $2.000.000 / $2.000.001.
- **Tabla de decisión**: combinación de condiciones (saldo suficiente, monto dentro de rango, destinatario válido, destinatario ≠ remitente) para derivar el resultado esperado.
- **Pruebas negativas**: montos inválidos, destinatario inexistente, auto-envío.
- **Pruebas funcionales / de reglas de negocio**: verificación de efectos posteriores a una transacción exitosa (saldo y historial en ambas cuentas).
- **Pruebas de no regresión implícitas**: el saldo no debe alterarse cuando la transacción falla.
- **Tipo de prueba**: pruebas funcionales de caja negra (black-box), manuales.

## 2. Matriz de riesgo (Impacto × Probabilidad)

| Área | Riesgo | Impacto de negocio | Notas |
|---|---|---|---|
| Transferencia de dinero (happy path) | Crítico | Alto — es la función core del producto | Alto impacto y alta probabilidad de uso; probar primero. |
| Validación de saldo insuficiente | Crítico | Alto — riesgo de saldo negativo / dinero fantasma | Combinación de alto impacto y alta frecuencia de intentos con montos altos. |
| Límites de monto (mín/máx) | Importante | Alto si falla — permite transacciones fuera de política (AML/límites regulatorios) | Impacto alto, probabilidad de que el usuario toque el límite exacto es menor. |
| Auto-envío (mismo número) | Importante | Medio-alto — bug lógico visible para el usuario | Catastrófico si falla silenciosamente, pero de baja frecuencia. |
| Actualización de historial de movimientos | Monitorear | Medio — afecta confianza/soporte, no el dinero en sí | Se rompe con frecuencia moderada en refactors de UI, severidad menor. |
| Mensajes de error en transacción fallida | Monitorear | Medio — mala UX, tickets de soporte | Alta frecuencia (cualquier intento fallido), impacto bajo si el mensaje es solo poco claro. |
| Concurrencia (doble clic / doble envío) | Backlog (a validar) | Alto si ocurre, pero baja probabilidad reportada | Ver bug simulado BUG-002. |

## 3. Escenarios de prueba

1. Usuario autenticado envía un monto válido a un destinatario válido y distinto de sí mismo → transacción exitosa.
2. Usuario intenta enviar un monto menor al mínimo permitido.
3. Usuario intenta enviar un monto mayor al máximo permitido.
4. Usuario intenta enviar más dinero del saldo disponible.
5. Usuario intenta enviarse dinero a su propio número de celular.
6. Usuario envía exactamente el saldo disponible (monto = saldo).
7. Usuario envía a un número de celular no registrado en el sistema.
8. Verificación de que una transacción exitosa actualiza el saldo e historial de remitente y destinatario.
9. Verificación de que una transacción fallida no modifica saldo ni historial de ninguna de las dos cuentas.

## 4. Casos de prueba

| ID | Título | Precondición | Pasos | Resultado esperado | Prioridad |
|---|---|---|---|---|---|
| TC-01 | Transferencia exitosa, monto válido | Usuario autenticado, saldo ≥ $50.000, destinatario registrado y distinto del remitente | 1. Ir a "Enviar dinero". 2. Ingresar celular del destinatario. 3. Ingresar monto $50.000. 4. Confirmar. | Transacción exitosa; saldo del remitente disminuye en $50.000; saldo del destinatario aumenta en $50.000; el movimiento aparece en el historial de ambos. | Alta |
| TC-02 | Monto exactamente en el límite mínimo ($5.000) | Saldo ≥ $5.000, destinatario válido | Enviar $5.000 al destinatario | Transacción exitosa (el límite es inclusive). | Alta |
| TC-03 | Monto por debajo del mínimo ($4.999) | Saldo ≥ $4.999, destinatario válido | Enviar $4.999 | Error claro: "El monto mínimo por transacción es $5.000 COP"; saldo no se modifica. | Alta |
| TC-04 | Monto exactamente en el límite máximo ($2.000.000) | Saldo ≥ $2.000.000, destinatario válido | Enviar $2.000.000 | Transacción exitosa (el límite es inclusive). | Alta |
| TC-05 | Monto por encima del máximo ($2.000.001) | Saldo ≥ $2.000.001, destinatario válido | Enviar $2.000.001 | Error claro: "El monto máximo por transacción es $2.000.000 COP"; saldo no se modifica. | Alta |
| TC-06 | Saldo insuficiente | Saldo = $10.000, destinatario válido | Enviar $50.000 | Error claro de saldo insuficiente; saldo del remitente permanece en $10.000. | Alta |
| TC-07 | Envío del saldo exacto disponible | Saldo = $30.000, destinatario válido | Enviar $30.000 | Transacción exitosa; saldo del remitente queda en $0. | Media |
| TC-08 | Auto-envío (mismo número de celular) | Usuario autenticado | Ingresar el propio número de celular como destinatario y un monto válido | Error claro: "No puedes enviarte dinero a ti mismo"; no se ejecuta la transacción. | Alta |
| TC-09 | Destinatario no registrado | Usuario autenticado | Ingresar un número de celular que no existe en el sistema | Error claro: "El destinatario no existe"; saldo no se modifica. | Alta |
| TC-10 | Monto no numérico / vacío | Usuario autenticado | Dejar el campo monto vacío o ingresar texto | Validación de campo obligatorio / formato antes de permitir enviar. | Media |
| TC-11 | Monto negativo o cero | Usuario autenticado | Ingresar $0 o -$1.000 | Rechazado por validación de monto mínimo (equivalente a TC-03). | Media |
| TC-12 | Historial refleja el movimiento en ambas cuentas | Transacción exitosa (post TC-01) | Revisar historial del remitente y del destinatario | Ambos historiales muestran el movimiento con monto, fecha y contraparte correctos. | Alta |
| TC-13 | Saldo no se afecta ante transacción fallida | Cualquier caso fallido (TC-03, TC-05, TC-06, TC-08, TC-09) | Verificar saldo antes y después del intento fallido | El saldo permanece exactamente igual antes y después. | Alta |
| TC-14 | Formato de número de celular inválido | Usuario autenticado | Ingresar un número con letras o longitud incorrecta | Validación de formato antes de intentar la transacción. | Media |
| TC-15 | Doble envío accidental (doble clic en confirmar) | Usuario autenticado, saldo suficiente para una sola transacción | Hacer doble clic rápido en "Confirmar" | Solo se ejecuta una transacción; el botón se deshabilita tras el primer clic. Ver BUG-002. | Alta |

## 5. Reporte de bugs (simulados)

### BUG-001 — Mensaje de error genérico al superar el monto máximo

- **Severidad:** Media | **Prioridad:** Alta
- **Módulo:** Envío de dinero
- **Pasos para reproducir:** 1) Iniciar sesión. 2) Ir a "Enviar dinero". 3) Ingresar un destinatario válido y un monto de $2.500.000. 4) Confirmar.
- **Resultado esperado:** Mensaje específico: "El monto máximo por transacción es $2.000.000 COP".
- **Resultado actual (simulado):** El sistema muestra un mensaje genérico "Ocurrió un error, intenta de nuevo", sin indicar la causa ni el límite permitido.
- **Impacto:** El usuario no entiende por qué falló y puede reintentar sin cambiar el monto, generando tickets de soporte.

### BUG-002 — Riesgo de doble transacción por doble clic

- **Severidad:** Alta | **Prioridad:** Alta
- **Módulo:** Envío de dinero
- **Pasos para reproducir:** 1) Iniciar sesión con saldo suficiente para exactamente una transacción. 2) Completar el formulario de envío. 3) Hacer doble clic rápido sobre "Confirmar" antes de que la UI responda.
- **Resultado esperado:** Se ejecuta una sola transacción; el botón se deshabilita inmediatamente tras el primer clic.
- **Resultado actual (simulado, riesgo identificado por análisis de la regla "no enviar más del saldo disponible"):** Si el backend no es idempotente y el frontend no deshabilita el botón durante el request, existe riesgo de que ambos clics disparen la transacción antes de que el saldo se actualice, permitiendo enviar más del saldo disponible.
- **Impacto:** Viola directamente la regla de negocio "el usuario no puede enviar más dinero del saldo disponible"; riesgo financiero directo.
- **Recomendación:** deshabilitar el botón de confirmar en el clic + validación de saldo atómica en el backend (no solo en el frontend).

### BUG-003 — Historial del destinatario no se actualiza en tiempo real

- **Severidad:** Baja | **Prioridad:** Media
- **Módulo:** Historial de movimientos
- **Pasos para reproducir:** 1) Usuario A envía dinero a Usuario B. 2) Usuario B, con la sesión ya abierta en otra pestaña, revisa su historial sin refrescar la página.
- **Resultado esperado:** El historial de Usuario B se actualiza (o al menos se refleja al refrescar) con el movimiento entrante.
- **Resultado actual (simulado):** El historial de Usuario B sigue mostrando el estado anterior hasta que se hace un refresh manual completo de la página.
- **Impacto:** Bajo — no afecta el saldo real, pero genera confusión momentánea ("¿me llegó o no la plata?").
