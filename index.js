import Agent from "@dannie-prod/dannie-prod-agent"
import fs from "fs"

import {goGenerate} from './src/generateBin.js'
import {write, erase, resetUsb} from "./src/firmware.js";
import {ping, read} from "./src/checkDevice.js";
import {clearTableDhcp, startDhcp, stopDhcp} from "./src/dhcp.js";

const confPath = process.env.PRINTER_AGENT_CONF_PATH ? process.env.PRINTER_AGENT_CONF_PATH : 'conf.json'
const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'))

const agent = new Agent({
    host: conf.host,
    mount: conf.mount,
    token: conf.token
})
agent.run(async (data) => {
    let label = null
    console.log(data)
    try {
        label = data.map((row) => {
            if (Array.isArray(row)) {
                return row.join("")
            } else {
                return row
            }
        }).concat([""]).join("\n")
    } catch (e) {
        throw {error: "format", message: "input data parsing error"}
    }
    try {
        console.log(label)
        if (label) {
            if (data[0].action.command === "erase") {
                let message
                await erase()
                    .then((response) => {
                        if (response) {
                            message = {success: "Успешно", message: "Прошивка кассы стёрта"}
                        }
                    })
                    .catch((err) => {
                        if (!err) {
                            console.log(err)
                            message = {success: "Ошибка", message: "Не удалось стереть прошивку. Повторите попытку"}
                        }
                    })
                return message
            }
            if (data[0].action.command === "write") {
                let message
                console.log(data)
                await goGenerate(conf.path, data)
                await resetUsb()
                await write()
                    .then((response) => {
                        if (response) {
                            fs.writeFile("lastDeviceData.json",
                                `{"MAC":"${data["0"].hex["0x1C0004"]}", "SERIAL":"${data["0"].str["0x1C0090"]}", "UID":"${data["0"].str["0x1C00A6"]}"}`,
                                function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Файл создан");
                                    }
                                });
                            message = {success: "Успешно", message: "Касса прошита"}
                        }
                    })
                    .catch((err) => {
                        if (err === 'LIBUSB_ERROR_NO_DEVICE') {
                            console.log(err)
                            message = {success: "Ошибка", message: "Проверьте подключение кассы!"}
                        }
                        if (!err) {
                            console.log(err)
                            message = {success: "Ошибка", message: "Не удалось прошить кассу. Повторите попытку"}
                        }
                    })
                console.log(message)
                return message
            }
            if (data[0].action.command === "test") {
                let message
                const lastDeviceData = JSON.parse(fs.readFileSync('./lastDeviceData.json', 'utf8'))
                console.log(lastDeviceData)

                await stopDhcp()
                await clearTableDhcp()
                await startDhcp()

                await ping()
                // .then(response => {
                //     console.log(response.split(" ").length)
                //     console.log(response.length)
                //     if(response.split(" ").length === 38) {
                //         message = {success: "Ошибка", message: "Неудачное обращение к кассе"}
                //     }
                // })
                await read()
                    .then(response => {
                        const isReadResult = response.data.RESULT === 'OK'
                        const isReadMac = response.data.DATA.KKT_MAC === lastDeviceData.MAC
                        const isReadSerial = lastDeviceData.SERIAL.includes(response.data.DATA.KKT_SERIAL.split("-")[4])
                        const isReadUid = response.data.DATA.KKT_UID === lastDeviceData.UID
                        console.log(response, isReadResult, isReadMac, isReadSerial, isReadUid)

                        if (isReadResult && isReadMac && isReadSerial && isReadUid) {
                            console.log("Касса прошита")
                            message = {success: response.data.DATA.KKT_SERIAL.split("-")[4], message: "Касса прошита"}
                        }
                        if (!isReadMac) {
                            console.log("Не совпадают MAC адреса")
                            message = {
                                success: response.data.DATA.KKT_SERIAL.split("-")[4],
                                message: "Не совпадают MAC адреса"
                            }
                        }
                        if (!isReadSerial) {
                            console.log("Не совпадают серийные номера")
                            message = {
                                success: response.data.DATA.KKT_SERIAL.split("-")[4],
                                message: "Не совпадают серийные номера"
                            }
                        }
                        if (!isReadUid) {
                            console.log("Не совпадают UID")
                            message = {
                                success: response.data.DATA.KKT_SERIAL.split("-")[4],
                                message: "Не совпадают UID"
                            }
                        }
                    })
                return message
            }
        }
    } catch (e) {
        console.log('ОШИБКА', e)
        throw {error: "print", message: "Printer is unavailable"}
    }
    // return {success: "EFIR", message: "Прошивка кассы стёрта"}
})
