import {ChannelCredentials} from "@grpc/grpc-js";
import {FailRequest} from "./service-example";
import {ExampleServiceClient, IExampleServiceClient} from "./service-example.grpc-client";


const client = new ExampleServiceClient(
    "localhost:5000",
    ChannelCredentials.createInsecure(),
    {},
    {}
);


async function main() {
    const startHeap = getHeapUsed();

    for (let i = 0; i < 1000; i += 1) {
        await callUnary(client);
    }

    const finishHeap = getHeapUsed();

    console.log({
        startHeap,
        finishHeap,
        diffHeap: finishHeap - startHeap,
    });
}

function getHeapUsed() {
    global.gc();
    return process.memoryUsage().heapUsed / 1024 / 1024;
}


function callUnary(client: IExampleServiceClient) {

    return new Promise<void>((resolve) => client.unary({
        question: 'whats up?',
        pleaseDelayResponseMs: 0,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    }, () => resolve()));

}


function callServerStream(client: IExampleServiceClient) {

    console.log(`### calling method "serverStream"...`)

    const call = client.serverStream({
        question: 'whats up?',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    call.on('data', arg1 => {
        console.log("got response message: ", arg1)
    });

    call.on('metadata', arg1 => {
        console.log("got response headers: ", arg1)
    });

    call.on('error', arg1 => {
        console.log("got err: ", arg1)
    });

    call.on('status', arg1 => {
        console.log("got status: ", arg1)
    });

    call.on('close', () => {
        console.log("got closed event")
    });

    call.on('end', () => {
        console.log("got end event")
    });

    return new Promise(resolve => {
        call.on('end', () => resolve());
    });
}


function callClientStream(client: IExampleServiceClient) {

    console.log(`### calling method "clientStream"...`)

    const call = client.clientStream((err, value) => {
        if (err) {
            console.log("got err: ", err)
        }
        if (value) {
            console.log("got response message: ", value)
        }
    });


    call.on('data', arg1 => {
        console.log("got response message: ", arg1)
    });

    call.on('metadata', arg1 => {
        console.log("got response headers: ", arg1)
    });

    call.on('error', arg1 => {
        console.log("got err: ", arg1)
    });

    call.on('status', arg1 => {
        console.log("got status: ", arg1)
    });

    call.on('close', () => {
        console.log("got closed event")
    });

    call.on('end', () => {
        console.log("got end event")
    });


    console.log("sending message...");
    call.write({
        question: 'whats up? #1',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    call.write({
        question: 'whats up? #2',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    call.write({
        question: 'whats up? #3',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("done sending");
    call.end();


    return new Promise(resolve => {
        call.on('status', () => resolve());
    });
}


function callBidi(client: IExampleServiceClient) {

    console.log(`### calling method bidi...`)

    const call = client.bidi();


    console.log("sending message...");
    call.write({
        question: 'whats up? #1',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    call.write({
        question: 'whats up? #2',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    call.write({
        question: 'whats up? #3',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("done sending");
    call.end();


    call.on('data', arg1 => {
        console.log("got response message: ", arg1)
    });

    call.on('metadata', arg1 => {
        console.log("got response headers: ", arg1)
    });

    call.on('error', arg1 => {
        console.log("got err: ", arg1)
    });

    call.on('status', arg1 => {
        console.log("got status: ", arg1)
    });

    call.on('close', () => {
        console.log("got closed event")
    });

    call.on('end', () => {
        console.log("got end event")
    });

    return new Promise(resolve => {
        call.on('end', () => resolve());
    });
}


main().catch(e => console.error(e)).finally(() => process.exit());

