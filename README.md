# Snake Game

A simple yet fun snake game built with HTML5, CSS3, and JavaScript, containerized with Docker for easy deployment and sharing.

## Introduction

This classic Snake Game is a web-based application that allows users to enjoy the timeless arcade game where the player maneuvers a line which grows in length, with the line itself being a primary obstacle.

## Features

- Responsive design for desktop and mobile play.
- Control with keyboard arrows or swipe gestures on touch devices.
- Score tracking and display.
- Pause and restart functionality.
- Dockerized setup for quick installation and run.

## Quickstart

### Running the Game Locally

1. Clone the repository:

```sh
git clone https://github.com/yourusername/snake-game.git
cd snake-game
```

2. Install the requirements:

```sh
pip3 install -r requirements.txt
```

3. Run the Flask app:

```sh
python3 app.py
```
Navigate to http://localhost:5000 in your web browser to play the game.

### Running with Docker
Ensure that Docker is installed on your system and run the following commands:

1. Build the Docker image:

```sh
docker build -t snake-game .
```

2. Run the container:
```sh
docker run -d -p 8080:5000 snake-game
```
Navigate to http://localhost:8080 in your web browser to play the game.

## Docker Hub
This game is also available as a Docker image from Docker Hub:

```sh
docker pull lord222/snake-game
```

## Contributing
If you'd like to contribute to the project, please feel free to make a pull request, or open an issue for bugs and feature requests.