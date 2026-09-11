const BASE_URL = 'https://reqres.in/api';

describe('API MakersPay/QA - reqres.in /users', () => {
  test('POST /users crea un usuario y responde 201 con el contrato esperado', async () => {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', job: 'Automation Engineer' }),
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.name).toBe('Test User');
    expect(body.job).toBe('Automation Engineer');
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
  });

  test('Hallazgo: GET /users/{id} con el id devuelto por el POST no persiste (mock de reqres.in)', async () => {
    const postRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', job: 'Automation Engineer' }),
    });
    const created = await postRes.json();

    const getRes = await fetch(`${BASE_URL}/users/${created.id}`);

    // reqres.in es un mock stateless: el id que devuelve el POST no queda persistido,
    // por lo que el GET subsecuente da 404 en vez de 200 con los mismos datos.
    // Documentado como hallazgo real (ver api/evidence/run-output.txt), no un bug de este test.
    expect(getRes.status).toBe(404);
  });

  test('GET /users/{id} para un usuario existente en el dataset fijo responde 200 con el contrato esperado', async () => {
    const res = await fetch(`${BASE_URL}/users/2`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toMatchObject({
      id: 2,
      email: expect.stringContaining('@'),
      first_name: expect.any(String),
      last_name: expect.any(String),
      avatar: expect.stringContaining('http'),
    });
  });

  test('Caso adicional: GET /users/{id} inexistente responde 404', async () => {
    const res = await fetch(`${BASE_URL}/users/9999999`);
    expect(res.status).toBe(404);
  });

  test('Caso adicional: POST /users con body incompleto (solo job) aun responde 201', async () => {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job: 'Automation Engineer' }),
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.name).toBeUndefined();
    expect(body.job).toBe('Automation Engineer');
  });

  test('Caso adicional: GET /users?page=2 respeta paginacion', async () => {
    const res = await fetch(`${BASE_URL}/users?page=2`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('Caso adicional: DELETE /users/{id} responde 204', async () => {
    const res = await fetch(`${BASE_URL}/users/2`, { method: 'DELETE' });
    expect(res.status).toBe(204);
  });

  test('Caso adicional: GET /users/2 responde dentro de un presupuesto de 2000ms', async () => {
    const start = Date.now();
    const res = await fetch(`${BASE_URL}/users/2`);
    const elapsed = Date.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(2000);
  });
});
