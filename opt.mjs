import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Replace CRLF handling to preserve exactly
const eol = html.includes('\r\n') ? '\r\n' : '\n';

html = html.replace(/preload="metadata"/g, 'preload="none"');

html = html.replace(/<img(.*?)src="assets\/projects\/([^"]+)"([^>]*)>/g, (match, prefix, src, suffix) => {
    if (match.includes('loading="lazy"')) return match;
    return `<img${prefix}src="assets/projects/${src}"${suffix} loading="lazy" decoding="async" fetchpriority="low">`;
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('optimized');
