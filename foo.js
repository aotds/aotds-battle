let x = 0

async function test() {
  x+= await 2
  console.log(x)
}

test()
x += 1
console.log(x)
