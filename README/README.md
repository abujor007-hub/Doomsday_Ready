
# Doomsday Ready

A Full Stack Movie Dependency and Cinema Ticket Bundle Management Application.

Built with Laravel, React, MySQL, and Bootstrap.

## Project Overview

Doomsday Ready helps users:

- Manage movies and their prerequisites.
- Generate the correct movie rewatch order.
- Detect circular movie dependencies.
- Calculate the minimum number of cinema ticket bundles required for a group.
- Check whether an exact bundle combination is possible.

## Technologies Used

### Backend
- PHP
- Laravel
- MySQL
- REST API

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router DOM
- Bootstrap 5
- Bootstrap Icons

## Project Structure

    htdocs/
    |
    |-- backend/
    |   |-- app/
    |   |-- database/
    |   |-- routes/
    |   |-- .env
    |   |-- artisan
    |
    |-- frontend/
    |   |-- src/
    |   |-- public/
    |   |-- package.json
    |
    |-- README.md

## Requirements

Install the following software:

- PHP 8.2 or compatible version
- Composer
- Node.js and npm
- MySQL
- XAMPP
- Web browser

## Backend Installation

### 1. Open Backend Folder

```bash
cd C:\xampp\htdocs\backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Create Environment File

```bash
copy .env.example .env
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Configure Database

Open the `.env` file and configure your MySQL database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=doomsday_ready
DB_USERNAME=root
DB_PASSWORD=
```

Create the database named `doomsday_ready` in phpMyAdmin.

Use your actual database name and credentials if they are different.

### 6. Run Migrations

```bash
php artisan migrate
```

### 7. Start Backend Server

```bash
php artisan serve
```

Backend URL:

http://127.0.0.1:8000

API Base URL:

http://127.0.0.1:8000/api

## Frontend Installation

### 1. Open Frontend Folder

```bash
cd C:\xampp\htdocs\frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start React Development Server

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## API Endpoints

### Movie APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/movies | Get all movies |
| POST | /api/movies | Create a movie |
| GET | /api/movies/{id}/rewatch-order | Generate rewatch order |
| PUT/PATCH | /api/movies/{id} | Update a movie |

### Cinema APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/cinemas | Get all cinemas |
| POST | /api/cinemas | Create a cinema |
| POST | /api/cinemas/{id}/calculate | Calculate ticket bundles |
| GET | /api/cinemas/{id}/booking?groupSize=6 | Calculate booking bundles |

Check the actual registered API routes using:

```bash
php artisan route:list --path=api
```

## Movie Dependency Algorithm

Movies can have prerequisite movies.

The application generates a valid watching order using dependency traversal and topological ordering.

The generated list:

- Includes all prerequisite movies recursively.
- Excludes the selected target movie.
- Includes each prerequisite only once.
- Places prerequisites before dependent movies.
- Calculates watched and unwatched movie counts.
- Calculates the remaining runtime of unwatched movies.

Circular dependencies are rejected with HTTP status 409.

Error code:

`CIRCULAR_DEPENDENCY`

## Cinema Bundle Algorithm

The cinema bundle calculation uses Dynamic Programming.

The algorithm finds the minimum number of bundles needed to match a requested group size exactly.

It also returns:

- Whether an exact combination is possible.
- Minimum number of bundles.
- Number of bundles for each bundle size.

If no exact combination exists, the API returns:

`possible: false`

## Frontend Features

### Movies
- Displays the movie list.
- Shows release year.
- Shows runtime.
- Displays watched status.

### Rewatch Plan
- Select a target movie.
- Generate prerequisite watching order.
- Display watched and unwatched counts.
- Display remaining runtime.

### Cinema Booking
- Select a cinema.
- Enter group size.
- Calculate minimum ticket bundles.
- Display bundle details.
- Show a message when an exact combination is not possible.

## Testing

API testing was performed using Postman.

The frontend was tested using the React development server.

Important test cases include:

1. Creating movies.
2. Generating movie rewatch order.
3. Detecting circular dependencies.
4. Creating cinemas with bundle sizes.
5. Finding minimum bundle combinations.
6. Handling impossible group sizes.

## AI Usage

AI assistance was used during development for:

- Understanding the assessment requirements.
- Learning Laravel and React implementation steps.
- Debugging development errors.
- Reviewing API integration.
- Understanding movie dependency and Dynamic Programming algorithms.
- Preparing project documentation.

All generated code and suggestions should be reviewed and tested by the developer before submission.

## Assumptions

- Movie titles must be unique.
- Movie runtime must be between 1 and 300 minutes.
- Watched status defaults to false.
- Cinema names must be unique.
- Cinema bundle sizes must be between 1 and 500.
- Group size must be between 1 and 10000.
- Booking calculation checks exact bundle combinations.
- The booking endpoint calculates bundle requirements; it does not persist a ticket reservation.

## Developer

Doomsday Ready

Full Stack Development Assessment Project.
