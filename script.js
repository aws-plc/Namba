class Spreadsheet {
    constructor(rightTable, leftTable) {
        this.rightTable = rightTable;
        this.rightTableBody = rightTable.querySelector('tbody');
        this.headerRow = rightTable.querySelector('thead tr');
        this.leftTable = leftTable;
        this.leftTableBody = leftTable.querySelector('tbody');
        this.currentColumnCount = 10;
        this.numRows = 0;
        this.rowsToAdd = 50;
    }

    initializeTable(numRows) {
        this.numRows = numRows;
        this.populateLeftTable(0, numRows);

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            this.rightTableBody.appendChild(row);
        }

        this.appendColumns(0, this.currentColumnCount);

        this.rightTable.addEventListener('scroll', () => {
            const scrollLeft = this.rightTable.scrollLeft;
            const scrollWidth = this.rightTable.scrollWidth;
            const clientWidth = this.rightTable.clientWidth;
            if (scrollLeft + clientWidth >= scrollWidth - 50) {
                const columnsToAdd = 50;
                this.appendColumns(this.currentColumnCount, columnsToAdd);
                this.currentColumnCount += columnsToAdd;
            }
        });

        this.leftTable.addEventListener('scroll', () => {
            this.rightTable.scrollTop = this.leftTable.scrollTop;
        });

        this.rightTable.addEventListener('scroll', () => {
            this.leftTable.scrollTop = this.rightTable.scrollTop;
        });

        this.enableSwipe();
    }

    enableSwipe() {
        let startX = 0;
        let scrollLeft = 0;

        this.rightTable.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            scrollLeft = this.rightTable.scrollLeft;
        });

        this.rightTable.addEventListener('touchmove', (e) => {
            const x = e.touches[0].clientX;
            const walk = startX - x;
            this.rightTable.scrollLeft = scrollLeft + walk;
        });
    }

    populateLeftTable(start, end) {
        for (let i = start; i <= end; i++) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = i === 0 ? '' : i;
            row.appendChild(cell);
            this.leftTableBody.appendChild(row);
        }
    }

    appendColumns(startIndex, count) {
        const headers = generateExcelHeaders(startIndex, count);
        headers.forEach(header => {
            const cell = document.createElement('th');
            cell.textContent = header;
            this.headerRow.appendChild(cell);
        });

        const rows = this.rightTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            for (let i = 0; i < count; i++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                cell.appendChild(input);
                row.appendChild(cell);
            }
        });
    }
}

function generateExcelHeaders(startIndex, count) {
    const headers = [];
    for (let i = startIndex; i < startIndex + count; i++) {
        let column = '';
        let temp = i + 1;
        while (temp > 0) {
            const remainder = (temp - 1) % 26;
            column = String.fromCharCode(65 + remainder) + column;
            temp = Math.floor((temp - 1) / 26);
        }
        headers.push(column);
    }
    return headers;
}

document.addEventListener('DOMContentLoaded', () => {
    const rightTable = document.getElementById('right-table');
    const leftTable = document.getElementById('left-table');
    const spreadsheet = new Spreadsheet(rightTable, leftTable);
    spreadsheet.initializeTable(190);
});

