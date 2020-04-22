const functions = require('../src/app')
const requests = require('../__mocks__/requestsMock')

const orders = requests.getOrders();

const users = requests.getUsers();

const companies = requests.getCompanies();

const currencies = requests.getCurrencies();

const $ = require('jquery');

describe('Initializing method', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve(orders) });
  window.fetch = jest.fn().mockImplementation(() => mockFetch);

  document.body.innerHTML = `<body>
                              <div id="app">
                                  <div id="header"></div>
                                  <table>
                                      <thead id="orders-head">
                                      </thead>
                                      <tfoot id="orders-foot">
                                      </tfoot>
                                      <tbody id="orders-list">
                                      </tbody>
                                  </table>
                              </div>
                            </body>`;
  
  document.getElementById('header').innerHTML = `<div id="container">
                            <div id="currency">
                                <span>Select currency:</span>
                                <span>
                                    <select form="currencies" id="currencies" onchange="changeCurrency(this.options[this.selectedIndex].value)"> 
   
                                    </select> 
                                </span>
                            </div>
                            <div id="search">
                                <span>Search:</span>
                                <span><input type="text" id="search__input" onchange="searchOrders()"></span>
                            </div>
                        </div>`

  test('Change Currency is changing money values in Total column', async () => {
    await functions.inititalize();
    
    expect($('td')[1].innerHTML).toBe('Orders Total:<br> $ 2277.212');
    
    window.changeCurrency('2')

    expect($('td')[1].innerHTML).toBe('Orders Total:<br> $ 4193.760');
  });

  test('Change Currency is changing money values in Total column with filtered orders', async () => {
    await functions.inititalize();
    
    document.getElementById('search__input').value = 'switch';

    window.changeCurrency('2')

    expect($('td')[1].innerHTML).toBe('Orders Total:<br> $ 1063.140');
  });

  test('Search Orders is leaving only found orders', async () => {
    await functions.inititalize();
    
    expect($('#orders-list').children().length).toBe(6);

    document.getElementById('search__input').value = 'switch';

    window.searchOrders();

    expect($('#orders-list').children().length).toBe(2);
  });

  test('Search Orders is leaving nothing if no orders found', async () => {
    await functions.inititalize();

    document.getElementById('search__input').value = '123123123123';

    window.searchOrders();

    expect($('#orders-list').children().length).toBe(1);
  });

  test('Sort orders should render sorted items', async () => {
    await functions.inititalize();

    expect(document.getElementsByTagName('tr')[6].innerHTML.includes('switch')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[7].innerHTML.includes('jcb')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[8].innerHTML.includes('visa-electron')).toBeTruthy()

    window.sortOrders('card_type')

    expect(document.getElementsByTagName('tr')[6].innerHTML.includes('jcb')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[7].innerHTML.includes('switch')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[8].innerHTML.includes('visa-electron')).toBeTruthy()
  })

  test('Sort orders should render sorted items with filtered orders', async () => {
    await functions.inititalize();

    expect(document.getElementsByTagName('tr')[7].innerHTML.includes('switch')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[8].innerHTML.includes('jcb')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[9].innerHTML.includes('visa-electron')).toBeTruthy()

    document.getElementById('search__input').value = 'c';

    window.sortOrders('card_type')

    expect(document.getElementsByTagName('tr')[7].innerHTML.includes('jcb')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[8].innerHTML.includes('switch')).toBeTruthy()
    expect(document.getElementsByTagName('tr')[9].innerHTML.includes('visa-electron')).toBeTruthy()
  })
});

test('Toggle Sort Parameter should add arrow sign', () => {
  document.body.innerHTML = `<table>
                              <thead id="orders-head">
                              <tr>
                                <th class="theader" onclick="sortOrders('transaction_id')">Transaction ID <span id="transaction_id-sort"></span></th>
                                <th class="theader" onclick="sortOrders('name')">User Info <span id="name-sort"></span></th>
                                <th class="theader" onclick="sortOrders('created_at')">Order Date <span id="created_at-sort"></span></th>
                                <th class="theader" onclick="sortOrders('total')">Order Amount <span id="total-sort"></span></th>
                                <th>Card Number</th>
                                <th class="theader" onclick="sortOrders('card_type')">Card Type <span id="card_type-sort"></span></th>
                                <th class="theader" onclick="sortOrders('order_country')">Location <span id="order_country-sort"></span></th>
                              </tr>
                              </thead>
                            </table>`;
  
  functions.toggleSortParameter('transaction_id');

  expect(document.getElementById('transaction_id-sort').innerText).toBe('\u2193');
});

