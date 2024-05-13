import fs from 'fs';
import ByteBuffer from "bytebuffer";

let bin
let adress
let buffer
async function writeBufToBin(adr, buf, bin) {
    return new Promise((resolve, reject) => {
        let shift = parseInt(adr.slice(2), 16);
        let end = shift + buf.length;
        console.log(end, shift, bin.length)
        if (bin.length < end) {
            let tail = Buffer.alloc(end - bin.length, "FF", "hex");
            bin = Buffer.concat([bin, tail]);
        }
        bin.fill(buf, shift, end);
        resolve(bin)
    })
}

async function readFileToBin(path) {
    return new Promise((resolve, reject) => {
        console.log(1)
        fs.readFile(path, null, (error, file) => {
            console.log(path)
            if (error) {
                console.log(error)
                reject(error)
            }
            bin = Buffer.from(file);
            resolve(bin)
        });
    })
}

async function writeStrToBin(adress, dataInFunctions, bin) {
    return new Promise((resolve, reject) => {
        console.log(3)
        let adr = adress;
        let str = dataInFunctions;
        let buf = Buffer.from(str);
        resolve([adr, buf, bin])
    })
}

async function writeHexToBin(adress, dataInFunctions, bin) {
    return new Promise((resolve, reject) => {
        console.log(2)
        let adr = adress;
        let hex = dataInFunctions;
        let buf = Buffer.from(ByteBuffer.fromHex(hex).toArrayBuffer());
        resolve([adr, buf, bin])
    })
}

async function createNewBin(bin) {
    return new Promise((resolve, reject) => {
        console.log('create')
        fs.writeFile('./bin/device.bin', bin, error => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                console.log('binary file is ready')
                resolve(bin)
            }
        })
    })
}
export async function goGenerate(path, data) {
    // read
    await readFileToBin(path)
        .then((response) => {
            bin = response
            console.log("readFileToBin: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // first writeHexToBin
    await writeHexToBin("0x1C0000", data["0"].hex["0x1C0000"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeHexToBin1: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin1: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // second writeHexToBin
    await writeHexToBin("0x1C0004", data["0"].hex["0x1C0004"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeHexToBin2: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin2: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // third writeHexToBin
    await writeHexToBin("0x1C000A", data["0"].hex["0x1C000A"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeHexToBin3: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin3: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // fourths writeHexToBin
    await writeHexToBin("0x1C00A4", data["0"].hex["0x1C00A4"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeHexToBin4: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin4: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // fifth writeHexToBin
    await writeHexToBin("0x1C00CA", data["0"].hex["0x1C00CA"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeHexToBin5: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin5: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // first writeStrToBin
    await writeStrToBin("0x1C0090", data["0"].str["0x1C0090"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeStrToBin1: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin1: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    // second writeStrToBin
    await writeStrToBin("0x1C00A6", data["0"].str["0x1C00A6"], bin)
        .then((response) => {
            adress = response[0]
            buffer = response[1]
            bin = response[2]
            console.log("writeStrToBin2: ", [adress, buffer, bin])

        })
        .catch((err) => {
            console.log(err)
        })

    await writeBufToBin(adress, buffer, bin)
        .then((response) => {
            bin = response
            console.log("writeBufToBin2: ", bin)
        })
        .catch((err) => {
            console.log(err)
        })

    await createNewBin(bin)
        .then((response) => {
            bin = response
            console.log("BIN READY: ", bin)
        })
        .catch(e => console.log(e))

}


