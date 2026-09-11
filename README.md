# Prueba Técnica QA — Makers

Repo con los 3 módulos de la prueba técnica: Automatización (SauceDemo), Funcional (MakersPay) y API (reqres.in).

## Estructura

```
automation/   Módulo 1 — Smoke test de login (Cypress) contra https://www.saucedemo.com
functional/   Módulo 2 — Escenarios, casos de prueba y bugs simulados de MakersPay (documental)
api/          Módulo 3 — Pruebas funcionales de API (Jest) contra https://reqres.in/api
.agents/      Contexto QA del proyecto (skill qa-project-context)
```

## Cómo correr cada módulo

```bash
npm install

# Módulo 1 — Automatización (Cypress)
npm run test:login       # headless, real contra saucedemo.com
npm run cy:open          # modo interactivo

# Módulo 3 — API
npm run test:api            # Jest contra reqres.in real
npm run test:api:postman    # misma cobertura, coleccion Postman ejecutada con Newman
```

Evidencia de la última ejecución real (no simulada) queda en `automation/evidence/` (screenshots + log de consola) y en `api/evidence/`:
- `run-output.txt` — corrida de Jest.
- `postman-run-output.txt` — corrida de Newman (CLI oficial de Postman) sobre `api/postman/MakersPay-API.postman_collection.json`.
- `postman-report.html` — reporte HTML estilo Postman (abrir en cualquier navegador). La colección `.json` también se puede importar directo en Postman de escritorio.

## Módulo 2 (Funcional)

Es documental — no requiere ejecución. Ver `functional/MODULO-FUNCIONAL.md`: técnicas y tipos de prueba, matriz de riesgo, escenarios, 15 casos de prueba y 3 reportes de bug simulados.

## Skills de QA usadas (petrkindlmann/qa-skills)

| Módulo | Skill(s) | Por qué (regla de `AGENTS.md`) |
|---|---|---|
| Setup | `qa-project-context` | Dependencia universal; toda otra skill la lee primero. |
| 1 — Automatización | `cypress-automation` | Coincide exacto con "Cypress"/`cy.`/page objects; no es Playwright ni un caso de healing de tests existentes. |
| 2 — Funcional | `risk-based-testing` → `test-planning` → `test-case-management` | Regla explícita de desambiguación: riesgo primero, luego escenarios de un solo alcance (no multi-quarter), luego casos formales. Plantilla de bug tomada de `ai-bug-triage` (solo formato). |
| 3 — API | `api-testing` | Coincide con "API test"/REST/JSON/status codes; no es contract-testing (no hay broker Pact ni un segundo equipo consumidor). |
| Cierre | `release-readiness` | Checklist go/no-go con evidencia real, no una opinión. |

Ver `RELEASE-READINESS.md` para el veredicto final.
