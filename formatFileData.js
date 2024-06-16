
function formatData (filePath, res) {

        let response = {
            success : false,
            errors : [],
            data : {}
        }
        const fs = require('node:fs');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                response.errors.push(err);
                console.log('Error reading file:', err);
                return res.json({response});
            }
            response.data = data;
            response.success = true;
            console.log(filePath, ' Read successfully');
            return res.json({response});
        });
    }
module.exports = {formatData};