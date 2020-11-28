export async function put(user) {
  const res = await fetch('http://localhost:8080/users', {
    method: 'PUT',
    body: JSON.stringify(user),
  }).then(r => r.json())

  return res
}

export async function get(user) {
  return fetch(`http://localhost:8080/users/${user.email()}`).then(r => r.json())
}
