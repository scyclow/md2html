const context = require.context('./src/test/.', true, /-spec\.js$/);
context.keys().forEach(context);
