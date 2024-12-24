const mongoose = require('mongoose');
const { mongoConfig, serverConfig } = require("./configs/index.js");

class Server {
    static startServer = async (app) => {
        const CONNECTION_URL = `${mongoConfig.connectionUrl}`;

        await mongoose
            .connect(CONNECTION_URL, {
                autoIndex: true,
            })
            .then(() => {
                console.log("database connection done.");
                // server listen
                app.listen(serverConfig.port, serverConfig.ip, () => {
                    console.log(
                        `Server running on http://${serverConfig.ip}:${serverConfig.port}`
                    );
                });
            })
            .catch((error) => {
                console.error("database connection error:", error);
            });
    };
}

module.exports = Server;
