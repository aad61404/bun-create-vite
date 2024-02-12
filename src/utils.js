import path from "path";
import fs from "fs";

const modules = ["lodash-es/has.js", "lodash-es/join.js", "dayjs"];

export const getEntryPoint = (module) => {
    if (!module.endsWith(".js")) {
        const package_file = `./node_modules/${module}/package.json`;
        const content = fs.readFileSync(package_file, "utf-8");
        const result = JSON.parse(content);
        
        return `${module}/${result.main}`;
    }
    return module;
}

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