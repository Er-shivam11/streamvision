# OTT Video Streaming — StreamVision

A full-stack OTT video streaming platform built with **React** and **Django REST Framework**.

Users can browse videos, search the library, view video details, authenticate, and upload new videos. Uploaded videos are processed with **FFmpeg** to generate thumbnails and adaptive HLS streams in multiple resolutions.

## Project Structure

```text
streamvision/
│
├── backend/
│   │
│   ├── media/
│   │   ├── frames/
│   │   ├── hls/
│   │   │   └── <video_id>/
│   │   │       ├── master.m3u8
│   │   │       ├── 360p.m3u8
│   │   │       ├── 720p.m3u8
│   │   │       ├── 1080p.m3u8
│   │   │       ├── 360p0.ts
│   │   │       ├── 360p1.ts
│   │   │       ├── 720p0.ts
│   │   │       ├── 720p1.ts
│   │   │       ├── 1080p0.ts
│   │   │       └── 1080p1.ts
│   │   ├── sample/
│   │   └── thumbnails/
│   │
│   ├── MyOtt/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── VideoStreaming/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── About/
│   │   │   │   ├── About.css
│   │   │   │   └── About.js
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.css
│   │   │   │   └── Footer.js
│   │   │   │
│   │   │   ├── Header/
│   │   │   │   ├── Header.css
│   │   │   │   └── Header.js
│   │   │   │
│   │   │   ├── Login/
│   │   │   │   ├── Login.css
│   │   │   │   └── Login.js
│   │   │   │
│   │   │   ├── Videolist/
│   │   │   │   ├── Videolist.css
│   │   │   │   └── Videolist.js
│   │   │   │
│   │   │   └── VideoUpload/
│   │   │       ├── VideoUpload.css
│   │   │       └── VideoUpload.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── Home.css
│   │   │   │   └── Home.js
│   │   │   │
│   │   │   └── VideoDetail/
│   │   │       ├── VideoDetail.css
│   │   │       └── VideoDetail.js
│   │   │
│   │   └── services/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

### Generated / Local Files

The following files and directories should **not** be committed to Git:

```text
backend/
├── media/
├── __pycache__/
└── db.sqlite3

frontend/
├── node_modules/
└── build/

venv/
.env
```

These are generated locally or contain environment-specific data.

---

## Features

* Video library with featured and recently added videos
* Search videos by title
* Video detail pages
* Adaptive HLS video playback
* HLS streaming in 360p, 720p, and 1080p
* Drag-and-drop video upload
* Video title and description support
* Django authentication
* Automatic thumbnail generation using FFmpeg
* Django Admin
* REST API
* MySQL database
* React frontend
* Django backend

---

## Technology Stack

### Frontend

* React
* React Router
* CSS
* JavaScript
* npm

### Backend

* Python
* Django
* Django REST Framework
* MySQL
* FFmpeg

### Video Streaming

* HTTP Live Streaming (HLS)
* `.m3u8` playlists
* `.ts` video segments
* Adaptive bitrate streaming

---

## Requirements

Make sure the following are installed:

* Python 3.10+
* Node.js
* npm
* MySQL Server
* FFmpeg

FFmpeg must be available from the system `PATH`.

Verify FFmpeg:

```powershell
ffmpeg -version
```

Backend dependencies:

```text
backend/requirements.txt
```

Frontend dependencies:

```text
frontend/package.json
```

---

## Backend Setup

### 1. Create Virtual Environment

From the project root:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r backend\requirements.txt
```

### 3. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE ott_video_streaming;
```

Configure the database in:

```text
backend/MyOtt/settings.py
```

Example:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "ott_video_streaming",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "localhost",
        "PORT": "3306",
    }
}
```

Update the credentials according to your local MySQL configuration.

### 4. Run Migrations

```powershell
cd backend
python manage.py migrate
```

### 5. Start Django

```powershell
python manage.py runserver
```

Backend:

```text
http://localhost:8000
```

---

## Frontend Setup

Open a second terminal.

From the project root:

