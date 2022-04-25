// custom fetch function using fetch API for basic api calls
export default function customFetch(url, method = "get", successCallback, body = null) {
  fetch(`${url}`, {
    method: method,
    headers: {
      'content-type': 'application/json'
    },
    body: body
  })
    .then(res => {
      if (!res.ok) {
        // non-200 response code
        const error = new Error(res.statusText);
        console.error(error)
        throw error;
      }
      return res.json();
    })
    .then(data => {
      successCallback(data)
    })
    .catch(err => {
      console.error(err)
    })
}