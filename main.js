'use strict';

async function init() {
    const adId = document.querySelector('meta[name="twitter:app:url:iphone"]')?.content.split('id=')[1];

    if (adId == null) {
        return;
    }

    const apiResponse = await sendGetRequest(`https://api.mercadolibre.com/items?ids=${adId}`);

    const {
        body: {date_created},
    } = apiResponse[0] || null;

    if (date_created == null) {
        return;
    }

    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // h * m * s * m

    const adStartTime = new Date(date_created);
    const adDiffDays = Math.round(Math.abs(adStartTime - today) / oneDay);

    const container = document.querySelector('.ui-pdp-header__subtitle');

    if (container == null) {
        return;
    }

    // o site do ML executa um refresh na página depois de 1,5 segundos. aguarde esse tempo para popular o DOM.
    setTimeout(() => {
        container.insertAdjacentHTML(
            'beforebegin',
            `
            <ul class="mltext-container">
                <li>Anúncio criado em: <span>${formatDate(adStartTime)} (${adDiffDays} dias atrás)</span></li>
            </ul>            
            `
        )
    }, 1500);
}

async function sendGetRequest(url) {
    try {
        const config = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(url, config);

        return await response.json();
    } catch (error) {
        console.log('Request error:', error);
    }
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

init();