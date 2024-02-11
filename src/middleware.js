import path from "path";
import { getFilePath } from "./utils.js";


export const indexHTMLMiddleware = async (req, res, next) => {
    const { filePath, contentType } = getFilePath(req.url);

    try {
        const file = Bun.file(filePath);
        let content = await file.text()

        if (path.basename(filePath) === "index.html") {
            // 比對 <head> ~ </head> 內部的內容
            const regex = /(<head>)([\s\S]*?)(<\/head>)/i;
            const match = content.match(regex);
            const clientScript = `<script src="src/client.js"></script>`;

            if (match) {
                // 新增 client.js 到 index.html 的 <head>  內
                content = content.replace(regex, `$1$2${clientScript}$3`);
            }
        }
        res.writeHead(200, { "Content-Type": contentType });
        // res.setHeader("Content-Type", contentType);
        res.end(content);
        next();
    } catch (error) {
        console.log("error:", error)
    }

};
