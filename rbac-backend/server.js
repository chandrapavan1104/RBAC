const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const sample_permissionRoutes = require('./routes/sample_permissions');
const permissionRoutes = require('./routes/permissions');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/sample_permissions', sample_permissionRoutes);
app.use('/api/permissions', permissionRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
