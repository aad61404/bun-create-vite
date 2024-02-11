import path from "path";

const ConentTypesMap = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    favicon: "favicon.ico",
    // json: "application/json",
}

export const getFilePath = (filename) => {
    if (filename === "/") {
        return { filePath: "index.html" , contentType: "text/html"};
    }
    const extname = path.extname(filename).replace(".", "");
    const contentType = ConentTypesMap[extname] || "text/html";
    const filePath = path.join(process.cwd(), filename);

    return {
        filePath,
        contentType
    }
}