```powershell
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

The React application expects the Django backend to be available at:

```text
http://localhost:8000
```

---

## Frontend Routes

| Route          | Purpose                    |
| -------------- | -------------------------- |
| `/`            | Home page                  |
| `/VideoList`   | Video library              |
| `/video/:id`   | Video details and playback |
| `/VideoUpload` | Upload a video             |
| `/login`       | Login                      |
| `/about`       | About page                 |

---

## API Endpoints

The API is prefixed with `/api/`.

| Method      | Endpoint           | Purpose                    |
| ----------- | ------------------ | -------------------------- |
| `POST`      | `/api/login/`      | Authenticate a Django user |
| `GET`       | `/api/media/`      | List media files           |
| `POST`      | `/api/media/`      | Upload a media file        |
| `GET`       | `/api/media/<id>/` | Get a media file           |
| `PUT/PATCH` | `/api/media/<id>/` | Update a media file        |
| `DELETE`    | `/api/media/<id>/` | Delete a media file        |

---

## Video Processing

When a user uploads a video, the backend processes it using FFmpeg.

The processing pipeline is approximately:

```text
Video Upload
     │
     ▼
Django REST API
     │
     ▼
Save Original Video
     │
     ├──────────────► Generate Thumbnail
     │
     ▼
FFmpeg Processing
     │
     ├──────────────► 360p HLS
     │
     ├──────────────► 720p HLS
     │
     └──────────────► 1080p HLS
                         │
                         ▼
                    master.m3u8
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          360p.m3u8  720p.m3u8  1080p.m3u8
              │          │          │
              ▼          ▼          ▼
           .ts files  .ts files  .ts files
```

Example HLS output:

```text
backend/media/hls/3/

├── master.m3u8
├── 360p.m3u8
├── 360p0.ts
├── 360p1.ts
├── 720p.m3u8
├── 720p0.ts
├── 720p1.ts
├── 1080p.m3u8
├── 1080p0.ts
└── 1080p1.ts
```

The frontend requests:

```text
/hls/3/master.m3u8
```

The HLS player then follows the master playlist to the appropriate resolution playlist and its `.ts` segments.

---

## Media Storage

Uploaded source videos:

```text
backend/media/sample/
```

Generated thumbnails:

```text
backend/media/thumbnails/
```

Generated HLS files:

```text
backend/media/hls/<video_id>/
```

Generated video frames:

```text
backend/media/frames/
```

These generated media files should generally remain outside Git.

---

## Useful Commands

### Backend

Run migrations:

```powershell
cd backend
python manage.py migrate
```

Start development server:

```powershell
python manage.py runserver
```

Run tests:

```powershell
python manage.py test
```

Create Django superuser:

```powershell
python manage.py createsuperuser
```

### Frontend

Install dependencies:

```powershell
cd frontend
npm install
```

Start development server:

```powershell
npm start
```

Create production build:

```powershell
npm run build
```

---

## Configuration Notes

### Development Configuration

The current development configuration allows:

* `DEBUG=True`
* Broad `ALLOWED_HOSTS`
* Development CORS origins
* Localhost frontend/backend URLs

These settings should be restricted before production deployment.

### API URL

The frontend currently uses:

```text
http://localhost:8000
```

for backend API requests.

For production, this should be moved to an environment-based configuration.

### FFmpeg

FFmpeg is required for video processing.

If FFmpeg is not available on the system `PATH`, video upload processing will fail.

### Django Version

Make sure the Django version in:

```text
backend/requirements.txt
```

matches the version used by the project configuration.

---

## Development Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │    localhost:3000    │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Django REST API   │
                    │    localhost:8000   │
                    └──────────┬──────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
                  ▼            ▼            ▼
              MySQL DB      FFmpeg       Media
                            Processing    Storage
                               │
                               ▼
                         HLS Streaming
                               │
                               ▼
                    master.m3u8 + .ts files
```

---

## Project Goal

StreamVision demonstrates a full-stack OTT video platform with:

* REST API development
* React frontend development
* User authentication
* Video upload handling
* FFmpeg-based media processing
* Adaptive HLS streaming
* Multi-resolution video delivery
* MySQL persistence
* Django administration

The project is designed to demonstrate practical backend, frontend, API, and video-streaming concepts in a single application.
