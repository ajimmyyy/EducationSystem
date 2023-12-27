const apiFetcher = async (path: string, options: any) => {
  const {
    method = "GET",
    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
  } = options;

  const stringifyBody = body ? JSON.stringify(body) : undefined;

  const response = await fetch(path, {
    method,
    headers,
    body: stringifyBody,
  });

  const _data = await response.text();
  const data = _data ? JSON.parse(_data) : null;

  if (!response.ok) throw new Error(data.message);

  return data;
};

export default apiFetcher;
