import {exec} from "child_process"
export async function resetUsb() {
    return new Promise((resolve, reject) => {
        exec("usb_modeswitch -v 0x0483 -p 0x3748 --reset-usb", (error, stdout, stderr) => {
            console.log('RESETUSB processing')
            if (error) {
                console.log(`error: ${error.message}`);
                resolve()
            }
            if (stderr) {
                console.log(`stderr: ${stderr} USBUSBUSB`);
                resolve()
            }
            console.log(`stdout: ${stdout}`);
            resolve()
        });
    })
}

export async function erase() {
    return new Promise((resolve, reject) => {
        exec("st-flash  erase", (error, stdout, stderr) => {
            console.log('ERASE processing')
            if (error) {
                console.log(`error: ${error.message}`);
                console.log('RETURN ERASE processing')
                resolve(true)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                resolve(true)
            }
            console.log(`stdout: ${stdout}`);
            resolve(true)
        });
    })
}

export async function write() {
    return new Promise((resolve, reject) => {
        exec("st-flash write ./bin/device.bin 0x8000000", (error, stdout, stderr) => {
            console.log('WRITE processing')
            if (error) {
                console.log(`error: ${error.message}`);
                resolve(true)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                resolve(true)
            }
            console.log(`stdout: ${stdout}`);
            console.log(stdout, 'ЭТО ОШИБКА')
            if (stdout === 'send_recv send request failed: LIBUSB_ERROR_NO_DEVICE') {
                reject('LIBUSB_ERROR_NO_DEVICE')
            }
            // if (stdout.split(" ").length > 2 && stdout.split(" ")[9] === '==') {
            //     console.log('RETURN WRITE processing')
            //     resetUsb()
            //     erase()
            //     write()
            //     reject(false)
            // }
            resolve(true)
        });
    })
}
