document.getElementById('TuploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('TjsonFile'); // Corrected the ID here
    const file = fileInput.files[0];

    if (!file) {
        alert('Prosím vyberte soubor.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const jsonData = JSON.parse(event.target.result);

            const response = await fetch('/import-Tdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (response.ok) {
                document.getElementById('TsuccessMessage').style.display = 'block';
                document.getElementById('TerrorMessage').style.display = 'none';
            } else {
                document.getElementById('TerrorMessage').style.display = 'block';
                document.getElementById('TsuccessMessage').style.display = 'none';
            }
        } catch (error) {
            document.getElementById('TerrorMessage').style.display = 'block';
            document.getElementById('TsuccessMessage').style.display = 'none';
            console.error('Chyba při načítání souboru JSON:', error);
        }
    };

    if (file instanceof Blob) {
        reader.readAsText(file);
    } else {
        alert('Vybraný soubor není platný.');
    }
});

document.getElementById('CuploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('CjsonFile'); // Corrected the ID here
    const file = fileInput.files[0];

    if (!file) {
        alert('Prosím vyberte soubor.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const jsonData = JSON.parse(event.target.result);

            const response = await fetch('/import-Cdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (response.ok) {
                document.getElementById('CsuccessMessage').style.display = 'block';
                document.getElementById('CerrorMessage').style.display = 'none';
            } else {
                document.getElementById('CerrorMessage').style.display = 'block';
                document.getElementById('CsuccessMessage').style.display = 'none';
            }
        } catch (error) {
            document.getElementById('CerrorMessage').style.display = 'block';
            document.getElementById('CsuccessMessage').style.display = 'none';
            console.error('Chyba při načítání souboru JSON:', error);
        }
    };

    if (file instanceof Blob) {
        reader.readAsText(file);
    } else {
        alert('Vybraný soubor není platný.');
    }
});
