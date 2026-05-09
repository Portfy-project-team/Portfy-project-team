import http from "k6/http";
import { check } from "k6";

export default function () {
  const res = http.post(
    "http://localhost:3000/api/auth/refresh"
  );

  check(res, {
    "response received": (r) =>
      r.status === 200 || r.status === 401,
  });
}