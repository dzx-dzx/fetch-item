import cheerio from "cheerio";
import axios from "axios";
import Jimp from "jimp";
const raw = await Jimp.read("https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f5/ItemCSS.png")

export async function fetchIndividualItem(route) {
    console.log("Fetching:" + route)
    const html = await axios.get(`https://minecraft.fandom.com${route}`).then((res) => res.data)
    const $ = cheerio.load(html)
    let table = $("#ID").parent().nextAll("p").eq(1)/*First "Java Edition", then "Bedrock Edition"*/.next().find("tbody").eq(0)

    const header = table.children().eq(0).children().map((i, th) => $(th).text())
    const namespaceIDIndex = header.toArray().findIndex((t) => t == 'Resource location')
    const nameIndex = 0//eader.toArray().findIndex((t) => t == 'Name')
    const formIndex = header.toArray().findIndex((t) => t == 'Form')

    table.children().each((i, e) => {
        if (i == 0) return
        if ($(e.children[formIndex]).text().includes("Item")) {
            let [x, y] = $(e.children[nameIndex]).find("span").css("background-position").replaceAll("px", "").replaceAll("-", "").split(" ").map(s => Number(s))
            raw.clone().crop(x, y, 16, 16).write(`out/${$(e.children[namespaceIDIndex]).text()}.png`)
        }
    })
}