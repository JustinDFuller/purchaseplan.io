export async function post({ email }) {
  let res = await fetch('http://localhost:8080/users', {
    method: 'POST',
    body: JSON.stringify({
      email
    })
  })

  if (!res.ok && res.status !== 200) {
    console.error("Response error", res)
    return {}
  }

  res = await res.json()
  return { id: res.id }
}
