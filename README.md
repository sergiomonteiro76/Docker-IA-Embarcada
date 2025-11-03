[AI API with Flask and Docker.md](https://github.com/user-attachments/files/23307519/AI.API.with.Flask.and.Docker.md)
# AI API with Flask and Docker

This project is an Artificial Intelligence API developed with Flask and containerized with Docker. The API provides endpoints for sentiment analysis, text generation, and text summarization, using pre-trained language models from Hugging Face.

## ✨ Features

- **Sentiment Analysis:** Analyzes the sentiment of a text (positive, negative, or neutral).
- **Text Generation:** Generates creative text on a specific topic.
- **Text Summarization:** Summarizes text in a simplified way.
- **Web Interface:** A simple web interface to interact with the API.
- **Docker Containerization:** The application is fully containerized, making deployment and management easy.

## 🛠️ Technologies Used

- **Backend:** Flask, Flask-CORS
- **Artificial Intelligence:** Transformers, PyTorch
- **Containerization:** Docker, Docker Compose
- **Frontend:** HTML, CSS, JavaScript

## 📋 Prerequisites

- Docker Desktop installed and running.

## 🚀 How to Run

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-user/your-repository.git
    cd your-repository
    ```

2.  **Start the application with Docker Compose:**

    ```bash
    docker-compose -f docker-compose-final.yml up --build
    ```

3.  **Access the application:**

    Open your browser and go to `http://localhost:5000`.

## 📁 Project Structure

```
.
├── services
│   ├── servico_ia.py
│   └── servico_ia_corrigido.py
├── static
│   ├── css
│   │   └── estilo.css
│   └── js
│       └── app.js
├── templates
│   └── index.html
├── app_docker.py
├── docker-compose-final.yml
├── Dockerfile.fixed
├── requirements_corrigido.txt
└── README.md
```

## 🐳 Docker Configuration

### `Dockerfile.fixed`

The `Dockerfile.fixed` is responsible for building the application image. It uses a Python 3.11 base image, installs system and application dependencies, copies the project files, and defines the command to start the application.

### `docker-compose-final.yml`

The `docker-compose-final.yml` orchestrates the application's execution. It defines an `api-ia` service that uses the image built from `Dockerfile.fixed`, maps port 5000, sets environment variables, mounts a volume for the Hugging Face models cache, and configures a healthcheck to monitor the container's health.

## 📡 API Endpoints

The API offers the following endpoints:

-   `GET /api/status`: Returns the API status.
-   `GET /api/modelo`: Returns information about the AI models used.
-   `POST /api/sentimento`: Analyzes the sentiment of a text.
-   `POST /api/gerar`: Generates text on a specific topic.
-   `POST /api/resumir`: Summarizes a text.

For more details on each endpoint, refer to the source code in `app_docker.py`.

## 🐛 Troubleshooting

-   **Error "Cannot connect to Docker daemon":** Make sure Docker Desktop is running.
-   **Error "port is already allocated":** Another application is using port 5000. Stop the other application or change the port in the `docker-compose-final.yml` file.

## 👨‍💻 Author

-   **Prof. Sérgio Monteiro, D.Sc.**
