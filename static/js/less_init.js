var ctag = document.getElementById("less_init");
less = {
    env: ctag.dataset.env || "development",
    async: ctag.dataset.async || false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false
};
console.log(less);
