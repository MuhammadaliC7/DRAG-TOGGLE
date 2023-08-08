document.addEventListener('DOMContentLoaded', function () {
    const myTable = document.getElementById('myTable').getElementsByTagName('tbody')[0];


    const savedOrder = JSON.parse(localStorage.getItem('tableOrder')) || [];


    const sortable = new Sortable(myTable, {
        animation: 150,
        onEnd: function (event) {

            const item = event.item;
            const itemId = item.getAttribute('data-id');
            const newIndex = event.newIndex;


            fetch('/update-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}', 
                },
                body: JSON.stringify({ id: itemId, order: newIndex }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data); 
                })
                .catch((error) => {
                    console.error('Xatolik yuz berdi:', error);
                });


            const tableOrder = Array.from(myTable.children).map((tr) => tr.getAttribute('data-id'));
            localStorage.setItem('tableOrder', JSON.stringify(tableOrder));
        },
    });

  
    if (savedOrder.length > 0) {
        const sortedElements = Array.from(myTable.children).sort((a, b) => {
            const aIndex = savedOrder.indexOf(a.getAttribute('data-id'));
            const bIndex = savedOrder.indexOf(b.getAttribute('data-id'));
            return aIndex - bIndex;
        });
        sortedElements.forEach((tr) => myTable.appendChild(tr));
    }
});