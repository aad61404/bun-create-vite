export const indexHTMLMiddleware = async (req: any, res: any, next: any) => {
    const file = Bun.file("index.html");
    const content = await file.text()
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
};