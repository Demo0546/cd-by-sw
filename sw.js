self.addEventListener("install", (event) => {
    console.log("install", event);
    return self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("activate", event);
    return self.clients.claim();
});


self.addEventListener("fetch", function(event) {
    console.log("fetch", event);
    const {request} = event;
    const filename = "テスト_0123_📂🔥_4567.txt";

    if (request.url.includes("sw-handled-url")) {
        const cdHeader = `attachment; filename=${filename}`;
        // [1]
        // Only this way:
        const headers = {"content-disposition": stringToBinaryString(cdHeader)};

        //// [2]
        // const headers = {"content-disposition": cdHeader};
        //// Failed to construct 'Response': Value is not a valid ByteString.

        //// [3]
        // const headers = new Headers();
        // headers.append("content-disposition", cdHeader);
        //// Failed to execute 'append' on 'Headers': String contains non ISO-8859-1 code point

        event.respondWith(new Response("by sw", {headers}));
    }
});

function stringToBinaryString(str) {
    return arrayBufferToBinaryString(new TextEncoder().encode(str));
}
function arrayBufferToBinaryString(arrayBuffer) {
    return arrayBuffer.reduce((accumulator, byte) => accumulator + String.fromCharCode(byte), "");
}
