import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 5,
  duration: "10s",
};

export default function () {
  const payload = JSON.stringify({
    email: "test@test.com",
    password: "Secure123!!!",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:3000/api/auth/login",
    payload,
    params
  );

  check(res, {
    "status is 200 or 401": (r) =>
      r.status === 200 || r.status === 401,
  });


  if (res.status !== 200 && res.status !== 401) {
    console.log(`ERROR ${res.status} => ${res.body}`);
  }

  sleep(1);
}




// import http from "k6/http";
// import { check, sleep } from "k6";

// export const options = {
//   vus: 10, // virtual users
//   duration: "10s",
// };

// export default function () {
//   const payload = JSON.stringify({
//     email: "test@test.com",
//     password: "Secure123!!!",
//   });

//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const res = http.post(
//     "http://localhost:3000/api/auth/login",
//     payload,
//     params
//   );

//   check(res, {
//     "status is 200 or 401": (r) =>
//       r.status === 200 || r.status === 401,
//   });

//   sleep(1);
// }