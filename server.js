const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const axios = require("axios");
const FormData=require("form-data");
require('dotenv').config();

const app = express();
const port = 4000;

const upload = multer({ dest: 'uploads/' });

const downloadAndSendImage = async (url) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const form = new FormData();
        form.append('file', response.data, 'image.jpg');

       const data= await axios.post(process.env.EC2_URI, form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        console.log(`Successfully sent image from ${url} to ${data.data?.url}`);
        return data?.data?.url;
    } catch (error) {
        console.error(`Failed to send image from ${url}:`, error.message);
        throw error;
    }
};
// Utility function to convert HTTP to HTTPS
const convertHttpToHttps = async (data) => {
    data.forEach(row => {
        Object.keys(row).forEach(async (key,index) => {
            if (typeof row[key] === 'string' && row[key].startsWith('http://')) {
                try{
                    const url=await downloadAndSendImage(row[key]);
                    if(url) {
                        row[key] = url;
                    }
                } catch (e) {
                    console.log(`Failed for ${index}: ${key} - ${row[key]}`);
                }
            }
        });
    });
    return data;
};

// Endpoint to upload and parse CSV
app.post('/upload', upload.single('csvfile'),async (req, res) => {
    const filePath = req.file.path;

    // Read the uploaded file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Failed to read the file');
        }

        // Parse the CSV file using PapaParse
        Papa.parse(data, {
            header: true,
            complete:async (results) => {
                console.log('Original Results:', results.data);

                // Convert HTTP to HTTPS in the parsed data
                const modifiedData =await convertHttpToHttps(results.data);
                console.log('Modified Results:', modifiedData);

                // Convert JSON back to CSV
                const csv = Papa.unparse(modifiedData);

                // Save modified CSV to a new file
                const modifiedFilePath = path.join(__dirname, 'uploads', 'modified.csv');
                fs.writeFile(modifiedFilePath, csv, (err) => {
                    if (err) {
                        return res.status(500).send('Failed to save the modified CSV file');
                    }

                    res.download(modifiedFilePath, 'modified.csv', (err) => {
                        if (err) {
                            return res.status(500).send('Failed to download the modified CSV file');
                        }
                    });
                });
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).send('Failed to parse CSV');
            },
        });
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
