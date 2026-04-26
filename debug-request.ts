import request from 'superagent'

const url = 'https://www.paknsave.co.nz/shop/search?q=Granny%20Smith%20Apples&pg=1'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function runDebug() {
  console.log('--- STARTING REQUEST ---')
  console.log(`URL: ${url}`)
  console.log(`User-Agent: ${userAgent}`)
  console.log('------------------------\n')

  try {
    const res = await request
      .get(url)
      .set('User-Agent', userAgent)
      .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8')

    console.log('--- RESPONSE SUCCESS ---')
    console.log(`Status: ${res.status}`)
    console.log('Headers:', JSON.stringify(res.headers, null, 2))
    console.log('Body Preview:', res.text.substring(0, 500))
  } catch (err: any) {
    console.log('--- RESPONSE ERROR ---')
    if (err.response) {
      console.log(`Status: ${err.response.status}`)
      console.log('Headers:', JSON.stringify(err.response.headers, null, 2))
      console.log('Body Preview:', err.response.text.substring(0, 500))
    } else {
      console.error('Error Message:', err.message)
    }
  }
}

runDebug()
