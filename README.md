# Splitz – Group Expense Tracker

A simple expense book where you create a group, log expenses, and the app automatically divides the total amount equally among all **active** members.

---

## ✨ Current Features

- Create groups and invite/add members
- Create expenses (who paid, amount, description)
- Automatic **equal split** across active members
- Per‑member **balance** view (who owes whom)
- JWT‑based login & protected APIs
- Basic validations (required fields, positive amounts)

> **Equal split rule:** If a group has _N_ active members and an expense of _A_ is created, each member’s share = `A / N`. The payer’s personal share is also counted, then payer’s balance is credited by `A - share(payer)`.

---

## 🧱 Tech Stack

- **Backend**: Java 17, Spring Boot (Web, Validation, Security, Data JPA), JWT
- **DB**: PostgreSQL 14+
- **Frontend**: Next.js (React), Tailwind CSS
- **Infra/Dev**: Docker & docker‑compose

---

## 🗂️ Repository Structure

```
splitz/
  backend/
    src/main/java/... (Spring Boot)
  frontend/
    src/
  README.md
```

---

## 🧠 Domain Model (ERD)

```
users (id, name, password)
groups (id, name)
group_members (id, group_id -> groups.id, user_id -> users.id, joined_at)
expenses (id, group_id -> groups.id, user_id -> users.id, amount, description, date)
settlement (id, group_id, payer_id, receiver_id, amount, date)
```

## 🔐 Auth (JWT)

- Public endpoints: `POST /auth/signup`, `POST /auth/login`
- Private endpoints require `Authorization: Bearer <token>` header.
- Token contains user id; server verifies signature for trust.

---

## 🗺️ API Sketch

### Auth

```http
POST /auth/signup
POST /auth/login  -> { token }
```

### Groups

```http
POST /groups                 # create group
POST /groups/{id}/members    # add member by email/userId
GET /groups/{id}             # get group by group id
GET /groups                  # get group list
DELETE /groups/{id}          # delete group by group id

```

### Expenses

```http
POST /expenses  # create expense
```

### Settlement

```http
POST /settlement  # record payment from -> to
```

### Activities

```http
GET /activities  # get activities dashboard data
```

### User

```http
GET /user/dashboard  # get user's dashboard data
DELETE /user # delete user
```

## 🧩 Frontend Notes (Next.js)

- Pages/components: group list, group detail (expenses + balances), add expense form
- State: SWR/React Query or simple fetch hooks
- Tailwind for quick UI; responsive layout

## 🔭 Roadmap (nice next steps)

- Swagger (OpenAPI) docs at `/swagger-ui.html`
- Idempotency‑Key for POST `/expenses`
- Keyset pagination for expenses list
- Redis cache for hot GETs (group balances)
- Observability: Prometheus metrics + Grafana dashboard
- Basic rate‑limit at Ingress/API gateway
- Email invites & password reset

---

## 📘 Documentation

- **API Docs:** OpenAPI 3 (springdoc-openapi) with **Swagger UI**.
- **UI:** `/swagger-ui/index.html`
- **Spec JSON:** `/v3/api-docs`

_(We use Swagger/OpenAPI for interactive API documentation; see codebase for details.)_

---

## 🙌 Credits

Built by Tran Son Viet.
