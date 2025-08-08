// Загрузка данных из Excel при открытии страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('данные.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // Преобразуем данные в нужный формат
        const tableData = jsonData.map(row => ({
            Регион: row['Наименование субъекта'],
            Код: row['Код региона для симуляции (РФ)'],
            'Адм. центр': row['Административный центр'],
            'Статус данных': row['Состояние данных по выработке СЭС, 200 кВт'],
            'Годовая выработка (МВт*ч)': row['Годовая выработка станции, МВт*ч'],
            'Удельная выработка (кВт*ч/кВт*год)': row['Удельная выработка, кВт*ч/(кВт*год)']
        }));
        
        window.tableData = tableData;
        loadTable(tableData);
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="6">Ошибка загрузки данных. Проверьте консоль.</td></tr>';
    }
});

// Заполнение таблицы
function loadTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Регион || '-'}</td>
            <td>${row.Код || '-'}</td>
            <td>${row['Адм. центр'] || '-'}</td>
            <td class="${row['Статус данных'] === 'Готово' ? 'status-ready' : 'status-not-ready'}">
                ${row['Статус данных'] || '-'}
            </td>
            <td>${row['Годовая выработка (МВт*ч)'] || '-'}</td>
            <td>${row['Удельная выработка (кВт*ч/кВт*год)'] || '-'}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Глобальная переменная для хранения всех данных
let allTableData = [];

// Загрузка данных и инициализация таблицы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('данные.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        allTableData = jsonData.map(row => ({
            Регион: row['Наименование субъекта'] || '-',
            Код: row['Код региона для симуляции (РФ)'] || '-',
            'Адм. центр': row['Административный центр'] || '-',
            'Статус данных': row['Состояние данных по выработке СЭС, 200 кВт'] || '-',
            'Годовая выработка (МВт*ч)': row['Годовая выработка станции, МВт*ч'] || '-',
            'Удельная выработка (кВт*ч/кВт*год)': row['Удельная выработка, кВт*ч/(кВт*год)'] || '-'
        }));
        
        window.tableData = [...allTableData]; // Копия для фильтрации
        loadTable(window.tableData);
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="6">Ошибка загрузки данных. Проверьте консоль.</td></tr>';
    }
});

// Функция фильтрации
function filterTable() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    window.tableData = allTableData.filter(row => {
        const matchesSearch = row.Регион.toLowerCase().includes(searchText) || 
                             row['Адм. центр'].toLowerCase().includes(searchText) ||
                             row.Код.toLowerCase().includes(searchText);
        
        const matchesStatus = statusFilter === 'all' || row['Статус данных'] === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    loadTable(window.tableData);
}

// Сброс поиска
function resetSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    filterTable();
}

// Остальные функции остаются без изменений

// Запрет копирования
document.addEventListener('copy', (e) => {
    e.preventDefault();
    alert('Копирование данных запрещено!');
});
// Language support
let currentLanguage = 'en';

const translations = {
    en: {
        title: "Solar Power Stations (200 kW) in Russian Regions",
        copyright: "Data is copyright protected. Copying prohibited.",
        searchPlaceholder: "Search by region...",
        statusAll: "All statuses",
        statusReady: "Ready",
        statusNoData: "No data",
        headers: ["Region", "Code", "Admin Center", "Data Status", "Annual Output (MWh)", "Specific Output (kWh/kW/year)"],
        toggleButton: "Русский"
    },
    ru: {
        title: "Солнечные электростанции (200 кВт) в регионах РФ",
        copyright: "Данные защищены авторским правом. Копирование запрещено.",
        searchPlaceholder: "Поиск по региону...",
        statusAll: "Все статусы",
        statusReady: "Готово",
        statusNoData: "Нет данных",
        headers: ["Регион", "Код", "Адм. центр", "Статус данных", "Годовая выработка (МВт*ч)", "Удельная выработка (кВт*ч/кВт*год)"],
        toggleButton: "English"
    }
};

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    updateLanguage();
}

function updateLanguage() {
    const t = translations[currentLanguage];
    
    document.getElementById('mainTitle').textContent = t.title;
    document.getElementById('copyrightNotice').textContent = t.copyright;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('langToggle').textContent = t.toggleButton;
    
    // Update dropdown
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.options[0].text = t.statusAll;
    statusFilter.options[1].text = t.statusReady;
    statusFilter.options[2].text = t.statusNoData;
    
    // Update table headers
    const headers = document.querySelectorAll('#dataTable th');
    headers.forEach((header, index) => {
        header.textContent = t.headers[index];
    });
    
    // Reload table data to translate statuses
    if (window.tableData) {
        loadTable(window.tableData);
    }
}

// Modified loadTable function
function loadTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const t = translations[currentLanguage];
    const statusMap = {
        'Готово': t.statusReady,
        'Нет данных': t.statusNoData
    };

    data.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.Регион || '-'}</td>
            <td>${row.Код || '-'}</td>
            <td>${row['Адм. центр'] || '-'}</td>
            <td class="${row['Статус данных'] === 'Готово' ? 'status-ready' : 'status-not-ready'}">
                ${statusMap[row['Статус данных']] || row['Статус данных'] || '-'}
            </td>
            <td>${row['Годовая выработка (МВт*ч)'] || '-'}</td>
            <td>${row['Удельная выработка (кВт*ч/кВт*год)'] || '-'}</td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Initialize with English
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    // Rest of your initialization code...
});

async function translateText(text) {
    if (currentLanguage === 'ru') return text;
    
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch {
        return text;
    }
}