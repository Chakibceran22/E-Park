import { kafka } from "./kafka.js";


export const consumer = kafka.consumer({ groupId: 'iot-group' })

