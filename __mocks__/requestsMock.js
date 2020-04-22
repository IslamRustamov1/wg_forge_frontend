function getUsers() {
    return [{
        "id": 1,
        "first_name": "Gaylord",
        "last_name": "Vasyutin",
        "gender": "Male",
        "birthday": null,
        "avatar": "https://robohash.org/quibusdamminusea.bmp?size=100x100&set=set1",
        "company_id": 1
      },
      {
        "id": 2,
        "first_name": "Berenice",
        "last_name": "Bavister",
        "gender": "Female",
        "birthday": "337788377",
        "avatar": "https://robohash.org/molestiaeautquibusdam.jpg?size=100x100&set=set1",
        "company_id": null
      },
      {
        "id": 3,
        "first_name": "Hailee",
        "last_name": "Lickess",
        "gender": "Female",
        "birthday": "660059353",
        "avatar": "https://robohash.org/etinciduntdoloremque.png?size=100x100&set=set1",
        "company_id": 3
        }]
}

function getOrders() {
    return [
        {
        "id": 1,
        "transaction_id": "ae35d511-b468-44b4-8529-b3574cd6d319",
        "created_at": "1543325996",
        "user_id": 1,
        "total": "531.57",
        "card_type": "switch",
        "card_number": "3584440309543797",
        "order_country": "US",
            "order_ip": "239.24.84.243",
            first_name: 'asd',
        last_name: 'b'
      },
      {
        "id": 2,
        "transaction_id": "0af118c1-afb5-4a75-8e44-2679d64c5efb",
        "created_at": "1425057783",
        "user_id": 2,
        "total": "593.72",
        "card_type": "jcb",
        "card_number": "4905057916868233",
        "order_country": "BR",
          "order_ip": "207.145.87.46",
          first_name: 'asd',
          last_name: 'a'
      },
      {
        "id": 3,
        "transaction_id": "44fd9e8b-e77a-4b79-a0f3-9f22fc44907d",
        "created_at": "1481134813",
        "user_id": 3,
        "total": "971.59",
        "card_type": "visa-electron",
        "card_number": "4175006478330531",
        "order_country": "ID",
          "order_ip": "73.28.70.255",
          first_name: 'asd',
          last_name: 'c'
        }]
}

function getCompanies() {
    return [{
        "id": 1,
        "title": "Kerluke, Blick and Brekke",
        "industry": "Real Estate Investment Trusts",
        "market_cap": "$8.15B",
        "sector": "Consumer Services",
        "url": "https://hubpages.com"
      },
      {
        "id": 3,
        "title": "Oberbrunner, Jacobs and Kshlerin",
        "industry": "Computer Software: Prepackaged Software",
        "market_cap": "$1.65B",
        "sector": "Technology",
        "url": "https://washingtonpost.com"
      }]
}

function getCurrencies() {
    return {"rates":{"CAD":1.5393,"HKD":8.3987,"ISK":157.8,"PHP":55.096,"DKK":7.4582,"HUF":355.02,"CZK":27.447,"AUD":1.7266,"RON":4.8373,"SEK":10.9543,"IDR":17001.63,"INR":83.376,"BRL":5.7619,"RUB":83.2936,"HRK":7.57,"JPY":116.39,"THB":35.269,"CHF":1.0517,"SGD":1.551,"PLN":4.5291,"BGN":1.9558,"TRY":7.5658,"CNY":7.6888,"NOK":11.4843,"NZD":1.8181,"ZAR":20.5853,"USD":1.0837,"MXN":26.3957,"ILS":3.8522,"GBP":0.8812,"KRW":1335.34,"MYR":4.7634},"base":"EUR","date":"2020-04-21"}
}

export { getCompanies, getOrders, getUsers, getCurrencies };