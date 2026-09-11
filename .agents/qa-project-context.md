# QA Project Context — Prueba Técnica Makers

## Product
MakersPay (billetera digital ficticia) + smoke test de login sobre SauceDemo (app real de demo). Tipo: prueba técnica de QA para candidato individual — no es un producto en producción.

- **Producción / staging / dev:** No aplica — SauceDemo (`https://www.saucedemo.com`) y reqres.in (`https://reqres.in/api`) son entornos públicos de terceros usados como target de pruebas; MakersPay es un producto ficticio solo para el módulo funcional (documental, sin app real que correr).
- **Journeys críticos (5):**
  1. Login exitoso con credenciales válidas (SauceDemo).
  2. Login rechazado con credenciales inválidas.
  3. Validación de campos obligatorios en login.
  4. Envío de dinero entre usuarios registrados dentro de límites de monto y saldo (MakersPay, documental).
  5. Ciclo de vida de un recurso vía API REST (crear y consultar usuario en reqres.in).

## Tech Stack
No aplica desarrollo de producto propio — este repo es exclusivamente de pruebas contra sistemas externos (SauceDemo, reqres.in) y documentación de un producto ficticio (MakersPay).

## Test Stack
### E2E
- **Framework:** Cypress 15.x
- **Config:** `automation/cypress.config.js`
- **Test Directory:** `automation/cypress/e2e/`

### API
- **Framework:** Jest 29.x + `fetch` nativo de Node 24 (sin librerías HTTP adicionales)
- **Config:** `api/jest.config.js`
- **Test Directory:** `api/tests/`

### Manual / Funcional
- **Ninguna herramienta de gestión (TestRail/Xray/Zephyr) — None selected yet.** Casos de prueba documentados en PDF en `functional/Modulo-Funcional-MakersPay.pdf`.

## CI/CD
None selected yet — es una prueba técnica de candidato individual, sin pipeline. Los tests se corren localmente (`npm run test:login`, `npm run test:api`) y la evidencia de la ejecución real queda commiteada en `automation/evidence/` y `api/evidence/`.

## Environments
- SauceDemo y reqres.in son los únicos "entornos": son servicios públicos de terceros usados tal cual, sin entorno propio de staging/producción.

## Quality Goals
Maturity: **startup / candidato individual**. Metas para esta prueba técnica:
- 100% de los 3 escenarios mínimos de login automatizados y en verde.
- 0% de flakiness tolerada en la corrida entregada (se corrió y quedó evidencia real, no simulada).
- Suite de login: <20s de duración total.
- Suite de API: <10s de duración total.

## Risk Areas
| Área | Riesgo | Impacto de negocio | Notas |
|---|---|---|---|
| Login (SauceDemo) | Importante | Alto si falla — bloquea el acceso a toda la app | Flujo simple pero es la puerta de entrada; probar primero. |
| Transferencia de dinero (MakersPay) | Crítico | Alto — riesgo financiero directo | Ver matriz de riesgo detallada en `functional/Modulo-Funcional-MakersPay.pdf`. |
| Persistencia de datos en reqres.in | Monitorear | Bajo (es un mock público) | Hallazgo real documentado: el `id` devuelto por POST no persiste para un GET posterior — ver `api/evidence/run-output.txt`. |

## Team
Candidato individual (solo QA/dev), sin equipo — dev:QA ratio "solo". Ownership model: la misma persona diseña, automatiza y documenta los 3 módulos.

## Conventions
- **Selectores E2E:** `data-test` (atributos ya expuestos por SauceDemo), no se inventan selectores CSS frágiles.
- **Naming de specs:** `*.cy.js` (Cypress), `*.test.js` (Jest).
- **Estructura:** cada módulo de la prueba técnica vive en su propia carpeta (`automation/`, `functional/`, `api/`) dentro de este repo, con su propia carpeta `evidence/` de ejecución real.
