const { readdir, readFile, unlink, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const scriptPath = '/assets/js/highlight.js';
const scriptSelector = `script[src="${scriptPath}"]`;

async function highlightSite(destination) {
    const prismFile = path.join(destination, scriptPath.slice(1));
    const prismSource = await readFile(prismFile, 'utf8');
    const files = await readdir(destination, { recursive: true, withFileTypes: true });

    for (const file of files) {
        if (!file.isFile() || !file.name.endsWith('.html')) {
            continue;
        }

        const filename = path.join(file.parentPath, file.name);
        const html = await readFile(filename, 'utf8');
        if (!html.includes(scriptPath)) {
            continue;
        }

        const dom = new JSDOM(html, { runScripts: 'outside-only' });
        const { window } = dom;
        try {
            const script = window.document.querySelector(scriptSelector);
            if (!script) {
                continue;
            }

            window.Prism = { manual: true };
            window.eval(prismSource);
            window.Prism.hooks.add('before-sanity-check', ({ element }) => {
                if (element.classList.contains('copy')) {
                    const copy = element.cloneNode(true);
                    copy.querySelectorAll('*').forEach(child => child.remove());
                    element.dataset.copyText = copy.textContent;
                }
            });
            window.Prism.highlightAll();
            script.remove();
            await writeFile(filename, dom.serialize());
        } finally {
            window.close();
        }
    }

    await unlink(prismFile);
}

highlightSite(path.resolve(process.argv[2] || '_site')).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
