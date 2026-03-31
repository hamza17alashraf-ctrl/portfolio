const langs = ['en', 'fr', 'ar'];
let currentLang = 'en';

function normalizeText(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
}

function updateTexts() {
    document.documentElement.lang = currentLang;

    // Switch dir
    if (currentLang === 'ar') {
        document.body.dir = 'rtl';
    } else {
        document.body.dir = 'ltr';
    }

    const select = document.getElementById('lang-switcher');
    if (select) {
        select.value = currentLang;
    }

    // Traverse DOM to find Text Nodes and translatable attributes
    const walkNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Check if we have original text
            let original = node._originalText;
            if (original === undefined) {
                const text = normalizeText(node.nodeValue);
                if (text.length > 0 && translations[text]) {
                    node._originalText = text;
                    original = text;
                }
            }

            if (original && translations[original]) {
                if (currentLang === 'en') {
                    node.nodeValue = original;
                } else if (translations[original][currentLang]) {
                    node.nodeValue = translations[original][currentLang];
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            // Placeholders
            if (node.hasAttribute('placeholder')) {
                let original = node.getAttribute('data-original-placeholder');
                if (!original) {
                    const text = normalizeText(node.getAttribute('placeholder'));
                    if (text.length > 0 && translations[text]) {
                        node.setAttribute('data-original-placeholder', text);
                        original = text;
                    }
                }

                if (original && translations[original]) {
                    if (currentLang === 'en') {
                        node.setAttribute('placeholder', original);
                    } else if (translations[original][currentLang]) {
                        node.setAttribute('placeholder', translations[original][currentLang]);
                    }
                }
            }

            // Iterate children
            for (let i = 0; i < node.childNodes.length; i++) {
                walkNode(node.childNodes[i]);
            }
        }
    };

    walkNode(document.body);
}

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('lang-switcher');
    if (select) {
        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            updateTexts();
        });
    }
    // initialize
    updateTexts();
});

