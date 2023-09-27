require('dotenv').config();
const app = require('./app');

app.listen(8000, () => {
    console.log('server running at port 8000')
});