const fs = require('fs');

let categoriesString = '';
let categoriesCounter = 0;
let examplesCounter = 0;
fs.readdir(`${__dirname}/src/examples/`, function (err, categories) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    categoriesCounter = categories.length;
    categories.forEach(function (category) {
        var dir = `dist/${category}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.readdir(`${__dirname}/src/examples/${category}`, (err, examples) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            categoriesString += `<h2>${category}</h2>`;
            examplesCounter += examples.length;
            examples.forEach((e) => {
                const example = e.replace('.tsx', '');
                categoriesString += `<li><a href='/#/iframe/${category}/${example}'>${example}</a></li>`;
                examplesCounter--;
                if (examplesCounter === 0) {
                    // categoriesString += '</ul>';
                    categoriesCounter--;
                    if (categoriesCounter === 0) {
                        createIframeDirectory();
                    }
                }
                const content = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url='/#/${category}/${example}'" />
  </head>
  <body>
    <p>Please follow <a href="/#/${category}/${example}">this link</a>.</p>
  </body>
</html>
`;
                var dir = `dist/${category}/${example}`;
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                fs.writeFile(`dist/${category}/${example}/index.html`, content, (err) => {
                    if (err) {
                        console.error(err);
                        return null;
                    }
                });
            });
        });
    });
});

function createIframeDirectory() {
    const iframeDirectoryHtml = `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    ${categoriesString}
    </body>
    </html>
    `;
    var dir = `dist/iframes/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFile(`dist/iframes/index.html`, iframeDirectoryHtml, (err) => {
        if (err) {
            console.error(err);
            return null;
        }
    });
}