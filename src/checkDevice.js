import {exec} from "child_process"
import axios from "axios";
export async function ping() {
    return new Promise((resolve, reject) => {
        exec("ping -c 3 172.24.1.50", (error, stdout, stderr) => {
            console.log('PING processing')
            if (error) {
                console.log(`error: ${error.message}`);
                ping()
                resolve()
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                resolve()
            }
            console.log(`stdout: ${stdout}`);
            resolve(stdout)
        });
    })
}

export async function read() {
    return axios.post('http://172.24.1.50', {
        "COMMAND": "READ",
        "DATA": {}
    })
}
// await read().then(response => console.log(response))