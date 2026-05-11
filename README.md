# Node.js Todo API — Dockerized & Deployed to AWS ECS via CI/CD

## The Story

Scrolling through Upwork one day, I kept seeing the same kind of job post — clients needed someone to containerize their Node.js apps and set up automated deployment pipelines to AWS. It was everywhere. So instead of just reading about it, I built this project from scratch to prove I can actually do the job.

I started by building a simple but real REST API with Node.js, Express, and PostgreSQL. Then I containerized it with Docker, ran it locally with docker-compose, and wrote a GitHub Actions pipeline that automatically builds the image, pushes it to AWS ECR, and deploys it to ECS Fargate — all triggered by a single `git push`.

This is the workflow I see clients paying for. Now I've built it myself.

---

## What This Project Does

A production-ready Todo REST API with full CI/CD pipeline:

- **Write code** → push to GitHub
- **GitHub Actions** automatically builds Docker image, pushes to ECR, deploys to ECS
- **App runs live on AWS** with RDS PostgreSQL as the database
- **Zero manual deployment** — every push to `main` triggers the full pipeline

---

## Tech Stack

| Layer | Technology |
|---|---|
| App | Node.js + Express |
| Database | PostgreSQL (local: Docker, production: AWS RDS) |
| Containerization | Docker + docker-compose |
| Image Registry | AWS ECR |
| Deployment | AWS ECS Fargate |
| CI/CD | GitHub Actions |
| Version Control | Git + GitHub |

---

## Architecture

```
Developer pushes code to GitHub (main branch)
            │
            ▼
    GitHub Actions Pipeline
            │
            ├── Build Docker image
            │
            ├── Push image to AWS ECR (tagged with commit SHA)
            │
            ├── Download current ECS Task Definition
            │
            ├── Update Task Definition with new image URI
            │
            └── Deploy to ECS Fargate → wait for stability
                        │
                        ▼
              App running on ECS Fargate
                        │
                        ▼
                  AWS RDS PostgreSQL
```

---

## API Endpoints

```
GET    /api/todos        → Get all todos
POST   /api/todos        → Create a todo
PUT    /api/todos/:id    → Mark todo as complete
DELETE /api/todos/:id    → Delete a todo
```

---

## Run Locally

**Prerequisites:** Docker and docker-compose installed

```bash
# Clone the repo
git clone https://github.com/Rayyan-Mudassar/Nodejs-Docker-DevOps.git
cd Nodejs-Docker-DevOps

# Start app + postgres together
docker compose up --build
```

App runs at `http://localhost:3000`

```bash
# Test it
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My first todo"}'

curl http://localhost:3000/api/todos
```

---

## CI/CD Pipeline Setup

The pipeline uses GitHub Actions with these secrets configured in the repo:

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region (us-east-1) |
| `ECR_REPOSITORY` | ECR repository name |
| `ECS_CLUSTER` | ECS cluster name |
| `ECS_SERVICE` | ECS service name |
| `CONTAINER_NAME` | Container name in task definition |

Every push to `main` triggers the full build and deploy automatically.

---

## AWS Infrastructure

- **ECR** — Private registry storing Docker images tagged by git commit SHA
- **ECS Fargate** — Serverless container hosting, no EC2 management needed
- **RDS PostgreSQL** — Managed database, persists data independently of containers
- **IAM** — Dedicated deploy user with least-privilege permissions (ECR + ECS only)

---

## Problem I Solved During Build

**RDS SSL Connection:** AWS RDS PostgreSQL requires SSL encrypted connections by default. The app was throwing `pg_hba.conf` errors until I configured the PostgreSQL client to connect over SSL:

```javascript
const pool = new Pool({
  // ...connection config
  ssl: {
    rejectUnauthorized: false
  }
});
```

This is standard practice for connecting Node.js apps to RDS in production.

## Screenshots

**GitHub CI/CD pipeline working**
<img width="1600" height="900" alt="Screenshot (68)" src="https://github.com/user-attachments/assets/ebd7302e-6e5f-4150-b246-79d07a4f54db" />
**ECR**
<img width="1600" height="900" alt="Screenshot (69)" src="https://github.com/user-attachments/assets/0e39467a-6888-43d0-880d-aa7bea708bd1" />
**ECS Fargate with Task**
<img width="1600" height="900" alt="Screenshot (70)" src="https://github.com/user-attachments/assets/f1c7e0d3-8d3c-4df8-9660-35835d1baad6" />
**RDS Postgres Database working**
<img width="1600" height="900" alt="Screenshot (71)" src="https://github.com/user-attachments/assets/ec0c8854-c427-400c-90c7-4eb4a05f99d5" />
**Nodejs App working in Terminal**
<img width="1600" height="900" alt="Screenshot (72)" src="https://github.com/user-attachments/assets/a5d4f7a9-3d16-4322-ade6-cea995d70e4e" />


---

## Author

**Rayyan Mudassar**
Cloud & DevOps Engineer
[GitHub](https://github.com/Rayyan-Mudassar) | [LinkedIn](https://linkedin.com/in/rayyan-mudassar)
