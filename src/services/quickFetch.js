export async function _fetch(uri, method, body = undefined) {
  let res = await fetch(uri, {
    method,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: body != undefined ? JSON.stringify(body) : undefined,
  });
  return {
    status: res.status,
    body: await res.json(),
  };
}

export async function get(uri) {
  return await _fetch(uri, "GET");
}

export async function post(uri, body) {
  return await _fetch(uri, "POST", body);
}

export async function put(uri, body) {
  return await _fetch(uri, "PUT", body);
}

export async function del(uri, body) {
  return await _fetch(uri, "DELETE", body);
}
