const BASE_URL = "http://localhost:3000/api/user";

export async function forgotPasswordApi(email) {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
