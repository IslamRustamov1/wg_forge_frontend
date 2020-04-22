import './styles/styles.css';

async function getUsers() {
    const data = await fetch('http://localhost:9000/api/users')

    const result = await data.json()

    return result
}

async function getOrders() {
    const data = await fetch('http://localhost:9000/api/orders')

    const result = await data.json()

    return result
}

async function getCompanies() {
    const data = await fetch('http://localhost:9000/api/companies')

    const result = await data.json()

    return result
}

async function getCurrencies() {
    const data = await fetch('https://api.exchangeratesapi.io/latest')

    const result = await data.json()

    return result
}

async function inititalize() {
    const users = await getUsers()

    const orders = await getOrders()

    const companies = await getCompanies()

    const currencies = await getCurrencies()

    let currencies_select = ``
    let current_currency = '1.086'

    for (let currency in currencies.rates) {
        if (currency === 'USD') {
            currencies_select += `<option value="${currencies.rates[currency]}" selected>${currency}</option>`
        } else {
            currencies_select += `<option value="${currencies.rates[currency]}">${currency}</option>`
        }
    }

    document.getElementById('header').innerHTML = `<div id="container">
                                                        <div id="currency">
                                                            <span>Select currency:</span>
                                                            <span>
                                                                <select form="currencies" id="currencies" onchange="changeCurrency(this.options[this.selectedIndex].value)"> 
                                                                    ${currencies_select}
                                                                </select> 
                                                            </span>
                                                        </div>
                                                        <div id="search">
                                                            <span>Search:</span>
                                                            <span><input type="text" id="search__input" onchange="searchOrders()"></span>
                                                        </div>
                                                    </div>`

    document.getElementById('orders-head').innerHTML += `<tr>
                                                            <th class="theader" onclick="sortOrders('transaction_id')">Transaction ID <span id="transaction_id-sort"></span></th>
                                                            <th class="theader" onclick="sortOrders('name')">User Info <span id="name-sort"></span></th>
                                                            <th class="theader" onclick="sortOrders('created_at')">Order Date <span id="created_at-sort"></span></th>
                                                            <th class="theader" onclick="sortOrders('total')">Order Amount <span id="total-sort"></span></th>
                                                            <th>Card Number</th>
                                                            <th class="theader" onclick="sortOrders('card_type')">Card Type <span id="card_type-sort"></span></th>
                                                            <th class="theader" onclick="sortOrders('order_country')">Location <span id="order_country-sort"></span></th>
                                                        </tr>`

    displayOrders(orders, users, companies, current_currency);

    window.changeCurrency = function (currency) {
        current_currency = currency;
        const search_value = document.getElementById("search__input").value

        if (search_value !== '') {
            searchOrders()
        } else {
            displayOrders(orders, users, companies, current_currency)
            showStatistics(orders, users, current_currency)
        }
    }

    window.searchOrders = function () {
        const search_value = document.getElementById("search__input").value;
        
        const filtered_orders = orders.filter(order => {
            const user = users.find(user => user.id === order.user_id)
            if (order.transaction_id.includes(search_value) || order.total.includes(search_value) ||
                order.card_type.includes(search_value) || order.order_country.includes(search_value) ||
                order.order_ip.includes(search_value) || orderDateConverter(order.created_at).includes(search_value) ||
                user.first_name.includes(search_value) || user.last_name.includes(search_value)) {
                return order
            }
        })

        if (filtered_orders.length !== 0) {
            displayOrders(filtered_orders, users, companies, current_currency)
            showStatistics(filtered_orders, users, current_currency)
        } else {
            document.getElementById('orders-list').innerHTML = ''
            document.getElementById('orders-list').innerHTML += `<tr>
                                                                    <td>Nothing found</td>
                                                                </tr>`
            document.getElementById('orders-foot').innerHTML = `<tr>
                                                                    <td>Orders Count</td>
                                                                    <td>N/A</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Orders Total</td>
                                                                    <td>N/A</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Median Value</td>
                                                                    <td>N/A</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Average Check</td>
                                                                    <td>N/A</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Average Check (Female)</td>
                                                                    <td>N/A</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Average Check (Male)</td>
                                                                    <td>N/A</td>
                                                                </tr>`
        }
    }

    for (let element of document.getElementsByClassName("theader")) {
        element.style.cursor = 'pointer'
    }

    showStatistics(orders, users, current_currency)

    window.sortOrders = function (new_sort_parameter) {
        toggleSortParameter(new_sort_parameter)

        if (new_sort_parameter === 'name') {
            orders.sort((order1, order2) => {
                const user1 = users.find(user => user.id === order1.user_id)
                const user2 = users.find(user => user.id === order2.user_id)

                if (user1.last_name > user2.last_name) {
                    return 1
                } else {
                    return -1
                }
            })

            const search_value = document.getElementById("search__input").value

            if (search_value !== '') {
                searchOrders()
            } else {
                displayOrders(orders, users, companies, current_currency)
                showStatistics(orders, users, current_currency)
            }
            return;
        }

        if (new_sort_parameter === 'order_country') {
            orders.sort((order1, order2) => {
                if (order1[new_sort_parameter] > order2[new_sort_parameter]) {
                    return 1
                } else {
                    return -1
                }
            })

            orders.sort((order1, order2) => {
                if (order1['order_ip'] > order2['order_ip']) {
                    return 1
                } else {
                    return -1
                }
            })

            const search_value = document.getElementById("search__input").value

            if (search_value !== '') {
                searchOrders()
            } else {
                displayOrders(orders, users, companies, current_currency)
                showStatistics(orders, users, current_currency)
            }
            return;
        }

        orders.sort((order1, order2) => {
            if (new_sort_parameter === 'total') {
                if (parseFloat(order1[new_sort_parameter]) > parseFloat(order2[new_sort_parameter])) {
                    return 1
                } else {
                    return -1
                }
            } else {
                if (order1[new_sort_parameter] > order2[new_sort_parameter]) {
                    return 1
                } else {
                    return -1
                }
            }
        })

        const search_value = document.getElementById("search__input").value

        if (search_value !== '') {
            searchOrders()
        } else {
            displayOrders(orders, users, companies, current_currency)
            showStatistics(orders, users, current_currency)
        }
    }
}

