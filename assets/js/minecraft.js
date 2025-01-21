document.querySelectorAll('[data-spigotid]').forEach((element) => {
    const spigotId = element.dataset.spigotid;

    fetch(`https://api.spiget.org/v2/resources/${spigotId}/versions/latest`).then(response => response.json())
        .then(data => {
            const versionElement = element.querySelector('.version');
            if(versionElement) {versionElement.textContent = `v${data.name}⠀`;}
        }
    );

    fetch(`https://api.spiget.org/v2/resources/${spigotId}`).then(response => response.json())
        .then(data => {
            const downloadsElement = element.querySelector('.downloads');
            if(downloadsElement) {downloadsElement.innerHTML = `⠀${data.downloads} <i class="icon-download"></i>`;}
        }
    );

    fetch(`https://api.spiget.org/v2/resources/${spigotId}`).then(response => response.json())
        .then(data => {
            const testedVersions = data.testedVersions;
            const descElement = element.querySelector('.desc');
            if(descElement) {
                if(testedVersions.length === 1) {descElement.textContent = `(${testedVersions})`;
                } else {descElement.textContent = `(${testedVersions[0]}-${testedVersions[testedVersions.length - 1]})`;}
            }
        }
    );
});

document.querySelectorAll('[data-libraryname]').forEach((element) => {
    const libraryName = element.dataset.libraryname;
    fetch(`https://api.github.com/repos/${libraryName}/releases/latest`).then(response => response.json())
        .then(data => {
            const versionElement = element.querySelector('.version');
            if(versionElement) {versionElement.textContent = `v${data.tag_name} `;}
        }
    );
});