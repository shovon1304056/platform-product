# Platform Product Backend

A backend service for managing platform products, built with Node.js and Express.

---

## 🛠 Requirements

- **Node.js** version **20+**
- **npm** (comes with Node.js)
- A MySQL database server

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shovon1304056/platform-product.git
cd platform-product
```

### 2. Switch to Development Branch

```bash
git checkout dev_shovon_v1
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

- Navigate to the `backend/GITIGNORE` folder.
- Copy the file named `env_example.txt`.
- Paste it into the **root** of the project (same level as `package.json`).
- Rename it to `.env`.

```bash
cp backend/GITIGNORE/env_example.txt .env
```


## 🗃️ Database

The required MySQL database dump is provided in the `database/` folder.

> Import this SQL file into your MySQL server using your preferred client or CLI.

---

## 📬 Postman Collection

A full API collection is available in the `postman-collection/` folder for testing endpoints via Postman.

---

## 🚀 Run the Application

```bash
npm run start
```

---

## 📂 Project Structure

```
platform-product/
├── backend/
│   └── ...source files
├── database/
│   └── your-database-dump.sql
├── postman-collection/
│   └── platform-product-apis.postman_collection.json
├── .env
└── package.json
```

---

