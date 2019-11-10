const app = require('./app');

async function main() {
    const PORT = process.env.PORT || 4000;
    await app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}
main();