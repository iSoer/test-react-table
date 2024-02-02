import { useState, useMemo } from 'react'

import dayjs from 'dayjs'

import { faker } from '@faker-js/faker'
import { Table, Checkbox } from 'antd'

// Количество фейковых элементов
const FAKE_DATA_LIMIT = 500

// Создаем фейковые данные
const createTableData = () => {
    const ret = []

    for (let i = 0; i < FAKE_DATA_LIMIT; i++) {
        ret.push({
            id: i,
            string: faker.person.fullName(),
            date: dayjs(faker.date.past()).format('YYYY MM DD HH:mm:ss'),
            number: faker.finance.accountNumber(),
            checkbox: Boolean(i % 4),
            string2: faker.internet.email(),
            date2: dayjs(faker.date.soon()).format('YYYY MM DD HH:mm:ss'),
            number2: faker.finance.pin(),
            checkbox2: Boolean(i % 10),
        })
    }

    return ret
}

// Дефолтный конфиг колонок
const columns = [
    {
        key: 'string',
        title: 'Строка',
        render: (_, row) => {
            return row.string
        },
        onFilter: (value, record) => {
            return record.string.indexOf(value) === 0
        },
        sorter: (a, b) => a.string.length - b.string.length,
    },
    {
        key: 'date',
        title: 'Дата',
        render: (_, row) => {
            return dayjs(row.date).format('YYYY MM DD HH:mm:ss')
        },
        onFilter: (value, record) => {
            return record.date.indexOf(value) === 0
        },
        sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
        key: 'number',
        title: 'Число',
        render: (_, row) => {
            return row.number
        },
        onFilter: (value, record) => {
            return record.number.indexOf(value) === 0
        },
        sorter: (a, b) => a.number - b.number,
    },
    {
        key: 'checkbox',
        title: 'Чекбокс',
        render: (_, row) => {
            return (<Checkbox checked={row.checkbox}>Checkbox</Checkbox>)
        },
        onFilter: (value, record) => {
            return record.checkbox.indexOf(value) === 0
        },
        sorter: (a, b) => a.checkbox - b.checkbox,
    },
    {
        key: 'string2',
        title: 'Строка 2',
        render: (_, row) => {
            return row.string2
        },
        onFilter: (value, record) => {
            return record.string2.indexOf(value) === 0
        },
        sorter: (a, b) => a.string2.length - b.string2.length,
    },
    {
        key: 'date2',
        title: 'Дата 2',
        render: (_, row) => {
            return dayjs(row.date2).format('YYYY MM DD HH:mm:ss')
        },
        onFilter: (value, record) => {
            return record.date2.indexOf(value) === 0
        },
        sorter: (a, b) => dayjs(a.date2).unix() - dayjs(b.date2).unix(),
    },
    {
        key: 'number2',
        title: 'Число 2',
        render: (_, row) => {
            return row.number2
        },
        onFilter: (value, record) => {
            return record.number2.indexOf(value) === 0
        },
        sorter: (a, b) => a.number2 - b.number2,
    },
    {
        key: 'checkbox2',
        title: 'Флаг 2',
        render: (_, row) => {
            return (<Checkbox checked={row.checkbox2}>Checkbox</Checkbox>)
        },
        onFilter: (value, record) => {
            return record.checkbox2.indexOf(value) === 0
        },
        sorter: (a, b) => a.checkbox2 - b.checkbox2,
    },
]

// Генерируем фильтры на лету
const createFilters = (columns, tableData) => {
    const filterConfig = {}

    for (const item of columns) {
        filterConfig[item.key] = []
    }

    for (const item of tableData) {
        for (const prop in item) {
            if (prop === 'id') {
                continue
            }

            if (!filterConfig[prop].includes(item[prop])) {
                filterConfig[prop].push(item[prop])
            }
        }
    }

    const newColumns = []

    for (const item of columns) {
        newColumns.push({
            ...item,
            filters: filterConfig[item.key].map((item) => ({
                text: item,
                value: item,
            })),
        })
    }

    return newColumns
}

// Собираем конфиг для отключения и включения стобцов
const hideColumnsCheckedList = columns.map((item) => item.key);

function App() {
    // Получаем фейковые данные
    const [tableData] = useState(createTableData())

    // Вычисляем фильтры для столбцов (т.к. используется фейкер, то почти все данные уникальные, что вызывает тормоза при больших объемах данных)
    const columnsWithFilters = useMemo(() => createFilters(columns, tableData), [tableData])

    // Формируем и кешируем options для списка чекбоксов
    const options = useMemo(() => columnsWithFilters.map(({ key, title }) => ({
        label: title,
        value: key,
    })), [])

    // Формируем конфиг скрываемых чекбоксов
    const [checkedList, setCheckedList] = useState(hideColumnsCheckedList)

    const newColumns = useMemo(() => columnsWithFilters.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.key),
    })), [columnsWithFilters, checkedList])

    return (
        <div className="App">
            <Checkbox.Group
                style={{
                    marginBottom: '20px',
                }}
                value={checkedList}
                options={options}
                onChange={(value) => {
                    setCheckedList(value)
                }}
            />
          <Table
              rowKey={'id'}
              columns={newColumns}
              dataSource={tableData}
          />
        </div>
  )
}

export default App
