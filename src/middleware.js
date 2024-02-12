import { getFilePath, getEntryPoint } from "./utils.js"
import path from "path"

const ExcludeList = ["/src/client.js", "/local_js.js"]
export const replaceImportMiddleware = async (req, res, next) => {
	const { url } = req

	if (url.endsWith(".js") && !ExcludeList.includes(url)) {
		const { filePath, contentType } = getFilePath(url)
		const file = Bun.file(filePath)
		let content = await file.text()

		const regex = /from ['"](?!\.\/)([^'"]+)['"]/g
		// pre-bundling
		const matches = content.match(regex)
		if (matches) {
			console.log("🚀 ~ matches:", matches)
			const mod_regex = /['"](?!\.\/)([^'"]+)['"]/
			const modules = matches
				.map((m) => {
					console.log("🚀 ~ m.match(mod_regex)[1]:", m.match(mod_regex)[1])
					return m.match(mod_regex)[1]
				})
				.map(getEntryPoint)

			Bun.build({
				entryPoints: modules.map((m) => `./node_modules/${m}`),
				outdir: "./node_modules/.bun-create-vite/deps",
			})
		}

		// content = content.replace(regex, `from "../node_modules/$1"`);
		content = content.replace(regex, (_match, capture) => {
			const entryPoint = getEntryPoint(capture)
			// return `from "./node_modules/${entryPoint}"`
			return `from "./node_modules/.bun_create_vite/deps/${entryPoint}"`
		})

		res.writeHead(200, { "Content-Type": contentType })
		res.end(content)
	}
	next()
}

export const indexHTMLMiddleware = async (req, res, next) => {
	const { filePath, contentType } = getFilePath(req.url)

	try {
		const file = Bun.file(filePath)
		let content = await file.text()

		if (path.basename(filePath) === "index.html") {
			// 比對 <head> ~ </head> 內部的內容
			const regex = /(<head>)([\s\S]*?)(<\/head>)/i
			const match = content.match(regex)
			const clientScript = `<script src="src/client.js"></script>`

			if (match) {
				// 新增 client.js 到 index.html 的 <head>  內
				content = content.replace(regex, `$1$2${clientScript}$3`)
			}
		}
		res.writeHead(200, { "Content-Type": contentType })
		// res.setHeader("Content-Type", contentType);
		res.end(content)
		next()
	} catch (error) {
		console.log("error:", error)
	}
}
