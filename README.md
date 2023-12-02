# Tinymovr Control
Tinymovr Control is a user-friendly interface that help control Tinymovr boards. This application communicate with Tinymovr boards via the provided Python server.

>*This project is not affiliated with or endorsed by the Tinymovr company. It's an independent initiative developed for me and made available to the community.
Any references to company name, trademark, or logo are used for identification purposes only and do not imply any endorsement or affiliation.*

![Coms](docs/coms.png?raw=true)

## Features

### Customizable Interface
User-friendly interface (almost) fully customizable designed to control and use boards efficiently.
### WebSocket Communication
Communicate with Tinymovr boards through WebSocket ensures real-time responsiveness, locally or remotely.
### Programmable macro
Program macros via the integrate editor with a simple language to send instructions or create logics. (see wiki)
### Trajectory Planner
Generate a trajectory easily by adding multiples accelerations, positions and decelerations.

## Getting Started

### Requirements
Before using this app, I highly recommend having already used your board through Tinymovr Studio or a basic Python program to ensure you're off to a good start.

### Installation
#### From release
1. Download the latest build from [release](https://github.com/Erinell/tinymovr-control/releases)
2. Install the program

#### From source
1. Clone the repository
```bash
git clone https://github.com/Erinell/tinymovr-control.git
```

2. Navigate to the project directory
```bash
cd tinymovr-control
```

3. Install dependencies
```bash
npm install
```

4. Run the project

    In browser
    ```bash
    npm run dev
    ```
    In desktop app
    ```bash
    npm run electron
    ```

5. Build the project for your OS
```bash
npm run package:<win|linux>
```

## Usage
1. Plug the Tinymovr board CAN Bus to a computer
2. Run the server `python main.py`
3. Run the client
4. Click on Connect !

## Contributing
Feel free to contribute or report issues to make this project better!

## TODO
- Ensure support for multiple boards
- Add controls in Current mode
- Add controls for homing
- And of course, fix issues, improve and optimize