function showStatistics(orders, users, current_currency) {
    const orders_count = orders.length;
    const orders_total = orders.reduce((accumulator, order) => { return accumulator + parseFloat(order.total) * parseFloat(current_currency) }, 0)
    const median_value = getMedianValue(orders, current_currency)
    const average_check = orders.reduce((accumulator, order) => { return accumulator + parseFloat(order.total) * parseFloat(current_currency) }, 0) / orders.length
    const average_check_female = orders.reduce((accumulator, order) => {
        const user = users.find(user => user.id === order.user_id)
        if (user.gender === 'Female') {
            return accumulator + parseFloat(order.total) * parseFloat(current_currency)
        } else {
            return accumulator
        }
    }, 0) / orders.length

    const average_check_male = orders.reduce((accumulator, order) => {
        const user = users.find(user => user.id === order.user_id)
        if (user.gender === 'Male') {
            return accumulator + parseFloat(order.total) * parseFloat(current_currency)
        } else {
            return accumulator
        }
    }, 0) / orders.length


    document.getElementById('orders-foot').innerHTML = `<tr>
                                                            <td>Orders Count:<br> ${orders_count}</td>
                                                            <td colspan="2">Orders Total:<br> $ ${orders_total.toFixed(3)}</td>
                                                            <td>Median Value:<br> $ ${median_value}</td>
                                                            <td>Average Check:<br> $ ${average_check.toFixed(3)}</td>
                                                            <td>Average Check (Female):<br> $ ${average_check_female.toFixed(3)}</td>
                                                            <td>Average Check (Male):<br> $ ${average_check_male.toFixed(3)}</td>
                                                        </tr>
                                                        `
}

function getMedianValue(orders, current_currency) {
    const sorted_orders = orders.sort((a, b) => parseFloat(a.total) * parseFloat(current_currency) - parseFloat(b.total) * parseFloat(current_currency));
    const median = Math.floor(sorted_orders.length / 2);

    if (sorted_orders.length % 2 === 0) {
        return (parseFloat(sorted_orders[median - 1].total) + parseFloat(sorted_orders[median].total)) / 2;
    }

    return sorted_orders[median].total * current_currency;
}

