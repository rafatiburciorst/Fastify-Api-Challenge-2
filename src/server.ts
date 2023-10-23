import { app } from "./app";

app.listen({
    host: '0.0.0.0',
    port: 3000
}).then(() => {
    console.log('App is running at port 3000')
}).catch((error) => {
    console.error(error)
})

