# Raja AI

Raja AI is your newest team member for your software engineering project - fast, reliable, and cost-efficient. It leverages AI to comprehend your entire codebase and makes changes based on given engineering tickets. It generates relevant code and proactively submits a pull request, ready for human review and approval.

## Table of Contents
1. [Installation](#Installation)
2. [Usage](#Usage)
3. [Features](#Features)
4. [Contribution](#Contribution)
5. [Contact](#Contact)

## Installation

To get the application running, you need to setup both the front-end and back-end environments.

### Backend Setup

You can setup the backend Flask application using pipenv. From the root directory of the project, run the following commands:

```bash
pipenv install
pipenv shell
cd raja-app
python3 server/app.py
```

### Frontend Setup

```bash
cd raja-app
npm install
npm run dev
```

### Usage
With the server running, you can navigate to localhost:5000 (for backend) and localhost:3000 (for frontend) on your browser to access and use the Raja AI application.

### Features
Raja AI offers the following features:

- Interprets engineering tickets and generates relevant code
- Makes changes to the codebase based on ticket details
- Submits a pull request for human review

### Contact
If you have any queries or issues to report, please create an issue in the GitHub repository.

### License
Raja AI is licensed under the MIT license. For more information, see the LICENSE file in the root directory.
