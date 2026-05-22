import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "10s",
};

export default function () {
  const randomEmail = `user${Math.random()}@test.com`;

  const payload = JSON.stringify({
    email: randomEmail,
    password: "Secure123!!",
    nom: "Test",
    prenom: "User",
    role: "STUDENT",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:3000/api/auth/register",
    payload,
    params
  );

  check(res, {
    "register status is 201 or 409": (r) =>
      r.status === 201 || r.status === 409,
  });

  sleep(1);
}