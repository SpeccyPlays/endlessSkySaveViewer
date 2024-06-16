
async function readFile(filePath){
    return await formatData(filePath);
}

async function formatData (filePath) {

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
                return response;
            }
            response.data = data;
            response.success = true;
            console.log(filePath, ' Read successfully');
            return response;
        });
    }
module.exports = {readFile};