const {HtmlUrlChecker} = require("broken-link-checker");

const readline = require("readline");

const getInput = (() => new Promise((res) => {
	const rl = readline.createInterface({
		input: process.stdin,
	});
	const lines = [];

	rl.on("line", (line) => {
		lines.push(line);
	}).on("close", () => {
		res(lines);
	});
}));

const checkForBrokenLinks = (urls) => new Promise((resolve) => {
	const res = [];
	const htmlUrlChecker = new HtmlUrlChecker({excludedKeywords: ["www.linkedin.com", "news.ycombinator.com/submitlink"]}, {
		link: (result, customData) => {
			if (result.broken) {
				res.push({
					page: customData,
					url: result.url.resolved,
					reason: result.brokenReason,
				});
			}
		},
		end: () => resolve(res),
	});

	urls.forEach((url) => htmlUrlChecker.enqueue(url,url));
});

(async () => {
	const input = await getInput();
	const res = await checkForBrokenLinks(input);
	const resObj = {};
	input.forEach((url) => {
		resObj[url] = res.filter(({page}) => page === url).map(({url, reason}) => ({url, reason}));
	});

	console.log(JSON.stringify(resObj));
})();
