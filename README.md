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

Es documental — no requiere ejecución. Ver `functional/Modulo-Funcional-MakersPay.pdf`: técnicas y tipos de prueba, matriz de riesgo, escenarios, 15 casos de prueba y 3 reportes de bug simulados.

Ver `RELEASE-READINESS.md` para el veredicto final.
