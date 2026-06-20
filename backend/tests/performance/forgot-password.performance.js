import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "10s",
};

export default function () {
  const payload = JSON.stringify({
    email: "test@test.com",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:3000/api/auth/forgot-password",
    payload,
    params
  );

  check(res, {
    "forgot password request handled": (r) =>
      r.status === 200 || r.status === 429,
  });

  sleep(1);
}