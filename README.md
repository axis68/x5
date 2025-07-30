# React + TypeScript + Vite

## Setup environment on Windows

## 1. Install Git
- Download Git from [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win).
- Run the installer and proceed with all default parameters.

## 2. Install Visual Studio Code
- Download Visual Studio Code from [https://code.visualstudio.com/docs/?dv=win64user](https://code.visualstudio.com/docs/?dv=win64user).

## 3. Install NVM (Node Version Manager)
- Open the [NVM for Windows GitHub page](https://github.com/coreybutler/nvm-windows#readme).
- Click **"Download Now!"** and download the `nvm-setup.exe` file.
- Run the installer to complete the setup.

## 4. Start Visual Studio Code and Open a Terminal
- Launch Visual Studio Code.
- Open a new terminal from the **Terminal** menu.

## 5. Install the Latest Node Version
- Verify that NVM is installed by running:  
  nvm --version

- List all available Node.js versions:  
  nvm list available

- Install the latest Node.js LTS version:  
  nvm install --lts

- Use the installed Node.js version:  
  nvm use <version>  
  Replace `<version>` with the version number installed (e.g., `18.17.1`).

- Check that Node.js is working:  
  node --version

## 6. Clone the Repository into a Local Workspace
- Clone the repository:  
  git clone https://github.com/axis68/x5.git x5  
  This will create a subfolder named `x5`.  
  If the command does not work, restart Visual Studio Code and try again.

## 7. Install the Dependencies
- Navigate to the project folder and install dependencies:  
  npm install  
  This process may take some time.

## 8. Execute the App
- Run the app:  
  npm run dev

## 9. Configure git to contribute

- git config user.name "James Debug"
- git config user.email "james.debug@gmail.com"  

## Node version

Please use node >=24.4.0, with node version 18, npm run dev may fail

