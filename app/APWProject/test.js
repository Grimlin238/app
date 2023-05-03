var api = require('api')

var get = new api('http://api.quotable.io/random')


async function main() {
var word = await get.getData();

console.log(word)
}

main()