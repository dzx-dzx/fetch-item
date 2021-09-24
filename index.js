import cheerio from "cheerio";
import axios from "axios";
import { fetchIndividualItem } from "./item.js";

// fetchIndividualItem("/wiki/Wheat_Seeds")
const visitedRoute = new Set()
const html = await axios.get("https://minecraft.fandom.com/wiki/Item").then((res) => res.data)

const $ = cheerio.load(html)
$("div.div-col > ul").each((index, ul) => {
    ul.children.filter((e) => e.name == 'li').forEach((li) => {
        let route = li.children[0].attribs.href
        if (!visitedRoute.has(route))
            fetchIndividualItem(route)
        visitedRoute.add(route)
    })
})
console.log(visitedRoute)