import {promises as fs} from 'fs'
import * as http from 'node:http'
import * as https from 'node:https'

const opensearchUrl = 'http://localhost:9200'

async function convertToBulkFormat(inputFile, indexName) {
    try {
        // Read and parse the input JSON file
        let data = JSON.parse(await fs.readFile(inputFile, 'utf8'))

        if (!Array.isArray(data)) {
            throw new Error('Input JSON must be an array of objects')
        }

        if (!data.every(item => item.section_refid)) {
            throw new Error(`All documents must have a section_refid field. Missing from: ${item}`)
        }

        // Convert to bulk format
        const bulkData = data.flatMap(item => [
            // Tell OpenSearch how to index the document, section_refid is a unique ID
            JSON.stringify({ index: { _index: indexName, _id: item.section_refid } }), // Use index operation with _id
            JSON.stringify(item)
        ])
        console.log(`Converted ${data.length} documents to bulk format`)

        // Join with newlines and add final newline
        const bulkContent = bulkData.join('\n') + '\n'

        return bulkContent
    } catch (error) {
        console.error('Error:', error.message)
        process.exit(1)
    }
}

async function postToOpenSearch(bulkContent, url = opensearchUrl) {
    return new Promise((resolve, reject) => {
        const url = new URL('/_bulk', url)
        const client = url.protocol === 'https:' ? https : http

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-ndjson',
                'Content-Length': Buffer.byteLength(bulkContent)
            }
        }

        const req = client.request(url, options, (res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            })

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data)
                } else {
                    reject(new Error(`HTTP Error ${res.statusCode}: ${data}`))
                }
            })
        })

        req.on('error', (error) => {
            reject(error)
        })

        req.write(bulkContent)
        req.end()
    })
}

async function main() {
    if (process.argv.length !== 5) {
        console.log('Usage: node post.js input.json output.json index_name')
        process.exit(1)
    }

    const [, , inputFile, indexName] = process.argv

    try {
        const bulkContent = await convertToBulkFormat(inputFile, indexName)
        console.log('Posting to OpenSearch...')
        const result = await postToOpenSearch(bulkContent)
        console.log('Successfully posted to OpenSearch:', result)
    } catch (error) {
        console.error('Error:', error.message)
        process.exit(1)
    }
}

main()
