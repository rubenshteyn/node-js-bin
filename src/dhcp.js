import {exec} from "child_process"
export async function stopDhcp() {
    return new Promise((resolve, reject) => {
        console.log("stop")
        exec("sudo service dnsmasq stop", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
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

export async function clearTableDhcp() {
    return new Promise((resolve, reject) => {
        console.log("clear")
        exec("echo '' | sudo tee /var/lib/misc/dnsmasq.leases", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
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

export async function startDhcp() {
    return new Promise((resolve, reject) => {
        console.log("start")
        exec("sudo service dnsmasq start", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
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