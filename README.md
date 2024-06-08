
# API to shift all http image url to https format

This Node.js service is designed to process a CSV file containing image data or HTTP URLs. It downloads the images from the provided URLs and sends them to another EC2 endpoint for storage. The service is implemented using Node.js with the `axios` library for making HTTP requests and `csv-parser` for parsing the CSV file.


## Tech Stack


**Server:** Node, Express


## API Reference

#### Upload CSV

```http
  POST /upload
```

| Form Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `csvfile`   | `File`    | csv containing urls|





## 🔗 Demo

Changes are currently in process. Use locally to ensure smooth processing.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`EC2_URL`


## Run Locally

Clone the project

```bash
  git clone https://github.com/aayushbaluni/http-image-to-https-convertor.git
```

Go to the project directory

```bash
  cd http-image-to-https-convertor
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-aayushbalunis-projects.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ayush-baluni-1469a4241/)

