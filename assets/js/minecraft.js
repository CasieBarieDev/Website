const plugin = $('[data-spigotid]');
$.each(plugin, function () {
    const self = $(this);

    $.getJSON("https://api.spiget.org/v2/resources/" + self.data('spigotid') + "/versions/latest", function (data) {
        self.find(".version").text("v" + data["name"] + "⠀");
    })

    $.getJSON("https://api.spiget.org/v2/resources/" + self.data('spigotid'), function (data) {
        self.find(".downloads").html("⠀" + data["downloads"] + "<i class=\"icon-download\"></i>");
    })

    $.getJSON("https://api.spiget.org/v2/resources/" + self.data('spigotid'), function (data) {
        const testedVersions = data["testedVersions"];
        if(testedVersions.length === 1) {self.find(".desc").text("(" + testedVersions + ")");
        } else {self.find(".desc").text("(" + testedVersions[0] + "-" + testedVersions[testedVersions.length - 1] + ")");}
    })
});

const library = $('[data-libraryname]');
$.each(library, function () {
    const self = $(this);
    $.getJSON("https://api.github.com/repos/" + self.data('libraryname') + "/releases/latest", function (data) {
        self.find(".version").text("v" + data["tag_name"] + " ")
    })
})