test('Show Statistics should render statistic data', () => {
  document.body.innerHTML = `<table>
                              <tfoot id="orders-foot">
                              </tfoot>
                            </table>`;
  
  functions.showStatistics(orders, users, '1');

  expect($('td')[0].innerHTML).toBe('Orders Count:<br> 3');
  expect($('td')[1].innerHTML).toBe('Orders Total:<br> $ 2096.880');
  expect($('td')[2].innerHTML).toBe('Median Value:<br> $ 593.72');
  expect($('td')[3].innerHTML).toBe('Average Check:<br> $ 698.960');
  expect($('td')[4].innerHTML).toBe('Average Check (Female):<br> $ 521.770');
  expect($('td')[5].innerHTML).toBe('Average Check (Male):<br> $ 177.190');
});

test('Request to api.exchangeratesapi.io/latest returns currencies', async () => {
  expect(currencies).toHaveProperty('rates')
});

test('Request to /api/users returns array of users', async () => {
  expect(users.length).toBe(3)
});

test('Request to /api/companies returns array of companies', async () => {
  expect(companies.length).toBe(2)
});

test('Request to /api/orders returns array of orders', async () => {
  expect(orders.length).toBe(3)
});

test('Display Orders should render orders on html page', () => {
  document.body.innerHTML = `<table>
                              <tbody id="orders-list">
                              </tbody>
                            </table>`;

  
  expect($('#orders-list').children().length).toBe(0);

  window.displayOrders(orders, users, companies, '1')

  expect($('#orders-list').children().length).toBe(6);
});

test('Toggle user info allows to show/hide user info', () => {
  const order = orders[0];

  document.body.innerHTML =`<table>
                                <tbody id="orders-list"><
                                div class="order">
                                <tr id="order_${order.id}">
                                  <td>123</td>
                                  <td class="user_data">
                                      <a href="javascript:void();" onclick="toggleUserInfo('order_${order.id}')">123</a>
                                      <div class="user-details" style="display: none;">
                                          <p>Birthday: 123</p>
                                          <img src="123" width="100px">
                                      </div>
                                  </td>
                              </tr>
                            </div>
                            </tbody>
                            </table>`;

  expect($('.user-details').css('display')).toEqual('none');

  window.toggleUserInfo('order_1');

  expect($('.user-details').css('display')).toEqual('block');

  window.toggleUserInfo('order_1');

  expect($('.user-details').css('display')).toEqual('none');
});

test('getMedianValue returns median of an array', () => {
  let median = functions.getMedianValue(orders, 1);

  expect(median).toBe(593.72);

  // Case for odd length of an array
  median = functions.getMedianValue(orders.filter((order) => order.id < 3), 1);

  expect(median).toBe(562.645);
});

test('getFormattedCardNumber returns card number with *', () => {
  const formatted_card = functions.getFormattedCardNumber('11111111');

  expect(formatted_card).toBe('11**1111');
});

test('getFormattedName returns name with Mr/Ms', () => {
  const formatted_male_name = functions.getFormattedName('Islam', 'Rustamov', 'Male');

  expect(formatted_male_name).toBe('Mr. Islam Rustamov');

  const formatted_female_name = functions.getFormattedName('Islama', 'Rustamova', 'Female');

  expect(formatted_female_name).toBe('Ms. Islama Rustamova');
});

test('Order Date Converter should return DD/MM/YY h:m:s', () => {
  const unix_timestamp = 1587539813;
  const order_date = functions.orderDateConverter(unix_timestamp)

  expect(order_date).toBe('22/4/2020 10:16:53');
});

test('Birthday Date Converter should return DD/MM/YY', () => {
  const unix_timestamp = 1587539813;
  const birthday_date = functions.birthdayDateConverter(unix_timestamp)

  expect(birthday_date).toBe('22/4/2020 ');
});


test('Date Converter Helper should return DD/MM/YY', () => {
  const unix_timestamp = 1587539813;
  const date_object = new Date(unix_timestamp * 1000)
  const converted_time = functions.dateConverterHelper(date_object);

  expect(converted_time).toBe('22/4/2020 ');
});