function toggleSortParameter(new_sort_parameter) {
    document.getElementById("transaction_id-sort").innerText = ' '
    document.getElementById("name-sort").innerText = ' '
    document.getElementById("created_at-sort").innerText = ' '
    document.getElementById("total-sort").innerText = ' '
    document.getElementById("card_type-sort").innerText = ' '
    document.getElementById("order_country-sort").innerText = ' '
    document.getElementById(`${new_sort_parameter}-sort`).innerText = '\u2193';
}

window.displayOrders = function (orders, users, companies, current_currency) {
    document.getElementById('orders-list').innerHTML = ''
    orders.forEach(order => {
        const user = users.find(user => user.id === order.user_id)
        const company = companies.find(company => company.id === user.company_id)

        let company_info = ``;

        if (company !== undefined) {
            company_info = `<p>Company:<br> <a href="${company.url}" target="_blank">${company.title}</a></p>
                            <p>Industry: ${company.industry}</p>`
        } else {
            company_info = ``
        }

        document.getElementById('orders-list').innerHTML += `<div class="order">
                                                                <tr id="order_${order.id}">
                                                                    <td>${order.transaction_id}</td>
                                                                    <td class="user_data">
                                                                        <a href="javascript:void();" onclick="toggleUserInfo('order_${order.id}')">${getFormattedName(user.first_name, user.last_name, user.gender)}</a>
                                                                        <div class="user-details" style="display: none;">
                                                                            <p>Birthday: ${birthdayDateConverter(user.birthday)}</p>
                                                                            <img src="${user.avatar}" width="100px">
                                                                            ${company_info}
                                                                        </div>
                                                                    </td>
                                                                    <td>${orderDateConverter(parseInt(order.created_at))}</td>
                                                                    <td>$${(parseFloat(order.total) * parseFloat(current_currency)).toFixed(3)}</td>
                                                                    <td>${getFormattedCardNumber(order.card_number)}</td>
                                                                    <td>${order.card_type}</td>
                                                                    <td>${order.order_country} (${order.order_ip})</td>
                                                                </tr>
                                                            </div>`;
    })
}

// Show/hide user information
window.toggleUserInfo = function (order_id) {
    const order_node = document.getElementById(order_id)
    const current_style = order_node.childNodes[3].childNodes[3].style.display

    if (current_style === '') {
        order_node.childNodes[3].childNodes[3].style.display = 'none'
    } else {
        order_node.childNodes[3].childNodes[3].style.display = ''
    }
}

function getFormattedCardNumber(card_number) {
    let splitted_card_number = card_number.split('')

    splitted_card_number = splitted_card_number.map((char, index) => {
        if (index > 1 && index < splitted_card_number.length - 4) {
            return char = '*'
        } else {
            return char
        }
    })

    return splitted_card_number.join('')
}

function getFormattedName(first_name, last_name, gender) {
    let result = ''

    gender === 'Male' ? result += 'Mr. ' : result += 'Ms. '

    return result += first_name + ' ' + last_name
}

// Convert ISO date of order to DD/MM/YY h:m:s
function orderDateConverter(UNIX_timestamp) {
    const date_object = new Date(UNIX_timestamp * 1000)
    const hour = date_object.getHours()
    const min = date_object.getMinutes()
    const sec = date_object.getSeconds()
    return dateConverterHelper(date_object) + hour + ':' + min + ':' + sec
}

// Convert ISO date of user's birthday to DD/MM/YY
function birthdayDateConverter(UNIX_timestamp) {
    const date_object = new Date(UNIX_timestamp * 1000)
    return dateConverterHelper(date_object)
}

function dateConverterHelper(date_object) {
    const year = date_object.getFullYear()
    const month = date_object.getMonth() + 1
    const date = date_object.getDate()
    return date + '/' + month + '/' + year + ' '
}

export {
    dateConverterHelper, birthdayDateConverter, orderDateConverter,
    getFormattedName, getFormattedCardNumber, getMedianValue,
    getUsers, showStatistics, toggleSortParameter,
    inititalize
};
module.export = inititalize();