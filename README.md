# Tinymovr Control
Tinymovr Control is a user-friendly interface that help control Tinymovr boards. This application communicate with Tinymovr boards via the provided [Python server](server).

>*This project is not affiliated with or endorsed by the Tinymovr company. It's an independent initiative developed for me and made available to the community.
Any references to company name, trademark, or logo are used for identification purposes only and do not imply any endorsement or affiliation.*

![Coms](docs/coms.png?raw=true)

## Features

### WebSocket Communication
Communicate with Tinymovr boards through WebSocket ensures real-time responsiveness, locally or remotely.

### Customizable Interface
<dl>
  <dd>
    <img align="left" height="100" src="docs/overview.png?raw=true">
    </br>
    User-friendly interface (almost) fully customizable designed to control and use boards efficiently.
    </div>
  </dd>
</dl>

</br>

### Programmable macro
<dl>
  <dd>
    <img align="left" height="100" src="docs/macros.png?raw=true">
    </br>
    Program macros via the integrate editor with a simple language to send instructions or create logics. <a href="https://github.com/Erinell/tinymovr-control/wiki/Macros-interpreter">see wiki</a>
  </dd>
</dl>

</br>

### Trajectory Planner 
<dl>
  <dd>
    <img align="left" height="100" src="docs/trajectory-planner.png?raw=true">
    </br>
    Generate a trajectory easily by adding multiples accelerations, positions and decelerations.
  </dd>
</dl>
</br></br>

## Getting Started
### Requirements
Before using this app, I highly recommend having already used your board through Tinymovr Studio or a basic Python program to ensure you're off to a good start.

**For development**
- Nodejs 18 or newer
- npm 10 or newer

### Installation
#### Server
Just download `server-x.x.x.zip` form [release](https://github.com/Erinell/tinymovr-control/releases)

#### Client from release
1. Download the latest build from [release](https://github.com/Erinell/tinymovr-control/releases)
2. Install the program

#### Client from source
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
4. Write the server IP and click on "Connect" !

## Contributing
Feel free to contribute or report issues to make this project better!

## TODO
- Ensure support for multiple boards
- Add controls in Current mode
- Add controls for homing
- And of course, fix issues, improve and optimize