export const scraperObject = {
    url: 'https://www.latlong.net/category/arenas-236-117.html',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url, {waitUntil: 'networkidle2'});
        const scrapedData = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const table3 = tables[2];

            if (!table3) {
                return [];
            }

            const rows = table3.querySelectorAll('tr');

            return Array.from(rows, (row) => {
                const cells = row.querySelectorAll('td');
                const cellData = Array.from(cells, (cell) => cell.innerText);

                return {
                    libelle: cellData[0],
                    latitude: cellData[1],
                    longitude: cellData[2],
                };
            });
        });
        scrapedData.shift(); // Supprime la ligne d'entête

        await page.close();
        return scrapedData;
    }
}