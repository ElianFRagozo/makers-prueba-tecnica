# Release Readiness — Prueba Técnica Makers

Checklist go/no-go basado en evidencia real de ejecución (skill `release-readiness`).

| Módulo | Entregable | Estado | Evidencia |
|---|---|---|---|
| 1 — Automatización | Smoke test de login (Cypress): login exitoso, contraseña incorrecta, campos obligatorios (x2) + caso extra usuario bloqueado | ✅ Done — 5/5 passing | `automation/evidence/run-output.txt`, `automation/evidence/screenshots/*.png` |
| 2 — Funcional | Escenarios, 15 casos de prueba, matriz de riesgo, técnicas declaradas, 3 bugs simulados | ✅ Done | `functional/MODULO-FUNCIONAL.md` |
| 3 — API | POST/GET sobre reqres.in + 5 casos adicionales | ✅ Done — 8/8 passing | `api/evidence/run-output.txt` |

## Hallazgo relevante (no bloqueante)

reqres.in no persiste los usuarios creados por `POST /users`: el `id` devuelto es simulado y un `GET /users/{id}` posterior responde `404`. Documentado como test explícito ("Hallazgo...") en `api/tests/reqres.test.js` en vez de ocultarlo o forzar una aserción incorrecta. No afecta el veredicto porque el contrato real de la API (creación con 201 y esquema correcto, y lectura 200 sobre datos existentes) sí se valida y pasa.

## Veredicto

**GO.** Los 3 módulos están completos, son ejecutables (`npm run test:login`, `npm run test:api`), corrieron contra los sistemas reales (no mocks locales) y dejan evidencia verificable. Sin bloqueantes.
